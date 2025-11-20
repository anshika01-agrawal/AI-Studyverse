# AI Integration Guide - Google Gemini & Advanced Features

## 🤖 Google Gemini Setup

### Step 1: Get API Key
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create new project or select existing
5. Copy the API key

### Step 2: Configure Environment
Add to `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=AIza...your-gemini-api-key
```

### Step 3: Verify Integration
The AI service is already implemented in `src/services/aiService.ts`. Test it by:
1. Starting a focus session
2. Adding notes
3. Ending session to see AI feedback

## 🎯 Focus Score AI Implementation

### Current Status: Mock Implementation
The focus score currently uses random values. Here's how to implement real AI-powered focus detection:

### Option 1: Browser-Based Detection (Privacy-First)
```typescript
// src/services/focusDetection.ts
export class FocusDetectionService {
  private mediaStream: MediaStream | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;

  async initializeBrowserDetection(): Promise<boolean> {
    try {
      // Request camera and microphone permissions
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      // Initialize AI models (TensorFlow.js)
      await this.loadFaceDetectionModel();
      await this.loadAudioAnalysisModel();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize focus detection:', error);
      return false;
    }
  }

  private async loadFaceDetectionModel() {
    // Use MediaPipe or TensorFlow.js for face/eye tracking
    // Example: @mediapipe/face_mesh or @tensorflow-models/face-landmarks-detection
  }

  startRealTimeFocusAnalysis(callback: (score: number) => void) {
    this.analysisInterval = setInterval(async () => {
      const metrics = await this.analyzeCurrentState();
      const focusScore = this.calculateFocusScore(metrics);
      callback(focusScore);
    }, 3000); // Update every 3 seconds
  }

  private async analyzeCurrentState(): Promise<FocusMetrics> {
    const eyeTracking = await this.analyzeEyeMovement();
    const postureAnalysis = await this.analyzePosture();
    const audioLevel = await this.analyzeAudioLevel();
    
    return {
      eyeGazeScore: eyeTracking.focusScore,
      postureScore: postureAnalysis.alertnessScore,
      distractionEvents: this.getTabSwitchCount(),
      ambientNoise: audioLevel.distractionScore
    };
  }
}
```

### Option 2: Desktop App Integration
For more accurate detection, consider building an Electron wrapper:

```bash
# Create Electron wrapper
npm install -g electron-builder
npm install electron electron-builder
```

This allows access to:
- Screen recording for app switching detection
- System-level audio analysis
- More precise camera access
- Keyboard/mouse activity patterns

### Option 3: External Camera Feed Analysis
For production-level accuracy:

```typescript
// Integration with specialized hardware
interface ExternalCameraConfig {
  deviceId: string;
  resolution: '720p' | '1080p';
  frameRate: 30 | 60;
  aiProvider: 'azure-cognitive' | 'aws-rekognition' | 'google-vision';
}

class ExternalFocusDetection {
  async setupExternalCamera(config: ExternalCameraConfig) {
    // Stream camera feed to cloud AI service
    // Get real-time attention/engagement scores
    // Return structured focus metrics
  }
}
```

## 📚 Document Processing Pipeline

### PDF Text Extraction
```bash
npm install pdf-parse react-pdf
```

```typescript
// src/services/documentProcessor.ts
import pdf from 'pdf-parse';

export class DocumentProcessor {
  async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    return data.text;
  }

  async processDocument(file: File): Promise<ProcessedDocument> {
    let text = '';
    
    if (file.type === 'application/pdf') {
      text = await this.extractTextFromPDF(file);
    } else if (file.type.startsWith('text/')) {
      text = await file.text();
    } else if (file.type.startsWith('image/')) {
      text = await this.extractTextFromImage(file);
    }

    // Generate embeddings for semantic search
    const embeddings = await this.generateEmbeddings(text);
    
    // Create knowledge base entry
    await this.saveToKnowledgeBase(file.name, text, embeddings);
    
    // Generate AI insights
    const insights = await aiService.analyzeUploadedDocument(text, file.type);
    
    return {
      fileName: file.name,
      content: text,
      insights,
      embeddings
    };
  }

  private async extractTextFromImage(file: File): Promise<string> {
    // Use Tesseract.js for OCR
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker();
    const { data } = await worker.recognize(file);
    await worker.terminate();
    return data.text;
  }
}
```

### Image OCR Setup
```bash
npm install tesseract.js
```

## 🧠 Advanced AI Features Implementation

### 1. Intelligent Quiz Generation
```typescript
// Enhanced quiz generation with difficulty adaptation
export async function generateAdaptiveQuiz(
  subject: string, 
  userPerformanceHistory: QuizResult[],
  targetDifficulty?: 'adaptive' | 'easy' | 'medium' | 'hard'
) {
  const difficulty = targetDifficulty === 'adaptive' 
    ? calculateOptimalDifficulty(userPerformanceHistory)
    : targetDifficulty;

  const prompt = `Generate a ${difficulty} quiz for ${subject}...`;
  
  // Use function calling for structured output
  const response = await geminiWithFunctionCalling(prompt, quizSchema);
  return response;
}
```

### 2. Personalized Study Plans
```typescript
export async function generateStudyPlan(userProfile: UserProfile) {
  const prompt = `
    Create a personalized study plan for a student with:
    - Available time: ${userProfile.availableHours} hours/week
    - Learning style: ${userProfile.learningStyle}
    - Current subjects: ${userProfile.subjects.join(', ')}
    - Weak areas: ${userProfile.weakAreas.join(', ')}
    - Goals: ${userProfile.goals.join(', ')}
    
    Include:
    1. Weekly schedule with specific time blocks
    2. Study techniques for each subject
    3. Break intervals and durations
    4. Progress milestones
    5. Adaptive adjustments based on performance
  `;

  const studyPlan = await aiService.generateStudyPlan(
    userProfile.subjects,
    userProfile.availableHours,
    userProfile.goals
  );

  return studyPlan;
}
```

### 3. Real-time Study Coaching
```typescript
export class AIStudyCoach {
  private conversationHistory: AIChatMessage[] = [];

  async getStudyHelp(
    userQuestion: string, 
    currentSubject: string,
    studyContext: StudyContext
  ): Promise<string> {
    const contextPrompt = `
      You are an expert study coach helping with ${currentSubject}.
      Current session: ${studyContext.sessionDuration} minutes
      Focus score: ${studyContext.currentFocusScore}%
      Recent topics: ${studyContext.recentTopics.join(', ')}
      
      Student question: "${userQuestion}"
      
      Provide helpful, encouraging, and actionable advice.
      Keep responses concise but comprehensive.
    `;

    const response = await aiService.callGemini(contextPrompt);
    
    // Store interaction for personalization
    this.conversationHistory.push({
      id: Date.now().toString(),
      role: 'user',
      content: userQuestion,
      timestamp: new Date()
    });

    return response;
  }
}
```

## 🎥 Video Integration - LiveKit Setup

### Step 1: LiveKit Cloud Account
1. Go to [LiveKit Cloud](https://cloud.livekit.io/)
2. Create account and new project
3. Copy API credentials

### Step 2: Install Dependencies
```bash
npm install livekit-client livekit-server-sdk
```

### Step 3: Environment Variables
```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

### Step 4: Implementation
```typescript
// src/services/livekitService.ts
import { Room, RoomEvent, Track } from 'livekit-client';

export class StudyRoomService {
  private room: Room | null = null;

  async joinStudyRoom(roomName: string, participantName: string) {
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    // Set up event listeners
    this.room.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
    this.room.on(RoomEvent.ParticipantConnected, this.handleParticipantJoined);

    // Get access token from your backend
    const token = await this.getAccessToken(roomName, participantName);
    
    // Connect to room
    await this.room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
    
    // Enable camera and microphone
    await this.room.localParticipant.enableCameraAndMicrophone();
  }

  private async getAccessToken(roomName: string, participantName: string): Promise<string> {
    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName })
    });
    
    const { token } = await response.json();
    return token;
  }
}
```

### Step 5: API Route for Tokens
Create `src/app/api/livekit/token/route.ts`:
```typescript
import { AccessToken } from 'livekit-server-sdk';

export async function POST(request: Request) {
  const { roomName, participantName } = await request.json();

  const token = new AccessToken(
    process.env.NEXT_PUBLIC_LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
    }
  );

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return Response.json({ token: token.toJwt() });
}
```

## 🔧 Performance Optimization

### 1. AI Response Caching
```typescript
// Cache AI responses to reduce API costs
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function getCachedResponse(prompt: string): string | null {
  const cached = responseCache.get(prompt);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  return null;
}

export function setCachedResponse(prompt: string, response: string) {
  responseCache.set(prompt, { response, timestamp: Date.now() });
}
```

### 2. Real-time Updates Optimization
```typescript
// Debounce real-time updates to reduce Firebase writes
import { debounce } from 'lodash';

const debouncedFocusScoreUpdate = debounce(async (score: number) => {
  await firebaseService.updateFocusScore(score);
}, 5000); // Update every 5 seconds maximum
```

## 💡 Advanced Features Roadmap

### Phase 1: Enhanced AI (Weeks 3-4)
- [ ] Real browser-based focus detection
- [ ] Advanced document processing with OCR
- [ ] Intelligent quiz difficulty adaptation
- [ ] Personalized study plan generation

### Phase 2: Advanced Analytics (Weeks 5-6)
- [ ] Learning style detection
- [ ] Predictive performance modeling
- [ ] Burnout risk assessment
- [ ] Optimal study schedule recommendations

### Phase 3: Social Learning (Weeks 7-8)
- [ ] AI-moderated group discussions
- [ ] Peer learning recommendations
- [ ] Collaborative note-taking with AI summarization
- [ ] Study group formation based on compatibility

### Phase 4: Mobile & Accessibility (Weeks 9-10)
- [ ] Progressive Web App (PWA) optimization
- [ ] Offline mode with sync
- [ ] Accessibility features (screen readers, etc.)
- [ ] Multi-language AI support

The AI integration foundation is complete. Focus on implementing the features that provide the most value to your target users first!