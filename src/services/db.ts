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
  Timestamp,
  orderBy,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { CausalMatrixData, CausalMatrix } from '../types/causal';
import { NightModeEntry } from '../types/nightMode';
import { TomorrowTask } from '../types/tomorrowBox';

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

/**
 * Retrieves all causal matrices for a specific user, ordered by timestamp descending.
 * @param userId The ID of the user.
 * @returns An array of CausalMatrix objects.
 */
export async function getCausalMatrices(userId: string): Promise<CausalMatrix[]> {
  const q = query(collection(db, 'causal_matrices'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CausalMatrix));
}

/**
 * Saves a night mode entry to Firestore.
 * @param entry The night mode entry data.
 * @returns The ID of the newly created document.
 */
export async function saveNightModeEntry(entry: Omit<NightModeEntry, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'night_mode_entries'), entry);
  return docRef.id;
}

/**
 * Retrieves all night mode entries for a specific user, ordered by timestamp descending.
 * @param userId The ID of the user.
 * @returns An array of NightModeEntry objects.
 */
export async function getNightModeEntries(userId: string): Promise<NightModeEntry[]> {
  const q = query(collection(db, 'night_mode_entries'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NightModeEntry));
}

// --- Tomorrow Box ---

export async function saveTomorrowTask(task: Omit<TomorrowTask, 'id' | 'createdAt' | 'completedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'tomorrow_tasks'), {
    ...task,
    createdAt: serverTimestamp(),
    completedAt: null
  });
  return docRef.id;
}

export async function getTomorrowTasks(userId: string): Promise<TomorrowTask[]> {
  const q = query(collection(db, 'tomorrow_tasks'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TomorrowTask));
}

export async function updateTomorrowTask(taskId: string, updates: Partial<TomorrowTask>): Promise<void> {
  const taskRef = doc(db, 'tomorrow_tasks', taskId);
  await updateDoc(taskRef, updates);
}

export async function deleteTomorrowTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tomorrow_tasks', taskId);
  await deleteDoc(taskRef);
}

// --- Privacy / Data Management ---

export async function deleteAllUserData(userId: string): Promise<void> {
  const collectionsToDelete = ['causal_matrices', 'night_mode_entries', 'tomorrow_tasks', 'testResults', 'sessionHistory'];
  
  for (const colName of collectionsToDelete) {
    const q = query(collection(db, colName), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export async function exportUserData(userId: string): Promise<Record<string, any>> {
  const data: Record<string, any> = {};
  const collectionsToExport = ['causal_matrices', 'night_mode_entries', 'tomorrow_tasks', 'testResults', 'sessionHistory'];
  
  for (const colName of collectionsToExport) {
    const q = query(collection(db, colName), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    data[colName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  return data;
}
