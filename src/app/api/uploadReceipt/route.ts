import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = Math.floor(4.5 * 1024 * 1024);
const MAX_FILE_SIZE_LABEL = '4.5MB';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const multiFiles = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File);

    const singleFile = formData.get('file');
    const files = multiFiles.length
      ? multiFiles
      : singleFile instanceof File
        ? [singleFile]
        : [];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File exceeds ${MAX_FILE_SIZE_LABEL}: ${file.name}` },
          { status: 400 }
        );
      }
    }

    const receiptId = generateId();
    const uploadedFiles = await Promise.all(
      files.map(async (file, index) => {
        const safeName = sanitizeFilename(file.name);

        return put(`receipts/${receiptId}/${index + 1}-${safeName}`, file, {
          access: 'public',
          addRandomSuffix: true,
          ...(file.type ? { contentType: file.type } : {}),
        });
      })
    );

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
      filenames: uploadedFiles.map((uploadedFile) => uploadedFile.pathname),
      fileUrls: uploadedFiles.map((uploadedFile) => uploadedFile.url),
      uploadedCount: uploadedFiles.length,
      products: mockProducts,
    });
  } catch (error) {
    console.error('Error uploading receipts:', error);
    return NextResponse.json({ error: 'Failed to upload receipts' }, { status: 500 });
  }
}
