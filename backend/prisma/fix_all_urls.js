const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const scrapedImagesDir = path.join(__dirname, '../../frontend/public/images/scraped');
const files = fs.readdirSync(scrapedImagesDir);

function getMatchingLocalUrl(originalUrl) {
  if (!originalUrl || typeof originalUrl !== 'string') return originalUrl;
  if (originalUrl.startsWith('/images/scraped/')) return originalUrl; // already fixed
  
  // Extract filename
  const parts = originalUrl.split('/');
  const filename = parts[parts.length - 1];
  if (!filename) return originalUrl;
  
  const decoded = decodeURIComponent(filename);
  const safeFilename = decoded.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Find a file in scraped images that ends with safeFilename
  const matchedFile = files.find(f => f.endsWith(`_${safeFilename}`) || f.endsWith(safeFilename) || f === safeFilename);
  if (matchedFile) {
    return `/images/scraped/${matchedFile}`;
  }
  
  // Try exact match or case insensitive match if possible
  const matchedIgnoreCase = files.find(f => f.toLowerCase().endsWith(safeFilename.toLowerCase()));
  if (matchedIgnoreCase) {
     return `/images/scraped/${matchedIgnoreCase}`;
  }

  return originalUrl; // Fallback
}

async function fixArrayOfUrls(jsonField) {
  if (!jsonField) return jsonField;
  let parsed = typeof jsonField === 'string' ? JSON.parse(jsonField) : jsonField;
  if (!Array.isArray(parsed)) return jsonField;
  let changed = false;
  const newArr = parsed.map(url => {
    const newUrl = getMatchingLocalUrl(url);
    if (newUrl !== url) changed = true;
    return newUrl;
  });
  return changed ? JSON.stringify(newArr) : jsonField;
}

async function main() {
  console.log('Fixing image URLs in DB based on local files...');

  // 1. GalleryAlbum
  const albums = await prisma.galleryAlbum.findMany();
  for (const album of albums) {
    const newCover = getMatchingLocalUrl(album.coverImage);
    if (newCover !== album.coverImage) {
      await prisma.galleryAlbum.update({ where: { id: album.id }, data: { coverImage: newCover } });
      console.log(`GalleryAlbum ${album.title} coverImage updated to ${newCover}`);
    }
  }

  // 2. GalleryImage
  const gImages = await prisma.galleryImage.findMany();
  for (const img of gImages) {
    const newUrl = getMatchingLocalUrl(img.url);
    if (newUrl !== img.url) {
      await prisma.galleryImage.update({ where: { id: img.id }, data: { url: newUrl } });
      console.log(`GalleryImage ${img.id} url updated to ${newUrl}`);
    }
  }

  // 3. Department
  const depts = await prisma.department.findMany();
  for (const dept of depts) {
    let data = {};
    const newImg = getMatchingLocalUrl(dept.image);
    const newHod = getMatchingLocalUrl(dept.hodPhoto);
    if (newImg !== dept.image) data.image = newImg;
    if (newHod !== dept.hodPhoto) data.hodPhoto = newHod;
    if (Object.keys(data).length > 0) {
      await prisma.department.update({ where: { id: dept.id }, data });
      console.log(`Department ${dept.name} updated`);
    }
  }

  // 4. Faculty
  const faculty = await prisma.faculty.findMany();
  for (const f of faculty) {
    const newPhoto = getMatchingLocalUrl(f.photo);
    if (newPhoto !== f.photo) {
      await prisma.faculty.update({ where: { id: f.id }, data: { photo: newPhoto } });
      console.log(`Faculty ${f.name} updated photo`);
    }
  }

  // 5. Event
  const events = await prisma.event.findMany();
  for (const ev of events) {
    let data = {};
    const newCover = getMatchingLocalUrl(ev.coverImage);
    if (newCover !== ev.coverImage) data.coverImage = newCover;
    
    // Check ev.images if you want
    if (ev.images) {
      const newImages = await fixArrayOfUrls(ev.images);
      if (newImages !== ev.images) data.images = newImages;
    }
    
    if (Object.keys(data).length > 0) {
      await prisma.event.update({ where: { id: ev.id }, data });
      console.log(`Event ${ev.title} updated`);
    }
  }

  // 5.5. Page
  const pages = await prisma.page.findMany();
  for (const p of pages) {
    if (p.images) {
      const newImages = await fixArrayOfUrls(p.images);
      if (newImages !== p.images) {
        await prisma.page.update({ where: { id: p.id }, data: { images: newImages } });
        console.log(`Page ${p.slug} updated images`);
      }
    }
  }

  // 6. HomepageSection (Config JSON contains URLs maybe)
  const sections = await prisma.homepageSection.findMany();
  for (const sec of sections) {
    if (sec.config) {
        let configStr = JSON.stringify(sec.config);
        let changed = false;
        
        // Find all http://gppvvs... urls in the JSON string and replace them using getMatchingLocalUrl
        // A simple regex approach for strings
        const matches = configStr.match(/(http:\/\/gppvvs\.ac\.in\/[^"]+)/g);
        if (matches) {
            for (const match of matches) {
                const replacement = getMatchingLocalUrl(match);
                if (replacement !== match) {
                    configStr = configStr.replace(match, replacement);
                    changed = true;
                }
            }
        }
        
        if (changed) {
            await prisma.homepageSection.update({
                where: { id: sec.id },
                data: { config: JSON.parse(configStr) }
            });
            console.log(`HomepageSection ${sec.sectionType} updated`);
        }
    }
  }

  console.log('Done!');
}

main().finally(() => prisma.$disconnect());
