import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get raw data with headers (Row 1 is actual headers)
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (rawData.length < 2) {
      return NextResponse.json({ error: 'Excel file is empty or missing headers' }, { status: 400 });
    }

    const headers = (rawData[1] as string[]).map(h => h ? h.trim() : h);
    const rows = rawData.slice(2);

    // Map rows to structured objects
    const students = rows.map((row: any) => {
      const student: any = {};
      headers.forEach((header, index) => {
        if (header) {
          student[header] = row[index] !== undefined ? row[index] : null;
        }
      });
      return student;
    });

    return NextResponse.json({ 
      headers: headers.filter(h => h !== null && h !== undefined), 
      students 
    });

  } catch (error) {
    console.error('Excel import error:', error);
    return NextResponse.json({ error: 'Failed to process Excel file' }, { status: 500 });
  }
}
