import { execSync } from 'child_process';

// Remove the deprecated FIREBASE_TOKEN environment variable.
// This forces firebase-tools to use GOOGLE_APPLICATION_CREDENTIALS
// or the locally authenticated user session instead.
delete process.env.FIREBASE_TOKEN;

console.log('FIREBASE_TOKEN removed. Using GOOGLE_APPLICATION_CREDENTIALS or local login.');

try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
} catch (error) {
  console.error('\nDeployment failed.');
  console.error('Please ensure you have set the GOOGLE_APPLICATION_CREDENTIALS environment variable');
  console.error('to the path of your service account key JSON file, or that you are logged in via `firebase login`.');
  process.exit(1);
}
