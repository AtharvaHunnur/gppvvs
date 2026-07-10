const fs = require('fs');

const html = fs.readFileSync('home_raw.html', 'utf8');

// The old site probably uses standard Bootstrap or similar navbar HTML like:
// <ul class="nav navbar-nav"> ... <li><a href="...">Menu</a> ... <ul><li><a href="...">Submenu</a></li></ul></li> ... </ul>

// A simple way to get all links inside the header/nav area is to use a regex targeting the navbar area.
// We'll look for `<nav` ... `</nav>` or `<div id="menu"` ...
let navSection = '';
const navRegex = /<nav[^>]*>([\s\S]*?)<\/nav>/gi;
let match = navRegex.exec(html);
if (match) {
  navSection = match[1];
} else {
  // If no <nav>, look for a menu container
  const menuRegex = /<ul[^>]*id="[^"]*menu[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi;
  match = menuRegex.exec(html);
  if (match) {
    navSection = match[1];
  } else {
    // Just grab the first major UL with dropdowns
    const dropdownRegex = /<ul[^>]*class="[^"]*nav[^"]*"[^>]*>([\s\S]*?)<\/ul>\s*<\/div>/gi;
    match = dropdownRegex.exec(html);
    if (match) {
      navSection = match[1];
    } else {
      // Fallback: grab a chunk of html that looks like the header
      navSection = html; 
    }
  }
}

// Extract all <li> elements
const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
let liMatch;
const menus = [];

// Since nested lists are hard with regex, let's just find all <a> tags inside navSection
const aRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
let aMatch;
console.log("Found Links in Navigation Area:");
const links = [];
while ((aMatch = aRegex.exec(navSection)) !== null) {
  const href = aMatch[1];
  const text = aMatch[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text && href !== '#' && !href.toLowerCase().includes('javascript:')) {
    links.push({ text, href });
  }
}

// Grouping by rough structure (heuristic: if href starts with a folder or we just print them all)
links.forEach(l => console.log(`- ${l.text} (${l.href})`));
