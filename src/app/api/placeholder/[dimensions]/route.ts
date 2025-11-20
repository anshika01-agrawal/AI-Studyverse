import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string } }
) {
  const dimensions = params.dimensions;
  const [width, height] = dimensions.split('x').map(Number);
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgb(99, 102, 241)"/>
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.3}" fill="rgb(129, 140, 248)"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.2}">
        ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}