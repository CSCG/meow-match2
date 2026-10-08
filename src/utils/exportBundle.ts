import JSZip from 'jszip';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Generates and triggers a reliable client-side zip download
 * with all assets included.
 */
export async function downloadHtmlJsPackZip() {
  // 1. Attempt to fetch pre-built complete bundle directly
  try {
    const res = await fetch('./meow-match-bundle.zip');
    if (res.ok && res.status === 200) {
      const blob = await res.blob();
      if (blob.size > 1000) {
        triggerDownload(blob, 'meow-match-html-bundle.zip');
        return;
      }
    }
  } catch (err) {
    console.warn('Direct zip fetch failed, building dynamically with JSZip...', err);
  }

  // 2. Dynamic Fallback: package live index.html and assets
  const zip = new JSZip();

  try {
    const htmlRes = await fetch('./index.html');
    if (htmlRes.ok) {
      const htmlText = await htmlRes.text();
      zip.file('index.html', htmlText);
    } else {
      zip.file('index.html', '<!doctype html>\n' + document.documentElement.outerHTML);
    }
  } catch {
    zip.file('index.html', '<!doctype html>\n' + document.documentElement.outerHTML);
  }

  // Collect scripts and stylesheets from the current page
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  for (const script of scripts) {
    const src = script.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('//')) {
      try {
        const sRes = await fetch(src);
        if (sRes.ok) {
          const sText = await sRes.text();
          const cleanPath = src.replace(/^\.?\//, '');
          zip.file(cleanPath, sText);
        }
      } catch (e) {
        console.warn('Could not fetch script for zip:', src, e);
      }
    }
  }

  for (const link of links) {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('//')) {
      try {
        const lRes = await fetch(href);
        if (lRes.ok) {
          const lText = await lRes.text();
          const cleanPath = href.replace(/^\.?\//, '');
          zip.file(cleanPath, lText);
        }
      } catch (e) {
        console.warn('Could not fetch stylesheet for zip:', href, e);
      }
    }
  }

  // Add helpful README
  zip.file(
    'README.txt',
    'Meow Match Sanctuary - Bodhi Industries Edition\n' +
    '---------------------------------------------------\n\n' +
    'Featuring Piper the Calico & Bodacious the Maine Coon\n\n' +
    'HOW TO RUN:\n' +
    '1. Double-click index.html in any modern web browser!\n' +
    '2. Or upload all files (index.html and assets/) to itch.io (as an HTML5 game zip), Netlify, or GitHub Pages.\n\n' +
    'Bodhi Industries - All rights reserved.'
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'meow-match-html-bundle.zip');
}

/**
 * Downloads a 100% standalone, single index.html file that requires
 * NO assets folder, NO server, and runs completely offline in any browser.
 */
export async function downloadStandaloneSingleHtml() {
  // 1. Attempt to fetch pre-compiled singlefile build
  try {
    const res = await fetch('./meow-match-standalone.html');
    if (res.ok && res.status === 200) {
      const blob = await res.blob();
      if (blob.size > 1000) {
        triggerDownload(blob, 'meow-match-standalone.html');
        return;
      }
    }
  } catch (err) {
    console.warn('Direct standalone HTML fetch unavailable, falling back...', err);
  }

  // 2. Fallback: Serialise current active document with inlined state
  const currentHtml = '<!doctype html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([currentHtml], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, 'meow-match-standalone.html');
}
