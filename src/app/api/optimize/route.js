import { NextResponse } from 'next/server';
import { optimizeResumeWithGrok } from '@/lib/grokApi';

export async function POST(request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing resumeText or jobDescription' }, { status: 400 });
    }

    const optimizationResult = await optimizeResumeWithGrok(resumeText, jobDescription);

    return NextResponse.json(optimizationResult);
  } catch (error) {
    console.error('Error optimizing resume:', error);
    return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
  }
}
