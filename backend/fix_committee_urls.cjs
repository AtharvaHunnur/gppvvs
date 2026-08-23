const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const menus = await prisma.menu.findMany({
    where: { href: '/committees' }
  });
  for (const menu of menus) {
    // Check if it's a specific cell/committee
    if (menu.label !== 'Committees & Cells' && menu.label !== 'SC/ST Cell' /* we can just use the label to generate hash for all */) {
      const hash = menu.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await prisma.menu.update({
        where: { id: menu.id },
        data: { href: `/committees#${hash}` }
      });
      console.log(`Updated ${menu.label} to /committees#${hash}`);
    }
  }
}
fix().then(() => {
  console.log('Done');
  process.exit(0);
});
