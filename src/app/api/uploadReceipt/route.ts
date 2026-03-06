import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(request: NextRequest) {
  try {
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
          { error: `File exceeds 10MB: ${file.name}` },
          { status: 400 }
        );
      }
    }

    const receiptId = generateId();
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'receipts');

    await mkdir(uploadsDir, { recursive: true });

    const filenames: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = sanitizeFilename(file.name);
      const filename = `${receiptId}-${index + 1}-${safeName}`;
      const filepath = join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      filenames.push(filename);
    }

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
      filenames,
      uploadedCount: filenames.length,
      products: mockProducts,
    });
  } catch (error) {
    console.error('Error uploading receipts:', error);
    return NextResponse.json({ error: 'Failed to upload receipts' }, { status: 500 });
  }
}
