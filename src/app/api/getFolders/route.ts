import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the absolute path to the public/data directory
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    
    // Read the directory
    const folders = fs.readdirSync(dataDirectory).filter(item => {
      const itemPath = path.join(dataDirectory, item);
      return fs.statSync(itemPath).isDirectory();
    });

    // Return the list of folders
    return NextResponse.json({ folders });
  } catch {
    return NextResponse.json({ error: 'Failed to read folders' }, { status: 500 });
  }
}