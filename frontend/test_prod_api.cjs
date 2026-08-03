const https = require('https');

https.get('https://gppvvs.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^\.]+\.js)"/);
    if (match) {
      console.log('Found JS bundle:', match[1]);
      https.get('https://gppvvs.vercel.app' + match[1], (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          const apiMatch = jsData.match(/https?:\/\/[^"']+\/api/g);
          if (apiMatch) {
            console.log('Found API URLs in bundle:');
            const uniqueApis = [...new Set(apiMatch)];
            console.log(uniqueApis);
            
            // Try fetching department from the first API URL
            if (uniqueApis.length > 0) {
              const testUrl = uniqueApis[0] + '/departments/english';
              console.log('Testing', testUrl);
              const lib = testUrl.startsWith('https') ? require('https') : require('http');
              lib.get(testUrl, (apiRes) => {
                let apiData = '';
                apiRes.on('data', chunk => apiData += chunk);
                apiRes.on('end', () => {
                  console.log('API Status:', apiRes.statusCode);
                  console.log('API Response:', apiData.substring(0, 500));
                });
              }).on('error', e => console.error(e));
            }
          } else {
            console.log('No API URL found in JS bundle.');
          }
        });
      });
    } else {
      console.log('Could not find JS bundle in HTML.');
    }
  });
});
