import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const feedbackId = searchParams.get('feedbackId');

  if (!feedbackId) {
    return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
  }

  try {
    // Get the absolute path to the specific user's data directory
    const userDirectory = path.join(process.cwd(), 'public', 'data', feedbackId);
    
    // Read the directory
    const weeks = fs.readdirSync(userDirectory).filter(item => {
      const itemPath = path.join(userDirectory, item);
      return fs.statSync(itemPath).isDirectory();
    });

    // Return the list of weeks
    return NextResponse.json({ weeks });
  } catch {
    return NextResponse.json({ error: 'Failed to read weeks' }, { status: 500 });
  }
}