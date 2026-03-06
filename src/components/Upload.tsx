"use client";

import React, { useState } from 'react';
import { Bungee, Open_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
});

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Please upload a PDF file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    // Here you would implement the file upload logic
    console.log('Uploading file:', file.name);
    // After successful upload, you could redirect back to the main page
  };

  return (
    <div className={`min-h-screen bg-white ${openSans.className}`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image 
              src="/FINs.png" 
              alt="Food Logo" 
              width={64} 
              height={64} 
              className="h-8 w-auto"
            />
            <h1 className={`${bungee.className} text-2xl text-blue-900`}>
              Upload Receipt
            </h1>
          </div>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium">
                Upload your receipt (PDF only)
              </label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose PDF File
                </label>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`${bungee.className} w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors`}
              disabled={!file}
            >
              Upload Receipt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;