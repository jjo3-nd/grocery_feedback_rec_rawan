'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import NutritionFeedback from '@/components/NutritionFeedback';
import ReactGA from 'react-ga4';

export default function WeeklyFeedbackPage() {
  const params = useParams();
  const feedbackId = params.feedbackId as string;
  const weekId = params.weekId as string;

  const handleReportLinkClick = () => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      ReactGA.event({
        category: 'Navigation',
        action: 'Clicked View Other Report Button',
        label: `View Week 1-2 Report from ${weekId} for ${feedbackId}`, // Dynamic label for more context
      });
      console.log('GA Event: Clicked View Week 1-2 Report');
    }
  };

  return (
    <div className="relative">
      {weekId !== 'week1-2' && (
        <div className="absolute right-4 top-4 z-10">
          <Link
            href={`/${feedbackId}/week1-2`}
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleReportLinkClick}
          >
            View Last Week's Report
          </Link>
        </div>
      )}
      <NutritionFeedback feedbackId={feedbackId} weekId={weekId} />
    </div>
  );
}