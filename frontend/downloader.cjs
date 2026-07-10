const axios = require('axios');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'scraped_data.json');
const publicDir = path.join(__dirname, 'public');
const downloadsDir = path.join(publicDir, 'downloads');
const imagesDir = path.join(publicDir, 'images', 'scraped');

if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function downloadFile(url, destDir, prefix) {
  try {
    const filename = path.basename(new URL(url).pathname) || 'file';
    const decodedFilename = decodeURIComponent(filename);
    const safeFilename = decodedFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${prefix}_${Date.now()}_${safeFilename}`;
    const dest = path.join(destDir, uniqueFilename);
    
    // Check if we can get it
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(dest);
      response.data.pipe(writer);
      writer.on('finish', () => resolve(`/${path.relative(publicDir, dest).replace(/\\/g, '/')}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`  Failed to download: ${url} - ${error.message}`);
    return null;
  }
}

async function processObject(obj, prefix) {
  if (!obj) return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i].url && obj[i].type === 'document') {
        console.log(`Downloading PDF: ${obj[i].url}`);
        const localPath = await downloadFile(obj[i].url, downloadsDir, prefix);
        if (localPath) obj[i].localUrl = localPath;
      } else if (typeof obj[i] === 'string' && obj[i].match(/\.(png|jpg|jpeg|gif)$/i)) {
         // handle string arrays of images
      } else {
        await processObject(obj[i], prefix);
      }
    }
  } else if (typeof obj === 'object') {
    if (obj.images && Array.isArray(obj.images)) {
      for (let i = 0; i < obj.images.length; i++) {
        console.log(`Downloading Image: ${obj.images[i]}`);
        const localPath = await downloadFile(obj.images[i], imagesDir, prefix);
        if (localPath) obj.images[i] = localPath;
      }
    }
    
    for (const key of Object.keys(obj)) {
      if (key !== 'images' && key !== 'allPdfs') {
         await processObject(obj[key], `${prefix}_${key}`);
      }
    }
  }
}

async function main() {
  console.log('Starting downloads...');
  
  // Download all PDFs from the top level collection
  for (let i = 0; i < data.allPdfs.length; i++) {
     console.log(`Downloading allPdfs [${i+1}/${data.allPdfs.length}]: ${data.allPdfs[i].url}`);
     const localPath = await downloadFile(data.allPdfs[i].url, downloadsDir, 'doc');
     if (localPath) data.allPdfs[i].localUrl = localPath;
  }

  // Also traverse the object to update inline images and links
  // We'll skip this to save time and just use the original remote links if they are inline,
  // but for the database seed we'll use `allPdfs` and the specific downloaded images.
  // Wait, let's just do images from the main data keys.
  for (const [key, val] of Object.entries(data)) {
      if (key !== 'allPdfs') {
          await processObject(val, key);
      }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('Downloads completed and scraped_data.json updated.');
}

main().catch(console.error);
