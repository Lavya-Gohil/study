import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuth';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const DOWNLOAD_DIR = path.join(process.cwd(), 'downloaded_papers');

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await adminAuthMiddleware(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { urls, metadata } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Create output directory
    const outputDir = path.join(
      DOWNLOAD_DIR,
      metadata.examType,
      metadata.year.toString(),
      metadata.subject
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let downloaded = 0;
    let failed = 0;
    const results = [];

    // Download each PDF
    for (const url of urls) {
      try {
        const filename = path.basename(new URL(url).pathname) || `paper_${Date.now()}.pdf`;
        const filePath = path.join(outputDir, filename);

        // Skip if already exists
        if (fs.existsSync(filePath)) {
          console.log(`Already exists: ${filename}`);
          results.push({ url, status: 'skipped', filename });
          continue;
        }

        console.log(`Downloading: ${url}`);

        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
          timeout: 60000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`✓ Downloaded: ${filename}`);
        downloaded++;
        results.push({ url, status: 'success', filename, path: filePath });

        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`✗ Failed to download ${url}:`, error.message);
        failed++;
        results.push({ url, status: 'failed', error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      downloaded,
      failed,
      total: urls.length,
      outputDir,
      results,
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download papers' },
      { status: 500 }
    );
  }
}
