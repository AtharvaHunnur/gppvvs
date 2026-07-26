const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Seeds the "Departments" top-level menu with nested category sub-menus.
 * Structure mirrors the reference website (bldeasbkcp.ac.in):
 *   Departments → Categories → Individual department links
 *
 * Adapted for GPPVVS's actual departments.
 */
async function main() {
  console.log('Seeding Departments menu structure...');

  // 1. Remove any existing "Departments" top-level menu (and its children via cascade)
  const existingDeptMenus = await prisma.menu.findMany({
    where: { label: 'Departments', parentId: null },
  });
  for (const m of existingDeptMenus) {
    await prisma.menu.delete({ where: { id: m.id } });
    console.log(`Deleted existing "Departments" menu (id: ${m.id})`);
  }

  // Also remove the old "Academics" top-level menu if it has "Departments" as a child
  const existingAcademicsMenus = await prisma.menu.findMany({
    where: { label: 'Academics', parentId: null },
  });
  for (const m of existingAcademicsMenus) {
    await prisma.menu.delete({ where: { id: m.id } });
    console.log(`Deleted existing "Academics" menu (id: ${m.id})`);
  }

  // 2. Find the correct position for the new Departments menu
  //    Insert it after "About" (position 1) — so position = 1
  //    We'll shift other menus if needed
  const topMenus = await prisma.menu.findMany({
    where: { parentId: null },
    orderBy: { position: 'asc' },
  });

  // Determine position: place Departments at position 1 (after About at 0)
  const deptPosition = 1;

  // Shift any existing menus at position >= 1
  for (const menu of topMenus) {
    if (menu.position >= deptPosition) {
      await prisma.menu.update({
        where: { id: menu.id },
        data: { position: menu.position + 1 },
      });
    }
  }

  // 3. Create the Departments menu hierarchy
  const departmentsMenu = await prisma.menu.create({
    data: {
      label: 'Departments',
      href: '/departments',
      position: deptPosition,
      isVisible: true,
    },
  });
  console.log(`Created top-level "Departments" menu (id: ${departmentsMenu.id})`);

  // Category definitions with their department children
  const categories = [
    {
      label: 'Humanities',
      children: [
        { label: 'Kannada', href: '/departments/kannada' },
        { label: 'English', href: '/departments/english' },
        { label: 'Hindi', href: '/departments/hindi' },
        { label: 'Urdu', href: '/departments/urdu' },
      ],
    },
    {
      label: 'Social Science',
      children: [
        { label: 'Political Science', href: '/departments/political-science' },
        { label: 'History', href: '/departments/history' },
        { label: 'Economics', href: '/departments/economics' },
        { label: 'Sociology', href: '/departments/sociology' },
        { label: 'Physical Education', href: '/departments/physical-education' },
      ],
    },
    {
      label: 'Science',
      children: [
        { label: 'Physics', href: '/departments/physics' },
        { label: 'Chemistry', href: '/departments/chemistry' },
        { label: 'Mathematics', href: '/departments/mathematics' },
        { label: 'Botany', href: '/departments/botany' },
        { label: 'Zoology', href: '/departments/zoology' },
      ],
    },
    {
      label: 'Commerce & Computer Science',
      children: [
        { label: 'Commerce', href: '/departments/commerce' },
        { label: 'Computer Science', href: '/departments/computer-science' },
      ],
    },
  ];

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const category = categories[catIdx];

    // Create category menu (Level 2) — these show with ► arrows
    const categoryMenu = await prisma.menu.create({
      data: {
        label: category.label,
        href: '#',
        parentId: departmentsMenu.id,
        position: catIdx,
        isVisible: true,
      },
    });
    console.log(`  Created category: ${category.label}`);

    // Create individual department links (Level 3)
    for (let deptIdx = 0; deptIdx < category.children.length; deptIdx++) {
      const dept = category.children[deptIdx];
      await prisma.menu.create({
        data: {
          label: dept.label,
          href: dept.href,
          parentId: categoryMenu.id,
          position: deptIdx,
          isVisible: true,
        },
      });
      console.log(`    Created department: ${dept.label}`);
    }
  }

  console.log('\nDepartments menu seeding complete!');
  console.log('Structure: Departments → 4 Categories → 16 Department Links');
}

main()
  .catch((err) => {
    console.error('Error seeding departments menu:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
