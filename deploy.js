import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Never use the deprecated FIREBASE_TOKEN.
delete process.env.FIREBASE_TOKEN;

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('');
console.log('==================================================');
console.log('FIREBASE DEPLOY');
console.log('==================================================');

if (credentialsPath) {
  const resolvedCredentialsPath = path.resolve(credentialsPath);

  console.log(`Using GOOGLE_APPLICATION_CREDENTIALS: ${resolvedCredentialsPath}`);

  if (!fs.existsSync(resolvedCredentialsPath)) {
    console.error(
      `ERROR: GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist: ${resolvedCredentialsPath}`
    );
    process.exit(1);
  }

  try {
    const fileContent = fs.readFileSync(resolvedCredentialsPath, 'utf8');
    const credentials = JSON.parse(fileContent);

    if (credentials.type !== 'service_account') {
      console.error('ERROR: credentials file is not a service account key.');
      process.exit(1);
    }

    console.log('Service account credentials validated.');
  } catch (error) {
    console.error('ERROR: failed to read or parse service account credentials.');
    process.exit(1);
  }
} else {
  console.log('GOOGLE_APPLICATION_CREDENTIALS is not set.');
  console.log('Falling back to Firebase CLI local authentication.');
  console.log('Firebase must already be authenticated with `firebase login`.');
}

try {
  execSync(
    'firebase deploy --only hosting --non-interactive',
    {
      stdio: 'inherit',
      env: process.env
    }
  );

  console.log('');
  console.log('==================================================');
  console.log('FIREBASE DEPLOY SUCCESSFUL');
  console.log('==================================================');
  console.log('');
} catch (error) {
  console.error('');
  console.error('==================================================');
  console.error('FIREBASE DEPLOY FAILED');
  console.error('==================================================');
  console.error('');
  process.exit(1);
}
