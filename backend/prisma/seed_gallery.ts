import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding gallery data...');

  const albums = [
    {
      title: 'Prof. K. Kasturirangan Visit',
      slug: 'kasturirangan-visit',
      description: 'Visit of eminent scientist and educationist Prof. K. Kasturirangan to our institution.',
      coverImage: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-1.JPG',
      images: [
        { url: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-1.JPG', caption: 'Prof. K. Kasturirangan Visit - Image 1' },
        { url: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-2.JPG', caption: 'Prof. K. Kasturirangan Visit - Image 2' },
        { url: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-3.JPG', caption: 'Prof. K. Kasturirangan Visit - Image 3' },
        { url: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-4.JPG', caption: 'Prof. K. Kasturirangan Visit - Image 4' },
        { url: 'http://gppvvs.ac.in/Gallery/Kasturirangan/Prof.K-Kasturirangan-Visit-5.JPG', caption: 'Prof. K. Kasturirangan Visit - Image 5' },
      ],
    },
    {
      title: 'Women Empowerment Cell',
      slug: 'women-empowerment',
      description: 'Activities and programs organized by the Women Empowerment Cell of the college.',
      coverImage: 'http://gppvvs.ac.in/Gallery/WomenEmpowerment/WE1.JPG',
      images: [
        { url: 'http://gppvvs.ac.in/Gallery/WomenEmpowerment/WE1.JPG', caption: 'Women Empowerment Cell - Program 1' },
        { url: 'http://gppvvs.ac.in/Gallery/WomenEmpowerment/WE2.JPG', caption: 'Women Empowerment Cell - Program 2' },
        { url: 'http://gppvvs.ac.in/Gallery/WomenEmpowerment/WE3.JPG', caption: 'Women Empowerment Cell - Program 3' },
      ],
    },
    {
      title: 'Annual Day Celebrations',
      slug: 'annual-day',
      description: 'Annual day cultural and academic prize distribution ceremony.',
      coverImage: 'http://gppvvs.ac.in/Gallery/AnnualDay/AD1.JPG',
      images: [
        { url: 'http://gppvvs.ac.in/Gallery/AnnualDay/AD1.JPG', caption: 'Annual Day - Event 1' },
        { url: 'http://gppvvs.ac.in/Gallery/AnnualDay/AD2.JPG', caption: 'Annual Day - Event 2' },
        { url: 'http://gppvvs.ac.in/Gallery/AnnualDay/AD3.JPG', caption: 'Annual Day - Event 3' },
      ],
    },
  ];

  for (const albumData of albums) {
    // 1. Create or update the album
    const album = await prisma.galleryAlbum.upsert({
      where: { slug: albumData.slug },
      update: {
        title: albumData.title,
        description: albumData.description,
        coverImage: albumData.coverImage,
      },
      create: {
        title: albumData.title,
        slug: albumData.slug,
        description: albumData.description,
        coverImage: albumData.coverImage,
      },
    });

    console.log(`Album ${album.title} (slug: ${album.slug}) upserted.`);

    // 2. Clear existing images for this album and re-insert to avoid duplicates
    await prisma.galleryImage.deleteMany({
      where: { albumId: album.id },
    });

    for (const [index, img] of albumData.images.entries()) {
      await prisma.galleryImage.create({
        data: {
          url: img.url,
          caption: img.caption,
          albumId: album.id,
          position: index,
        },
      });
    }

    console.log(`Created ${albumData.images.length} images for album ${album.title}.`);
  }

  console.log('Gallery seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
