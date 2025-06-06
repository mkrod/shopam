const { exec } = require('child_process');
const path = require('path');

// Absolute path to your deploy script
const DEPLOY_SCRIPT_PATH = '/var/www/nodejs/shopam/deploy.sh';

const deployShopAm = (req, res) => {
  exec(`/bin/bash ${DEPLOY_SCRIPT_PATH}`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Deployment Error:', stderr || error.message);
      return res.status(500).json({ success: false, message: 'Deployment failed', error: stderr || error.message });
    }

    console.log('✅ Deployment Output:\n', stdout);
    return res.status(200).json({ success: true, message: 'Deployment successful', output: stdout });
  });
};

module.exports = { deployShopAm };
