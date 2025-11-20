interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
}

interface AIAnalysisRequest {
  focusTime: number;
  focusScore: number;
  subject: string;
  notes?: string;
  distractions?: number;
}

interface AIAnalysisResponse {
  feedback: string;
  suggestions: string[];
  score: number;
  nextSteps: string[];
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  async generateFocusAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.createAnalysisPrompt(request);
      const response = await this.callGemini(prompt);
      
      return this.parseAnalysisResponse(response, request.focusScore);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackAnalysis(request);
    }
  }

  async generateQuiz(subject: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium', questionCount: number = 5) {
    const prompt = `Generate a ${difficulty} level quiz about ${subject} with ${questionCount} multiple choice questions. 
    Format as JSON with this structure:
    {
      "title": "Quiz title",
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Why this is correct"
        }
      ]
    }`;

    try {
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      return this.getFallbackQuiz(subject);
    }
  }

  async summarizeNotes(content: string, style: 'concise' | 'detailed' | 'bullet-points' = 'concise') {
    const prompt = `Summarize the following study material in a ${style} format. 
    Make it clear, organized, and easy to review:
    
    ${content}
    
    Provide the summary in a format that's perfect for quick review and retention.`;

    try {
      const response = await this.callGemini(prompt);
      return {
        summary: response,
        keyPoints: this.extractKeyPoints(response),
        studyTips: await this.generateStudyTips(content)
      };
    } catch (error) {
      console.error('Note Summarization Error:', error);
      return {
        summary: 'Unable to generate summary. Please try again.',
        keyPoints: [],
        studyTips: []
      };
    }
  }

  async generateStudyPlan(subjects: string[], timeAvailable: number, goals: string[]) {
    const prompt = `Create a personalized study plan with the following parameters:
    - Subjects: ${subjects.join(', ')}
    - Available study time: ${timeAvailable} hours per week
    - Goals: ${goals.join(', ')}
    
    Format as JSON with daily schedules, time allocations, and milestones.
    Include specific techniques for each subject and break recommendations.`;

    try {
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Study Plan Generation Error:', error);
      return this.getFallbackStudyPlan();
    }
  }

  async analyzeUploadedDocument(fileContent: string, fileType: string) {
    const prompt = `Analyze this ${fileType} document and provide:
    1. Main topics covered
    2. Key concepts to focus on
    3. Suggested study approach
    4. Potential quiz questions
    5. Related topics to explore
    
    Document content:
    ${fileContent.substring(0, 4000)}${fileContent.length > 4000 ? '...' : ''}`;

    try {
      const response = await this.callGemini(prompt);
      return {
        analysis: response,
        suggestedActions: this.extractActionItems(response),
        estimatedStudyTime: this.estimateStudyTime(fileContent)
      };
    } catch (error) {
      console.error('Document Analysis Error:', error);
      return {
        analysis: 'Document uploaded successfully. Analysis will be available shortly.',
        suggestedActions: ['Review the document', 'Take notes', 'Create a summary'],
        estimatedStudyTime: 30
      };
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  }

  private createAnalysisPrompt(request: AIAnalysisRequest): string {
    return `Analyze this focus session and provide constructive feedback:

Session Details:
- Subject: ${request.subject}
- Duration: ${Math.floor(request.focusTime / 60)} minutes
- Focus Score: ${request.focusScore}%
- Notes: ${request.notes || 'No notes provided'}
- Distractions: ${request.distractions || 0}

Provide:
1. One encouraging sentence about their performance
2. 2-3 specific suggestions for improvement
3. Recommended next steps
4. Study technique recommendation

Keep it motivating and actionable. Focus on growth mindset.`;
  }

  private parseAnalysisResponse(response: string, focusScore: number): AIAnalysisResponse {
    // Simple parsing - in production, you'd want more robust parsing
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      feedback: lines[0] || 'Great focus session!',
      suggestions: lines.slice(1, 4).map(line => line.replace(/^\d+\.?\s*/, '')),
      score: focusScore,
      nextSteps: lines.slice(4).map(line => line.replace(/^\d+\.?\s*/, ''))
    };
  }

  private getFallbackAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
    const scoreMessages = {
      high: "Excellent focus! You're in the zone.",
      medium: "Good session! There's room for improvement.",
      low: "Keep practicing - focus improves with time."
    };

    const scoreLevel = request.focusScore >= 85 ? 'high' : request.focusScore >= 70 ? 'medium' : 'low';

    return {
      feedback: scoreMessages[scoreLevel],
      suggestions: [
        'Try the Pomodoro technique for better focus',
        'Create a distraction-free environment',
        'Take regular breaks to maintain concentration'
      ],
      score: request.focusScore,
      nextSteps: [
        'Set a specific goal for your next session',
        'Review your notes from today',
        'Practice active recall techniques'
      ]
    };
  }

  private getFallbackQuiz(subject: string) {
    return {
      title: `${subject} Practice Quiz`,
      questions: [
        {
          question: `What is a fundamental concept in ${subject}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: 'This is a placeholder question. Please try generating the quiz again.'
        }
      ]
    };
  }

  private getFallbackStudyPlan() {
    return {
      message: 'Study plan generation is temporarily unavailable. Please try again later.',
      basicPlan: [
        'Set aside dedicated study time daily',
        'Break complex topics into smaller chunks',
        'Use active recall and spaced repetition',
        'Take regular breaks to avoid burnout'
      ]
    };
  }

  private extractKeyPoints(summary: string): string[] {
    // Simple extraction - look for bullet points or numbered items
    const lines = summary.split('\n');
    return lines
      .filter(line => line.includes('•') || line.includes('-') || /^\d+\./.test(line))
      .map(line => line.replace(/^[•\-\d\.\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  }

  private async generateStudyTips(content: string): Promise<string[]> {
    return [
      'Use spaced repetition for better retention',
      'Create visual diagrams for complex concepts',
      'Teach the material to someone else',
      'Practice with real-world examples'
    ];
  }

  private extractActionItems(analysis: string): string[] {
    return [
      'Review key concepts',
      'Create practice questions',
      'Summarize main points',
      'Connect to previous learning'
    ];
  }

  private estimateStudyTime(content: string): number {
    // Rough estimation: 200 words per minute reading speed
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / 200);
  }
}

export const aiService = new AIService();