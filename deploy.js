import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Remove the deprecated FIREBASE_TOKEN environment variable.
// This forces firebase-tools to use GOOGLE_APPLICATION_CREDENTIALS
// or the locally authenticated user session instead.
delete process.env.FIREBASE_TOKEN;

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  console.error('Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
  console.error('Firebase deployment requires a service account key to authenticate.');
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file.');
  console.error('Alternatively, run `firebase login` locally to use your user account.');
  process.exit(1);
}

const resolvedCredentialsPath = path.resolve(credentialsPath);

if (!fs.existsSync(resolvedCredentialsPath)) {
  console.error(`Error: The file specified in GOOGLE_APPLICATION_CREDENTIALS does not exist: ${credentialsPath}`);
  console.error('Please ensure the path is correct and the file is accessible.');
  process.exit(1);
}

// Validate that the provided credentials are a service account key
try {
  const fileContent = fs.readFileSync(resolvedCredentialsPath, 'utf8');
  const credentials = JSON.parse(fileContent);
  
  if (credentials.type !== 'service_account') {
    console.error(`Error: The credentials file at ${credentialsPath} is not a service account key.`);
    console.error(`Expected 'type' field to be 'service_account', but got '${credentials.type}'.`);
    console.error('Please provide a valid service account key JSON file for GOOGLE_APPLICATION_CREDENTIALS.');
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: Failed to read or parse the credentials file at ${credentialsPath}.`);
  console.error('Please ensure it is a valid JSON file.');
  process.exit(1);
}

console.log('FIREBASE_TOKEN removed. Using GOOGLE_APPLICATION_CREDENTIALS for authentication.');

try {
  // Explicitly pass the modified environment to ensure FIREBASE_TOKEN is not present
  execSync('firebase deploy --only hosting', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('\nDeployment failed.');
  console.error('Please ensure the service account has the necessary permissions for Firebase Hosting.');
  process.exit(1);
}
