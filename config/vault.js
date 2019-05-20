const fs = require('fs');

let vaultOptions = {
  apiVersion: 'v1', // default
  endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200', // default
  token: process.env.VAULT_TOKEN,
};


// do we have extra SSL certs set? if so, read them.
if (process.env.NODE_EXTRA_CA_CERTS)  {
    vaultOptions.requestOptions = {
	ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS)
    }
}

// get new instance of the client
const vaultClient = require('node-vault')(vaultOptions);

module.exports = vaultClient;
