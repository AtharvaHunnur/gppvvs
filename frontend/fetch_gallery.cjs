const fs = require('fs');
const http = require('http');

http.get('http://gppvvs.ac.in/Gallery.aspx', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
    let match;
    const images = new Set();
    while ((match = imgRegex.exec(data)) !== null) {
      let src = match[1];
      if (src.includes('Gallery') || src.includes('Uploads')) {
        images.add(src);
      }
    }
    
    console.log("Found Gallery Images:");
    Array.from(images).forEach(i => console.log(i));
    
    // Save to a json file
    fs.writeFileSync('gallery_images.json', JSON.stringify(Array.from(images), null, 2));
  });
}).on('error', (e) => {
  console.error("Got error: " + e.message);
});
