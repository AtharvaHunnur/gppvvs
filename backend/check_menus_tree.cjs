const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menus = await prisma.menu.findMany({
    where: { parentId: null },
    orderBy: { position: 'asc' },
    include: {
      children: {
        orderBy: { position: 'asc' },
        include: {
          children: { orderBy: { position: 'asc' } }
        }
      }
    }
  });

  function printTree(nodes, indent = '') {
    nodes.forEach(n => {
      console.log(`${indent}- ${n.label} (${n.href}) [isVisible: ${n.isVisible}]`);
      if (n.children && n.children.length > 0) {
        printTree(n.children, indent + '  ');
      }
    });
  }
  
  console.log(`Found ${menus.length} top-level menus:`);
  printTree(menus);
  await prisma.$disconnect();
}
main();
