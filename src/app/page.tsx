'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FolderStructure {
  folders: string[];
  error: string | null;
}

export default function Home() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({
    folders: [],
    error: null
  });

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('/api/getFolders');
        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }
        const data = await response.json();
        setFolderStructure({
          folders: data.folders,
          error: null
        });
      } catch (err) {
        setFolderStructure({
          folders: [],
          error: err instanceof Error ? err.message : 'Failed to fetch folders'
        });
      }
    };

    fetchFolders();
  }, []);

  if (folderStructure.error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading folders: {folderStructure.error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grocery Feedback Report</h1>
      
      <div className="mb-6">
        <Link
          href="/receipt"
          className="inline-block bg-blue-800 text-blue-50 px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors font-semibold"
        >
          Upload Receipt
        </Link>
      </div>
    </div>
  );
}