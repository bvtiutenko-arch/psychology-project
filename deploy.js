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

if (!fs.existsSync(path.resolve(credentialsPath))) {
  console.error(`Error: The file specified in GOOGLE_APPLICATION_CREDENTIALS does not exist: ${credentialsPath}`);
  console.error('Please ensure the path is correct and the file is accessible.');
  process.exit(1);
}

console.log('FIREBASE_TOKEN removed. Using GOOGLE_APPLICATION_CREDENTIALS for authentication.');

try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
} catch (error) {
  console.error('\nDeployment failed.');
  console.error('Please ensure the service account has the necessary permissions for Firebase Hosting.');
  process.exit(1);
}
