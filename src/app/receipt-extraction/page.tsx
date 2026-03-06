import { Suspense } from 'react';
import ReceiptExtraction from '../../components/ReceiptExtraction';

export default function ReceiptExtractionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading receipt...</div>}>
      <ReceiptExtraction />
    </Suspense>
  );
}
