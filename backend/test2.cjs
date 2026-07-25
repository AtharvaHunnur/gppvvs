const cloudinary = require("cloudinary").v2; 
const streamifier = require("streamifier"); 
const fs = require("fs");
process.env.CLOUDINARY_URL = "cloudinary://873933523357114:VeHuBktpskGqC5Odm_EPcC_b3Z4@cztlrodq"; 
cloudinary.config(true); 
async function testUpload() { 
  const pdfBuffer = fs.readFileSync("sample.pdf");
  return new Promise((resolve, reject) => { 
    const stream = cloudinary.uploader.upload_stream({ folder: "test", resource_type: "raw", public_id: "test_doc", format: "pdf" }, (error, result) => { 
      if (error) reject(error); else resolve(result); 
    }); 
    streamifier.createReadStream(pdfBuffer).pipe(stream); 
  }); 
} 
testUpload().then(res => console.log("Upload Success:", res.secure_url)).catch(err => console.error("Upload Error:", err));
