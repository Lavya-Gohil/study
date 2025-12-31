'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState('');
  const [examType, setExamType] = useState('JEE_Main');
  const [year, setYear] = useState(2024);
  const [subject, setSubject] = useState('Physics');
  const [source, setSource] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [parseStatus, setParseStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // For now, allow any logged-in user (TEMPORARY)
    // Remove this check in production to restrict to specific email
    console.log('Logged in as:', session.user?.email);
  }, [session, status, router]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDownload = async () => {
    if (!urls.trim()) {
      alert('Please enter at least one URL');
      return;
    }

    setIsDownloading(true);
    setDownloadStatus('Starting download...');

    try {
      const urlList = urls.split('\n').filter(u => u.trim());
      
      const res = await fetch('/api/admin/download-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: urlList,
          metadata: {
            examType,
            year,
            subject,
            source: source || `${examType} ${year}`,
          },
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setDownloadStatus(`✓ Downloaded ${data.downloaded} files, ${data.failed} failed`);
      } else {
        setDownloadStatus(`✗ Error: ${data.error}`);
      }
    } catch (error: any) {
      setDownloadStatus(`✗ Error: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleParse = async () => {
    setIsParsing(true);
    setParseStatus('Parsing PDFs...');

    try {
      const res = await fetch('/api/admin/parse-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            examType,
            year,
            subject,
            source: source || `${examType} ${year}`,
          },
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setParseStatus(`✓ Parsed ${data.questionCount} questions from ${data.filesProcessed} files`);
      } else {
        setParseStatus(`✗ Error: ${data.error}`);
      }
    } catch (error: any) {
      setParseStatus(`✗ Error: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus('Importing questions to database...');

    try {
      const res = await fetch('/api/admin/import-questions', {
        method: 'POST',
      });

      const data = await res.json();
      
      if (res.ok) {
        setImportStatus(`✓ Imported ${data.imported}, Skipped ${data.skipped} duplicates, ${data.errors} errors`);
        await loadStats(); // Refresh stats
      } else {
        setImportStatus(`✗ Error: ${data.error}`);
      }
    } catch (error: any) {
      setImportStatus(`✗ Error: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFullProcess = async () => {
    await handleDownload();
    await handleParse();
    await handleImport();
  };

  if (status === 'loading') {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="app-shell py-8 px-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="glass-card glass-shimmer rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-600 mt-1">Question Bank Management</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-sm text-blue-600 font-medium">Total Questions</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total || 0}</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-sm text-green-600 font-medium">JEE Main</p>
                <p className="text-2xl font-bold text-green-900">{stats.jeeMain || 0}</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-sm text-purple-600 font-medium">NEET</p>
                <p className="text-2xl font-bold text-purple-900">{stats.neet || 0}</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-sm text-orange-600 font-medium">CBSE</p>
                <p className="text-2xl font-bold text-orange-900">{stats.cbse || 0}</p>
              </div>
            </div>
          )}

          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-select"
              >
                <option value="JEE_Main">JEE Main</option>
                <option value="JEE_Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
                <option value="CBSE_10">CBSE Class 10</option>
                <option value="CBSE_12">CBSE Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2020"
                max="2025"
                className="w-full px-4 py-2 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-select"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source (Optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., NTA JEE Main 2024"
                className="w-full px-4 py-2 rounded-xl glass-input"
              />
            </div>
          </div>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF URLs (one per line)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com/paper1.pdf&#10;https://example.com/paper2.pdf&#10;https://example.com/paper3.pdf"
              rows={6}
              className="w-full px-4 py-2 rounded-xl glass-input font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? '⏳ Downloading...' : '1. Download PDFs'}
            </button>

            <button
              onClick={handleParse}
              disabled={isParsing}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? '⏳ Parsing...' : '2. Parse Questions'}
            </button>

            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? '⏳ Importing...' : '3. Import to DB'}
            </button>

            <button
              onClick={handleFullProcess}
              disabled={isDownloading || isParsing || isImporting}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚡ Run All Steps
            </button>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            {downloadStatus && (
              <div className={`p-4 rounded-xl ${downloadStatus.includes('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-medium">Download: {downloadStatus}</p>
              </div>
            )}
            {parseStatus && (
              <div className={`p-4 rounded-xl ${parseStatus.includes('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-medium">Parse: {parseStatus}</p>
              </div>
            )}
            {importStatus && (
              <div className={`p-4 rounded-xl ${importStatus.includes('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-medium">Import: {importStatus}</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Configure the exam type, year, subject, and source</li>
            <li>Paste PDF URLs (one per line) from official exam board websites</li>
            <li>Click "1. Download PDFs" to fetch the papers</li>
            <li>Click "2. Parse Questions" to extract questions using AI patterns</li>
            <li>Click "3. Import to DB" to add questions to the database</li>
            <li>Or click "⚡ Run All Steps" to automate the entire process</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Large batches may take several minutes. The system automatically handles duplicates and validates question format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
