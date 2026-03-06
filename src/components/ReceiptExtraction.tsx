"use client";

import React, { useState, useEffect } from 'react';
import { Bungee, Open_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
});

interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  includeInScore: boolean;
}

const ReceiptExtraction = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [receiptId, setReceiptId] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('receiptId') || '';
    setReceiptId(id);
    
    if (id) {
      fetchExtractedData(id);
    } else {
      setIsLoading(false);
      setError('No receipt data found');
    }
  }, [searchParams]);

  const fetchExtractedData = async (id: string) => {
    try {
      const response = await fetch(`/api/extractReceipt?receiptId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to extract receipt data');
      }
      const data = await response.json();
      const mappedProducts = (data.products || []).map(
        (product: { name: string; price: number; quantity?: number }, index: number) => ({
          id: `${id}-${index}-${product.name}`,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          includeInScore: true,
        })
      );
      setProducts(mappedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract receipt data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIncludeInScore = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, includeInScore: !product.includeInScore }
          : product
      )
    );
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const includedProducts = products.filter((product) => product.includeInScore);
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const includedTotalPrice = includedProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ${openSans.className}`}>
      <div className="max-w-3xl mx-auto p-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">

          </div>
          <h1 className={`${bungee.className} text-3xl text-blue-900 mb-2`}>
            Receipt Summary
          </h1>
          <p className="text-gray-600">
            Verify your purchased items
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-600">Extracting receipt data...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No products found in receipt</p>
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <>
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                Select which products should be included in your score. Removing deletes them from this list.
              </div>
              {/* Products Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Include</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={product.includeInScore}
                            onChange={() => toggleIncludeInScore(product.id)}
                            aria-label={`Include ${product.name} in score`}
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-800">{product.name}</td>
                        <td className="text-center py-3 px-4 text-gray-600">{product.quantity || 1}</td>
                        <td className="text-right py-3 px-4 font-medium text-gray-800">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="rounded bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">All items total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Included in score:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${includedTotalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={() => window.location.href = '/receipt'}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Upload Another Receipt
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                >
                  Continue to Report
                </Link>
              </div>

              {/* Info Message */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Review the items above and proceed to get personalized feedback on your grocery shopping.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptExtraction;
