const axios = require('axios');
const cheerio = require('cheerio');

async function getLinks() {
  try {
    const response = await axios.get('http://gppvvs.ac.in/');
    const $ = cheerio.load(response.data);
    const links = new Set();
    $('a').each((i, el) => {
      let href = $(el).attr('href');
      if (href) {
        if (href.startsWith('/')) {
            href = 'http://gppvvs.ac.in' + href;
        } else if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript:')) {
            href = 'http://gppvvs.ac.in/' + href;
        }
        if (href.startsWith('http://gppvvs.ac.in')) {
            links.add(href);
        }
      }
    });
    console.log(Array.from(links));
  } catch (error) {
    console.error('Error fetching links:', error);
  }
}
getLinks();
