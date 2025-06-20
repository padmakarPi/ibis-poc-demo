require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const cssFilePath = path.join(__dirname, '..', 'public', 'css', 'access-control.css');

// Array to map each environment variable to its corresponding dev client ID
// HOW TO USE:
// - When adding a new client ID:
//   1. Add an entry to this array with:
//      - `envVarName`: the name of the environment variable containing the new client ID
//      - `devClientId`: the hardcoded client ID currently present in the CSS file
const clientIdMappings = [
  {
    envVarName: 'NEXT_PUBLIC_CLIENT_ID',
    devClientId: '0896c4c3-e70b-4f84-9054-d6b57e5351d2',
  },
];

clientIdMappings.forEach(mapping => {
  mapping.newClientId = process.env[mapping.envVarName];
});

const missingClientIds = clientIdMappings.filter(m => !m.newClientId);

if (missingClientIds.length > 0) {
  console.error('Error: Missing environment variables in .env file:');
  missingClientIds.forEach(m => {
    console.error(`- Missing environment variable: ${m.envVarName} (for devClientId: ${m.devClientId})`);
  });
  process.exit(1);
}


async function updateCssFile() {
  try {
    let data = await fs.readFile(cssFilePath, 'utf8');

    clientIdMappings.forEach(({ devClientId, newClientId }) => {
      data = data.replace(new RegExp(devClientId, 'g'), newClientId);
    });

    await fs.writeFile(cssFilePath, data, 'utf8');
    console.log('CSS file updated successfully!');
  } catch (err) {
    console.error('Error updating CSS file:', err);
    process.exit(1);
  }
}

updateCssFile();
