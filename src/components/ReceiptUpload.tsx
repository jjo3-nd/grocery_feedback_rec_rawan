"use client";

import React, { useState } from 'react';
import { Bungee, Open_Sans } from 'next/font/google';

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
});

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = Math.floor(4.5 * 1024 * 1024);
const MAX_FILE_SIZE_LABEL = '4.5MB';

type EntryMode = 'upload' | 'manual';

interface ManualItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
}

const createManualItem = () => ({
  id: Math.random().toString(36).slice(2),
  name: '',
  quantity: '1',
  price: '',
});

const ReceiptUpload = () => {
  const [entryMode, setEntryMode] = useState<EntryMode>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [manualItems, setManualItems] = useState<ManualItem[]>([createManualItem()]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appendSelectedFiles = (incoming: File[]) => {
    if (!incoming.length) {
      return;
    }

    const validFiles: File[] = [];
    const invalidMessages: string[] = [];

    for (const selectedFile of incoming) {
      if (!ALLOWED_TYPES.has(selectedFile.type)) {
        invalidMessages.push(`${selectedFile.name}: unsupported file type`);
        continue;
      }

      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        invalidMessages.push(`${selectedFile.name}: file is larger than ${MAX_FILE_SIZE_LABEL}`);
        continue;
      }

      validFiles.push(selectedFile);
    }

    if (validFiles.length) {
      setFiles((prev) => {
        const existing = new Set(prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
        const uniqueAdditions = validFiles.filter(
          (f) => !existing.has(`${f.name}-${f.size}-${f.lastModified}`)
        );
        return [...prev, ...uniqueAdditions];
      });
    }

    if (invalidMessages.length) {
      setError(invalidMessages.join(', '));
    } else {
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendSelectedFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    );
  };

  const updateManualItem = (id: string, field: keyof Omit<ManualItem, 'id'>, value: string) => {
    setManualItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addManualItem = () => {
    setManualItems((prev) => [...prev, createManualItem()]);
  };

  const removeManualItem = (id: string) => {
    setManualItems((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleUploadSubmit = async () => {
    if (!files.length) {
      setError('Please select at least one receipt file');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch('/api/uploadReceipt', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to upload receipt files');
    }

    const data = await response.json();
    const receiptId = data.receiptId || '';

    window.location.href = `/receipt-extraction?receiptId=${receiptId}`;
  };

  const handleManualSubmit = async () => {
    const cleanedItems = manualItems
      .map((item) => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }))
      .filter((item) => item.name.length > 0);

    if (!cleanedItems.length) {
      setError('Add at least one item name for manual entry');
      return;
    }

    const hasInvalidNumbers = cleanedItems.some(
      (item) =>
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.price) ||
        item.price < 0
    );

    if (hasInvalidNumbers) {
      setError('Quantity must be greater than 0 and price must be 0 or more');
      return;
    }

    const response = await fetch('/api/extractReceipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products: cleanedItems }),
    });

    if (!response.ok) {
      throw new Error('Failed to save manual list');
    }

    const data = await response.json();
    const receiptId = data.receiptId || '';

    window.location.href = `/receipt-extraction?receiptId=${receiptId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (entryMode === 'upload') {
        await handleUploadSubmit();
      } else {
        await handleManualSubmit();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit receipt data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ${openSans.className}`}>
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className={`${bungee.className} text-5xl text-blue-900 mb-2`}>
            Grocery Receipt
          </h1>
          <p className="text-gray-600">
            Upload receipts or enter your grocery list manually
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setEntryMode('upload');
                setError('');
              }}
              className={`rounded-lg py-2 font-semibold transition-colors ${
                entryMode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Upload Receipt
            </button>
            <button
              type="button"
              onClick={() => {
                setEntryMode('manual');
                setError('');
              }}
              className={`rounded-lg py-2 font-semibold transition-colors ${
                entryMode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Enter Manually
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {entryMode === 'upload' && (
              <div className="space-y-4">
                <label className="block text-gray-700 font-semibold">
                  Upload Receipts
                </label>
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-12 h-12 text-blue-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload-files"
                  />
                  <label
                    htmlFor="receipt-upload-files"
                    className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Choose Files
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-camera-capture"
                  />
                  <label
                    htmlFor="receipt-camera-capture"
                    className="mt-3 cursor-pointer bg-white text-blue-700 border border-blue-300 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    Use Camera
                  </label>

                  <p className="mt-3 text-sm text-gray-600">
                    JPG, PNG, or PDF. You can select multiple files. Max {MAX_FILE_SIZE_LABEL} each.
                  </p>

                  {files.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg w-full">
                      <p className="text-sm text-green-700 font-medium mb-2">
                        Selected files: {files.length}
                      </p>
                      <ul className="space-y-2">
                        {files.map((selectedFile) => (
                          <li
                            key={`${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`}
                            className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            <span className="truncate mr-3">{selectedFile.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(selectedFile)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {entryMode === 'manual' && (
              <div className="space-y-4">
                <label className="block text-gray-700 font-semibold">
                  Enter Grocery Items
                </label>
                <div className="space-y-3">
                  {manualItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-6">
                        <label className="block text-xs text-gray-500 mb-1">Item</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateManualItem(item.id, 'name', e.target.value)}
                          placeholder="e.g. Milk"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateManualItem(item.id, 'quantity', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateManualItem(item.id, 'price', e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeManualItem(item.id)}
                          disabled={manualItems.length === 1}
                          className="w-full rounded-lg border border-red-200 text-red-600 py-2 text-sm hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Remove item ${index + 1}`}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addManualItem}
                  className="bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Add Another Item
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || (entryMode === 'upload' && !files.length)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Tips for best results:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">-</span>
                <span>Take a clear photo of your entire receipt</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">-</span>
                <span>Ensure all items and prices are visible</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">-</span>
                <span>Manual entry should include item name, quantity, and price</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;
