import { NextRequest, NextResponse } from 'next/server';

interface Product {
  name: string;
  price: number;
  quantity?: number;
}

// Store for receipt data (in production, use a database)
const receiptStore: Record<string, { products: Product[] }> = {};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const products = Array.isArray((body as { products?: unknown[] })?.products)
      ? ((body as { products: unknown[] }).products)
      : [];

    if (!products.length) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    const sanitizedProducts: Product[] = products
      .map((product) => {
        const entry = product as { name?: unknown; price?: unknown; quantity?: unknown };
        return {
          name: String(entry.name ?? '').trim(),
          price: Number(entry.price),
          quantity: Number(entry.quantity || 1),
        };
      })
      .filter(
        (product) =>
          product.name.length > 0 &&
          Number.isFinite(product.price) &&
          product.price >= 0 &&
          Number.isFinite(product.quantity) &&
          product.quantity > 0
      );

    if (!sanitizedProducts.length) {
      return NextResponse.json(
        { error: 'No valid products were provided' },
        { status: 400 }
      );
    }

    const receiptId = generateId();
    receiptStore[receiptId] = { products: sanitizedProducts };

    return NextResponse.json({
      receiptId,
      products: sanitizedProducts,
    });
  } catch (error) {
    console.error('Error saving manual receipt:', error);
    return NextResponse.json(
      { error: 'Failed to save manual receipt data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const receiptId = searchParams.get('receiptId');

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      );
    }

    if (receiptStore[receiptId]) {
      return NextResponse.json({
        receiptId,
        products: receiptStore[receiptId].products,
      });
    }

    // For now, return mock data
    // In production, retrieve from database using receiptId
    const mockProducts = [
      { name: 'Organic Bananas', price: 2.49, quantity: 1 },
      { name: 'Whole Wheat Bread', price: 3.99, quantity: 1 },
      { name: 'Almond Butter', price: 7.99, quantity: 1 },
      { name: 'Greek Yogurt', price: 5.49, quantity: 2 },
      { name: 'Spinach', price: 2.99, quantity: 1 },
      { name: 'Chicken Breast', price: 8.99, quantity: 1 },
      { name: 'Brown Rice', price: 3.49, quantity: 1 },
    ];

    return NextResponse.json({
      receiptId,
      products: mockProducts,
    });
  } catch (error) {
    console.error('Error extracting receipt:', error);
    return NextResponse.json(
      { error: 'Failed to extract receipt data' },
      { status: 500 }
    );
  }
}
