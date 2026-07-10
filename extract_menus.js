const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\athar\\.gemini\\antigravity\\brain\\326a68cc-2e39-4d1c-a6b8-8bc746466eb2\\.system_generated\\steps\\1461\\content.md', 'utf8');

// Find the index of "Infrastructure"
const infraIdx = content.indexOf('Infrastructure');
if (infraIdx !== -1) {
  console.log('--- Infrastructure ---');
  console.log(content.substring(infraIdx, infraIdx + 1000));
}

// Find the index of "Student Corner"
const scIdx = content.indexOf('Student Corner');
if (scIdx !== -1) {
  console.log('\n--- Student Corner ---');
  console.log(content.substring(scIdx, scIdx + 2000));
}
