const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating gallery image URLs to local paths...');

  const albums = await prisma.galleryAlbum.findMany();
  for (const album of albums) {
    if (album.coverImage && album.coverImage.startsWith('http://gppvvs.ac.in/Gallery/')) {
      const newCover = album.coverImage.replace('http://gppvvs.ac.in/Gallery/', '/images/gallery/');
      await prisma.galleryAlbum.update({
        where: { id: album.id },
        data: { coverImage: newCover }
      });
      console.log(`Updated cover image for album: ${album.title}`);
    }
  }

  const images = await prisma.galleryImage.findMany();
  for (const image of images) {
    if (image.url.startsWith('http://gppvvs.ac.in/Gallery/')) {
      const newUrl = image.url.replace('http://gppvvs.ac.in/Gallery/', '/images/gallery/');
      await prisma.galleryImage.update({
        where: { id: image.id },
        data: { url: newUrl }
      });
      console.log(`Updated image URL: ${newUrl}`);
    }
  }

  console.log('Gallery URLs updated successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
