import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';

console.log('>>> [1/4] Building standalone single-file HTML (with Bodhi branding and mobile fixes)...');
execSync('npx vite build -c vite.config.singlefile.ts', { stdio: 'inherit' });

const distSinglefileDir = path.resolve(process.cwd(), 'dist-singlefile');
const publicDir = path.resolve(process.cwd(), 'public');
const distDir = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy singlefile HTML to public/meow-match-standalone.html
const singleHtmlPath = path.join(distSinglefileDir, 'index.html');
if (fs.existsSync(singleHtmlPath)) {
  fs.copyFileSync(singleHtmlPath, path.join(publicDir, 'meow-match-standalone.html'));
  console.log('✓ Copied single-file HTML to public/meow-match-standalone.html');
}

console.log('>>> [2/4] Building standard web distribution...');
execSync('npx vite build', { stdio: 'inherit' });

// Ensure dist also has meow-match-standalone.html
if (fs.existsSync(singleHtmlPath)) {
  fs.copyFileSync(singleHtmlPath, path.join(distDir, 'meow-match-standalone.html'));
}

console.log('>>> [3/4] Packaging complete clean HTML/JS zip bundle...');
async function makeZip() {
  const zip = new JSZip();

  function addDirToZip(currentDir, relativePrefix = '') {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      // Don't include existing zip archives or standalone html inside the zip pack
      if (item.endsWith('.zip') || item === 'meow-match-standalone.html') continue;

      const fullPath = path.join(currentDir, item);
      const relPath = relativePrefix ? `${relativePrefix}/${item}` : item;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        addDirToZip(fullPath, relPath);
      } else {
        zip.file(relPath, fs.readFileSync(fullPath));
      }
    }
  }

  addDirToZip(distDir);

  zip.file(
    'README.txt',
    'Meow Match Sanctuary - Bodhi Industries Edition\n' +
    '---------------------------------------------------\n\n' +
    'Featuring Piper (Calico Mix) & Bodacious (Maine Coon)\n\n' +
    'HOW TO PLAY / HOST:\n' +
    '1. Offline Play: Double-click index.html in any modern browser (Chrome, Safari, Edge, Firefox).\n' +
    '2. Itch.io: Upload meow-match-html-bundle.zip as an HTML5 game. Mark "This file will be played in the browser".\n' +
    '3. Netlify / Vercel / GitHub Pages: Drag and drop or push the extracted contents.\n\n' +
    'Published by Bodhi Industries.\n'
  );

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const rootZipPath = path.resolve(process.cwd(), 'meow-match-html-bundle.zip');
  const publicZipPath = path.join(publicDir, 'meow-match-bundle.zip');
  const distZipPath = path.join(distDir, 'meow-match-bundle.zip');

  fs.writeFileSync(rootZipPath, buffer);
  fs.writeFileSync(publicZipPath, buffer);
  fs.writeFileSync(distZipPath, buffer);

  console.log(`✓ Generated ${rootZipPath} (${Math.round(buffer.length / 1024)} KB)`);
  console.log(`✓ Copied to ${publicZipPath} and ${distZipPath}`);
  console.log('>>> [4/4] All publishables and exports successfully built with all latest changes!');
}

await makeZip();
