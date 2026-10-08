import React, { useState } from 'react';
import { sounds } from '../audio/soundManager';
import { downloadHtmlJsPackZip, downloadStandaloneSingleHtml } from '../utils/exportBundle';
import { X, Download, FileCode, Archive, Sparkles, CheckCircle } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const [downloading, setDownloading] = useState<'zip' | 'html' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadZip = async () => {
    try {
      setDownloading('zip');
      sounds.playPurr();
      await downloadHtmlJsPackZip();
      setDownloadSuccess('Complete HTML/JS Pack (.zip) downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadSingleHtml = () => {
    try {
      setDownloading('html');
      sounds.playPurr();
      downloadStandaloneSingleHtml();
      setDownloadSuccess('Standalone single index.html downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl w-full max-w-lg shadow-2xl border-4 border-amber-400 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-800 text-white flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <Download className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-black font-['Fredoka']">Export Game Pack</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-amber-700 active:scale-95 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-sm text-amber-950 font-medium">
            Download your compiled game pack to play offline or upload to <strong>itch.io</strong>, <strong>GitHub Pages</strong>, <strong>Netlify</strong>, or any web hosting!
          </p>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center gap-2 text-emerald-900 font-bold text-xs animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Option 1: Complete HTML/JS Zip Pack */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-md hover:border-amber-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl mt-0.5">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-amber-950 font-['Fredoka']">
                  Complete HTML/JS Web Pack (.zip)
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Includes <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-amber-900">index.html</code> + all bundled JavaScript & CSS in <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-amber-900">assets/</code>. Perfect for uploading to itch.io (as HTML5 game zip) or static hosts!
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={downloading !== null}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold font-['Fredoka'] rounded-2xl shadow-md border-2 border-blue-400 flex items-center justify-center gap-2 text-sm whitespace-nowrap transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'zip' ? 'Packaging...' : 'Download ZIP'}</span>
            </button>
          </div>

          {/* Option 2: 100% Single-File index.html (Zero folder dependencies!) */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-md hover:border-emerald-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl mt-0.5">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-amber-950 font-['Fredoka']">
                    Standalone Single HTML File
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300">
                    All-in-One
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  One single <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-emerald-900">index.html</code> with all JS, CSS, and sound synthesizers inlined! Zero assets folder needed—just double-click to play anywhere!
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadSingleHtml}
              disabled={downloading !== null}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold font-['Fredoka'] rounded-2xl shadow-md border-2 border-emerald-400 flex items-center justify-center gap-2 text-sm whitespace-nowrap transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'html' ? 'Exporting...' : 'Download .html'}</span>
            </button>
          </div>

          {/* Quick instructions */}
          <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-300 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ready to upload:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-950">
              <li><strong>itch.io:</strong> Upload the <code>.zip</code> file and set project kind to <em>HTML</em>, check <em>"This file will be played in the browser"</em>.</li>
              <li><strong>Offline play:</strong> Simply download the <em>Standalone Single HTML File</em> and double-click to play in Chrome, Safari, Edge, or Firefox!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
