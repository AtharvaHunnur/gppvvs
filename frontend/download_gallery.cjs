const fs = require('fs');
const http = require('http');
const path = require('path');

const images = [
  'Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-1.JPG',
  'Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-2.JPG',
  'Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-3.JPG',
  'Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-4.JPG',
  'Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-5.JPG',
  'Gallery/WomenEmpowerment/WE1.JPG',
  'Gallery/WomenEmpowerment/WE2.JPG',
  'Gallery/WomenEmpowerment/WE3.JPG',
  'Gallery/AnnualDay/AD1.JPG',
  'Gallery/AnnualDay/AD2.JPG',
  'Gallery/AnnualDay/AD3.JPG'
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  console.log('Downloading gallery images...');
  for (const img of images) {
    const url = 'http://gppvvs.ac.in/' + img;
    // We'll store them in public/images/gallery (without the Gallery/ part in the dest path name)
    const destName = img.replace('Gallery/', '');
    const dest = path.join(__dirname, 'public/images/gallery', destName);
    try {
      await download(url, dest);
      console.log('Downloaded:', destName);
    } catch (e) {
      console.error('Failed:', destName, e);
    }
  }
  console.log('Done downloading gallery images.');
}

main();
