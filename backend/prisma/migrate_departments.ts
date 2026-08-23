import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const DEPT_URLS = [
  'Dept-of-Kannada.aspx',
  'Dept-of-English.aspx',
  'Dept-of-Hindi.aspx',
  'Dept-of-Urdu.aspx',
  'Dept-of-Political-Science.aspx',
  'Dept-of-History.aspx',
  'Dept-of-Economics.aspx',
  'Dept-of-Sociology.aspx',
  'Dept-of-Physical-Education.aspx',
  'Dept-of-Commerce.aspx',
  'Dept-of-Physics.aspx',
  'Dept-of-Chemistry.aspx',
  'Dept-of-Mathematics.aspx',
  'Dept-of-Botany.aspx',
  'Dept-of-Zoology.aspx'
];

async function main() {
  console.log('Starting department migration from old website...');

  for (const urlFile of DEPT_URLS) {
    const fullUrl = `http://gppvvs.ac.in/${urlFile}`;
    console.log(`\nFetching ${fullUrl}...`);
    
    try {
      const res = await axios.get(fullUrl);
      const $ = cheerio.load(res.data);
      
      // Determine department slug based on filename
      // e.g. Dept-of-Kannada.aspx -> kannada
      let deptName = urlFile.replace('Dept-of-', '').replace('.aspx', '');
      const slug = deptName.toLowerCase();
      
      const about = $('#about').html() || '';
      const poutcome = $('#poutcome').html() || '';
      const psoutcome = $('#psoutcome').html() || '';
      const coutcome = $('#coutcome').html() || '';
      
      // Find the department in DB
      const department = await prisma.department.findUnique({
        where: { slug }
      });
      
      if (!department) {
        console.warn(`Department with slug ${slug} not found in DB! Skipping...`);
        continue;
      }

      // Update Department
      await prisma.department.update({
        where: { id: department.id },
        data: {
          description: about.trim() || department.description,
          programmeOutcomes: poutcome.trim() || department.programmeOutcomes,
          programmeSpecificOutcomes: psoutcome.trim() || department.programmeSpecificOutcomes,
          courseOutcomes: coutcome.trim() || department.courseOutcomes,
        }
      });
      console.log(`Updated department text for ${deptName}.`);

      // Extract Faculty
      // Looking for table in the faculty tab, or just any table if faculty tab is not perfectly structured
      let facultyTable = $('#faculty table');
      if (facultyTable.length === 0) {
         facultyTable = $('table').first();
      }

      if (facultyTable.length > 0) {
        // Clear existing faculty for this department to avoid duplicates during re-runs
        await prisma.faculty.deleteMany({
          where: { departmentId: department.id }
        });

        const rows = facultyTable.find('tr');
        let fpos = 0;
        
        for (let i = 1; i < rows.length; i++) { // Skip header row
          const cols = $(rows[i]).find('td, th');
          
          if (cols.length >= 5) {
            // Usually: Sl.No | Profile Photo | Name | Qualification | Specialization | Designation
            const photoCol = $(cols[1]).find('img').attr('src') || '';
            const name = $(cols[2]).text().trim();
            const qualification = $(cols[3]).text().trim();
            const specialization = $(cols[4]).text().trim();
            // In Kannada, designation was col 5. If it exists:
            const designation = cols.length > 5 ? $(cols[5]).text().trim() : 'Faculty';

            if (name && name.toLowerCase() !== 'name') {
              await prisma.faculty.create({
                data: {
                  name,
                  designation: designation || 'Faculty',
                  qualification,
                  specialization,
                  photo: photoCol,
                  departmentId: department.id,
                  position: fpos++
                }
              });
              console.log(`  Added faculty: ${name}`);
            }
          }
        }
      }

    } catch (err: any) {
      console.error(`Failed to process ${fullUrl}:`, err.message);
    }
  }

  console.log('\nMigration complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
