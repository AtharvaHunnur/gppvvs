const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage() {
  try {
    const response = await axios.get('http://gppvvs.ac.in/About-Us.aspx');
    const $ = cheerio.load(response.data);
    // Print out the HTML of the main body, skipping nav and footer. 
    // In many ASPX pages, main content is wrapped in a div with a specific id or class, or after the header.
    // Let's just remove header, footer, nav, script, style
    $('header, footer, nav, script, style, .navbar, .carousel').remove();
    const cleanHtml = $('body').html();
    console.log(cleanHtml.substring(0, 1000));
  } catch (error) {
    console.error(error);
  }
}
scrapePage();
