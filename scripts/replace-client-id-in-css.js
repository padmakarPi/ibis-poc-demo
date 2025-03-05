require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const cssFilePath = path.join(__dirname, '..', 'public', 'css', 'access-control.css');
const devClientId = '0896c4c3-e70b-4f84-9054-d6b57e5351d2';
const newClientId = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!newClientId) {
  console.error('Error: NEXT_PUBLIC_CLIENT_ID is not defined in the .env file');
  process.exit(1);
}

async function updateCssFile() {
  try {
    const data = await fs.readFile(cssFilePath, 'utf8');
    const updatedData = data.replace(new RegExp(devClientId, 'g'), newClientId);
    await fs.writeFile(cssFilePath, updatedData, 'utf8');
    console.log('CSS file updated successfully!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateCssFile();
