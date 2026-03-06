'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface WeeklyData {
  weeks: string[];
  error: string | null;
}

export default function FeedbackPage() {
  const params = useParams();
  const feedbackId = params.feedbackId as string;
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    weeks: [],
    error: null
  });

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await fetch(`/api/getWeeks?feedbackId=${feedbackId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weeks');
        }
        const data = await response.json();
        setWeeklyData({
          weeks: data.weeks,
          error: null
        });
      } catch (err) {
        setWeeklyData({
          weeks: [],
          error: err instanceof Error ? err.message : 'Failed to fetch weeks'
        });
      }
    };

    fetchWeeks();
  }, [feedbackId]);

  if (weeklyData.error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading weeks: {weeklyData.error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Weekly Reports for {feedbackId}</h1>
      <div className="space-y-2">
        {weeklyData.weeks.map((week) => (
          <Link
            key={week}
            href={`/${feedbackId}/${week}`}
            className="block w-full p-4 text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            Week {week}
          </Link>
        ))}
      </div>
    </div>
  );
}