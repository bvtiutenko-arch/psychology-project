import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { CausalMatrixData } from '../types/causal';

export interface TestResult {
  id?: string;
  userId: string;
  testName: string;
  score: number;
  answers: Record<string, string | number>;
  createdAt?: Timestamp;
}

export interface SessionHistory {
  id?: string;
  userId: string;
  sessionType: string;
  responses: Record<string, any>;
  createdAt?: Timestamp;
}

/**
 * Saves a psychological test result to Firestore.
 * @param result The test result data (without id and createdAt).
 * @returns The ID of the newly created document.
 */
export async function saveTestResult(result: Omit<TestResult, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'testResults'), {
    ...result,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Retrieves all test results for a specific user.
 * @param userId The ID of the user.
 * @returns An array of TestResult objects.
 */
export async function getTestResults(userId: string): Promise<TestResult[]> {
  const q = query(collection(db, 'testResults'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestResult));
}

/**
 * Saves a session history entry to Firestore.
 * @param session The session data (without id and createdAt).
 * @returns The ID of the newly created document.
 */
export async function saveSessionHistory(session: Omit<SessionHistory, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'sessionHistory'), {
    ...session,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Retrieves all session history entries for a specific user.
 * @param userId The ID of the user.
 * @returns An array of SessionHistory objects.
 */
export async function getSessionHistory(userId: string): Promise<SessionHistory[]> {
  const q = query(collection(db, 'sessionHistory'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionHistory));
}

/**
 * Updates an existing session history entry.
 * @param sessionId The ID of the session document to update.
 * @param updates A partial object containing the fields to update.
 */
export async function updateSessionHistory(sessionId: string, updates: Partial<SessionHistory>): Promise<void> {
  const sessionRef = doc(db, 'sessionHistory', sessionId);
  await updateDoc(sessionRef, updates);
}

/**
 * Saves a causal matrix entry to Firestore.
 * @param data The causal matrix data.
 * @returns The ID of the newly created document.
 */
export async function saveCausalMatrix(data: CausalMatrixData): Promise<string> {
  const docRef = await addDoc(collection(db, 'causal_matrices'), data);
  return docRef.id;
}
