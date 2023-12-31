const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
  production: ${isProduction},
  firebase:{
    apiKey:"${process.env["API_KEY"]}",
    authDomain:"${process.env["AUTH_DOMAIN"]}",
    projectId: "${process.env["PROJECT_ID"]}",
    storageBucket:"${process.env["STORAGE_BUCKET"]}",
    messagingSenderId:"${process.env["MESSAGING_SENDER_ID"]}",
    appId:"${process.env["APP_ID"]}",
    measurementId:"${process.env["MEASUREMENT_ID"]}",
    databaseURL: "${process.env["DATABASE_URL"]}",
  }
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
  if (err) {
    console.log(err);
  }

  console.log(`Wrote variables to ${targetPath}`);
})