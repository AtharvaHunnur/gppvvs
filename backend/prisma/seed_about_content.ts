import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating About page content with old website data...');

  // 1. About the Institution
  await prisma.page.update({
    where: { slug: 'about-the-institution' },
    data: {
      content: `<p><strong>About Institution</strong></p>
<p>Sri Padmaraj Vidya Vardhaka -Samstha, Sarangamath, Sindagi Dist:Vijayapura, Karnataka State, is a prestigious institution of this area, which was established with the blessings of His Holiness, late Shri Channaveer Swamiji of Sarangamath, Sindagi in the year 1969 with the support of many philanthropists. The institution has a vision of serving the rural students and now runs various schools and colleges. Under the guidance of the present chairman His Holiness, Dr. Prabhu Sarangadev Shivacharyaji, the institution has grown to greater heights with modern outlook. The outstanding vision of Poojya Swamiji under Channaveer Swamiji Prathisthan, cash prize of Rupees one Lakh and certificate is given to eminent Scientist in the field of science every year in the memory of Bhaskaracharya-II the great Mathematician of Vijayapur District. In view of this, the institution has been visited by eminent Scientists. Dr.C N R Rao former chairman ISRO in 2016, Dr:U R Rao former chairman ISRO in 2017, Dr.S A Patil former V C U A S Dharwad in 2018, Dr:Kasturi Rangan former chairman ISRO in 2019 And Dr.Kiran Kumar former chairman ISRO in 2023. To encourage farmers Management introduced special Award Saranga Sri for the farmers who have good track record of achievements in Agricultural field A cash prize of Rupees Eleven Thousand and A memento. The institution also conducts several religious and spiritual programs including Sadvichar Goshti on full moon day of every month.</p>
<p>The college was established in the year 1972 with the mission of making higher education more accessible and affordable for rural youths. Now, it imparts education in three faculties like, Arts, Commerce and Science at undergraduate to more than 1300 students. The Arts and Commerce faculty is named after its donor Sangavi Porwal and Science is named after its donor Salimath family. The college has an imposing building built in 25.9 acres of land and build up area of 16008 sq ft with well furnished laboratories and well equipped Library with rare books, and has set high benchmark in academic standards. The college has conducted several seminars, workshops, conferences at state, National and International level. The college is affiliated to Rani Channamma University, Belagavi and offers UG Courses in B.A, B.Sc. And B.Com.</p>
<p>The college has NCC unit, Two NSS units, Scouts And Guides and Youth Red Cross unit. Several students from NSS and NCC of our college have participated in NIC, RD Delhi and also at International Level. The campus rich home for Flora &amp; Fauna. several birds. The Institution has installed Solar On Grid. Rain water harvesting unit and a waste water treatment plant at Ladies Hostels.</p>`,
      images: JSON.stringify([
        '/images/about_building.png',
        '/images/about_drama.png',
        '/images/about_group.png',
      ]),
    },
  });
  console.log('✓ about-the-institution updated');

  // 2. Vision
  await prisma.page.update({
    where: { slug: 'vision' },
    data: {
      content: `<p><strong>MOULDING THE RURAL YOUTH FOR THE MODERN WORLD.</strong></p>
<p>To make this college to be the center of higher education preparing the rural youth to face the challenges posed by the situations around.</p>
<p>To bring in the all round development of the learners' personality.</p>`,
    },
  });
  console.log('✓ vision updated');

  // 3. Mission
  await prisma.page.update({
    where: { slug: 'mission' },
    data: {
      content: `<p>With a steady growth, both in dimension and direction, over a period of three decades, G.P.Porwal Arts, Commerce and V.V.Salimath Science College, seeks to impart knowledge through curriculum, personality development through co-curricular activities, human values through extension activities, with a view to bring up the students in such a way as to be able to extend their helping hand in building the nation with a mind free from the sense of caste, creed and race. Fully supported by the management, the college strives to mould the youth of this area capable of facing the modern world.</p>`,
    },
  });
  console.log('✓ mission updated');

  // 4. Principal's Message
  await prisma.page.update({
    where: { slug: 'principals-message' },
    data: {
      content: `<p>It is indeed a great pleasure for me to be a head of the most dynamic and developing rural college. Shri Padmaraj vidhyavardhak Samsthe sarangamatha's G P Porwal Arts, Commerce and V V Salimath Science College Sindgi, was established in 1972 with its own distinct identity and tradition by the great vision of Late shri .Poojya Channaveer Mahaswamiji. And now headed by Poojya Dr:Prabhu Sarangadeva shivachyaryaru. It has been serving as the tower of learning. It has moulded the destiny of hundreds of people for a better tomorrow.</p>
<p>The institution offers 3 years undergraduate degree programs viz., Bachelor of Arts (B.A.), Bachelor of Commerce (B.Com.) and Bachelor of Science (B.Sc.).</p>
<p>G P Porwal Arts, Commerce and V V Salimath Science College is affiliated to the Rani Channamma University Belagavi. The College is re-accredited in 2018 by National Assessment and Accreditation Council (NAAC) with 'B' grade in its 3rd cycle.</p>
<p>We continue to impart holistic education with emphasis on moulding the rural youths to modern world, to create good citizens as perceived by Late Poojy Channaveer mahaswamiji. Poojy Dr:Prabhu Sarangadeva shivacharyaru the present Chairman have always distanced from commercialization of education. We also believe in Swami Vivekanand philosophy that 'education is tool by which character is formed, strength of mind is increased, and the intellect is expanded, and by which one can stand on one's own feet'. By inculcating values through discipline we build students character along with building their careers.</p>
<p>ICT enabled infrastructure provided by supportive and committed management, dedicated and hard-working team of teachers and enthusiastic non-teaching staff help us to provide conducive academic atmosphere to prepare students for world of work. Curriculum is supplemented with co-curricular and extracurricular activities providing ample opportunity for the all-round development of students.</p>
<p>The progress of a country not only depends on its economic growth but on human development through strong academic foundation. It is our responsibility as a higher education institution to develop individuals with high moral values, ethics and love for nation. We strive to provide:</p>
<ul>
<li>Quality education with moral values</li>
<li>To develop skill sets of the students</li>
<li>Use knowledge for the betterment of society.</li>
<li>To bridge the gap between academia and industry.</li>
</ul>
<p>With growing usage of technology teachers role has changed from traditional knowledge provider to a mentor, facilitator and guide to support deeper learning based on their capabilities and potential. We need an education system where thinking, questioning, imagining, creativity and innovations are promoted and encouraged. Technology can never replace teachers, but it is essential that teachers continuously upgrade their knowledge and skills to provide learning environment that facilitates use of technology and innovations. This will surely help us develop competent work force capable of delivering high quality services.</p>`,
    },
  });
  console.log('✓ principals-message updated');

  console.log('\nAll About page content updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
