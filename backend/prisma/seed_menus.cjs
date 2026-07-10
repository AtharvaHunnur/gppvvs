const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding menus table from parsed menu detail...');
  
  const rawData = fs.readFileSync('../frontend/parsed_menus.json', 'utf8');
  const menus = JSON.parse(rawData);

  // Clear existing menus
  await prisma.menu.deleteMany({});
  console.log('Cleared existing menus.');

  // Recursive function to insert menus
  async function insertMenuLevel(menuList, parentId = null) {
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      const createdMenu = await prisma.menu.create({
        data: {
          label: menu.label,
          href: menu.href || '#',
          position: i,
          parentId: parentId,
          isVisible: true
        }
      });
      
      console.log(`Created menu: ${'  '.repeat(parentId ? 1 : 0)}${createdMenu.label}`);

      if (menu.children && menu.children.length > 0) {
        await insertMenuLevel(menu.children, createdMenu.id);
      }
    }
  }

  await insertMenuLevel(menus);

  console.log('Dynamic Menu seeding complete.');
}

main()
  .catch(err => {
    console.error('Error seeding menus:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
