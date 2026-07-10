const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE = 'http://gppvvs.ac.in';

// All pages discovered from the old website
const PAGES = {
  about: '/About-Us.aspx',
  trustees: '/Trustees.aspx',
  bestPractices: '/gpp-best-practices.aspx',
  departments: '/Departments.aspx',
  library: '/Library.aspx',
  gym: '/gym.aspx',
  onlineClasses: '/online-classes.aspx',
  facilities: '/gpp-facilities.aspx',
  downloads: '/downloads.aspx',
  naac4th: '/GPP-NAAC-4th-Cycle.aspx',
  naacDvv: '/NAAC-DVV.aspx',
  journalArticles: '/journal-articles.aspx',
  reports: '/GPP-Reports.aspx',
  iqacReports: '/GPP-IQAC-Reports.aspx',
  otherReports: '/GPP-Other-Reports.aspx',
  academicCalendar: '/academic-calendar.aspx',
  scstCell: '/GPP-SC-ST-Cell.aspx',
  researchCell: '/GPP-Research-Cell.aspx',
  iprCell: '/GPP-IPR-Cell.aspx',
  grievanceCell: '/grievance-cell.aspx',
  antiRagging: '/Anti-Ragging-Cell.aspx',
  placementCell: '/placementcell.aspx',
  entrepreneurship: '/entrepreneurshipcell.aspx',
  wec: '/WEC.aspx',
  studentWelfare: '/student-welfare-cell.aspx',
  ncc: '/NCC.aspx',
  nss: '/NSS.aspx',
  yrc: '/YRC.aspx',
  posh: '/preventionofsexualharrashmentcell.aspx',
  gallery: '/Gallery.aspx',
  contact: '/Contact.aspx',
};

// Known individual department pages
const DEPT_PAGES = [
  '/Dept-of-Kannada.aspx',
  '/Dept-of-English.aspx',
  '/Dept-of-Hindi.aspx',
  '/Dept-of-Urdu.aspx',
  '/Dept-of-Political-Science.aspx',
  '/Dept-of-History.aspx',
  '/Dept-of-Economics.aspx',
  '/Dept-of-Sociology.aspx',
  '/Dept-of-Physical-Education.aspx',
  '/Dept-of-Commerce.aspx',
  '/Dept-of-Physics.aspx',
  '/Dept-of-Chemistry.aspx',
  '/Dept-of-Mathematics.aspx',
  '/Dept-of-Botany.aspx',
  '/Dept-of-Zoology.aspx',
  '/Dept-of-Computer-Science.aspx',
];

async function fetchPage(url) {
  try {
    const resp = await axios.get(url, { timeout: 15000 });
    return cheerio.load(resp.data);
  } catch (e) {
    console.error(`  FAILED: ${url} - ${e.message}`);
    return null;
  }
}

function extractMainContent($) {
  if (!$) return { text: '', html: '', images: [], links: [] };
  
  // Remove nav, header, footer, scripts, styles
  $('header, footer, nav, script, style, .navbar, .header, link, meta, noscript').remove();
  
  // Get content from section.sec or main container
  let content = $('section.sec').first();
  if (!content.length) content = $('.container').first();
  if (!content.length) content = $('body');
  
  const images = [];
  content.find('img').each((_, el) => {
    let src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      if (!src.startsWith('http')) src = BASE + '/' + src.replace(/^\//, '');
      images.push(src);
    }
  });
  
  const links = [];
  content.find('a[href]').each((_, el) => {
    let href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      if (!href.startsWith('http')) href = BASE + '/' + href.replace(/^\//, '');
      if (href.endsWith('.pdf') || href.endsWith('.PDF') || href.endsWith('.doc') || href.endsWith('.docx')) {
        links.push({ text, url: href, type: 'document' });
      } else {
        links.push({ text, url: href, type: 'page' });
      }
    }
  });
  
  return {
    text: content.text().replace(/\s+/g, ' ').trim(),
    html: content.html(),
    images,
    links
  };
}

function extractTabContent($) {
  if (!$) return {};
  const tabs = {};
  $('.tab-pane').each((_, el) => {
    const id = $(el).attr('id');
    const html = $(el).html();
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (id && text) {
      tabs[id] = { html, text };
    }
  });
  return tabs;
}

function extractTableData($) {
  if (!$) return [];
  const tables = [];
  $('table').each((_, table) => {
    const rows = [];
    $(table).find('tr').each((_, tr) => {
      const cells = [];
      $(tr).find('td, th').each((_, cell) => {
        cells.push($(cell).text().trim());
      });
      if (cells.length > 0 && cells.some(c => c.length > 0)) {
        rows.push(cells);
      }
    });
    if (rows.length > 0) tables.push(rows);
  });
  return tables;
}

function extractDeptFaculty($) {
  if (!$) return [];
  const faculty = [];
  // Look for faculty info in tables or structured content
  $('table tr').each((_, tr) => {
    const cells = [];
    $(tr).find('td').each((_, td) => {
      cells.push($(td).text().trim());
    });
    // Typically: Name, Designation, Qualification, Experience, Specialization
    if (cells.length >= 3 && cells[0] && !cells[0].match(/^(sl|sr|no|name)/i)) {
      faculty.push({
        name: cells[0] || cells[1],
        designation: cells.length > 2 ? cells[2] : '',
        qualification: cells.length > 3 ? cells[3] : '',
        experience: cells.length > 4 ? cells[4] : '',
        specialization: cells.length > 5 ? cells[5] : '',
      });
    }
  });
  return faculty;
}

async function scrapeAll() {
  const data = {};
  
  // 1. Scrape all general pages
  console.log('=== Scraping general pages ===');
  for (const [key, path] of Object.entries(PAGES)) {
    const url = BASE + path;
    console.log(`Fetching: ${key} -> ${url}`);
    const $ = await fetchPage(url);
    const content = extractMainContent($);
    const tabs = extractTabContent($);
    const tables = extractTableData($);
    data[key] = { url, ...content, tabs, tables };
  }
  
  // 2. Scrape individual department pages
  console.log('\n=== Scraping department pages ===');
  data.departmentDetails = {};
  for (const deptPath of DEPT_PAGES) {
    const url = BASE + deptPath;
    const deptName = deptPath.replace('/Dept-of-', '').replace('.aspx', '').replace(/-/g, ' ');
    console.log(`Fetching dept: ${deptName} -> ${url}`);
    const $ = await fetchPage(url);
    const content = extractMainContent($);
    const tables = extractTableData($);
    const faculty = extractDeptFaculty($);
    const tabs = extractTabContent($);
    data.departmentDetails[deptName] = { url, ...content, tables, faculty, tabs };
  }
  
  // 3. Collect all downloadable PDFs
  console.log('\n=== Collecting all PDF links ===');
  const allPdfs = new Set();
  const collectPdfs = (obj) => {
    if (!obj) return;
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (typeof item === 'object' && item.url && item.type === 'document') {
          allPdfs.add(JSON.stringify({ text: item.text, url: item.url }));
        }
      });
    }
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      Object.values(obj).forEach(v => collectPdfs(v));
    }
  };
  collectPdfs(data);
  data.allPdfs = [...allPdfs].map(s => JSON.parse(s));
  console.log(`Found ${data.allPdfs.length} PDF links total`);
  
  // Save
  const outPath = path.join(__dirname, 'scraped_data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`\nSaved to ${outPath}`);
  
  // Print summary
  console.log('\n=== SUMMARY ===');
  for (const [key, val] of Object.entries(data)) {
    if (key === 'departmentDetails') {
      console.log(`departmentDetails: ${Object.keys(val).length} departments`);
      for (const [dk, dv] of Object.entries(val)) {
        console.log(`  ${dk}: ${dv.text?.substring(0, 80)}...`);
        if (dv.faculty?.length) console.log(`    Faculty: ${dv.faculty.length} members`);
      }
    } else if (key === 'allPdfs') {
      console.log(`allPdfs: ${val.length} documents`);
    } else if (typeof val === 'object' && val.text) {
      console.log(`${key}: ${val.text?.substring(0, 100)}...`);
      if (val.links?.length) console.log(`  Links: ${val.links.length}`);
      if (val.images?.length) console.log(`  Images: ${val.images.length}`);
      if (Object.keys(val.tabs || {}).length) console.log(`  Tabs: ${Object.keys(val.tabs).join(', ')}`);
    }
  }
}

scrapeAll().catch(console.error);
