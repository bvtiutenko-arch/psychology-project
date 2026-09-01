import { openDB, IDBPDatabase } from 'idb';
import { CausalInputs, PendingCausalMatrix, MentalMetrics, InterventionStrategy } from '../types/causal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { calculateMetrics } from './patternEngine';

const DB_NAME = 'menteEnCalmaDB';
const STORE_NAME = 'pendingCausalMatrices';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase>;

async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Saves a causal matrix submission to IndexedDB when offline.
 * @param inputs The CausalInputs from the form.
 * @param userId The ID of the current user.
 * @returns The ID of the saved pending matrix.
 */
export async function savePendingCausalMatrix(inputs: CausalInputs, userId: string): Promise<string> {
  const database = await initDB();
  const id = crypto.randomUUID(); // Generate a unique ID for the pending item
  const timestamp = new Date();

  const { interventionStrategies, ...mentalMetricsWithoutStrategies } = calculateMetrics(inputs);

  const pendingMatrix: PendingCausalMatrix = {
    id,
    userId,
    timestamp,
    ...inputs,
    metrics: mentalMetricsWithoutStrategies,
    interventionStrategies,
  };

  await database.put(STORE_NAME, pendingMatrix);
  console.log('Causal matrix saved locally:', pendingMatrix);
  return id;
}

/**
 * Retrieves all pending causal matrices from IndexedDB.
 */
export async function getPendingCausalMatrices(): Promise<PendingCausalMatrix[]> {
  const database = await initDB();
  return database.getAll(STORE_NAME);
}

/**
 * Removes a specific pending causal matrix from IndexedDB after successful synchronization.
 * @param id The ID of the pending matrix to remove.
 */
export async function clearPendingCausalMatrix(id: string): Promise<void> {
  const database = await initDB();
  await database.delete(STORE_NAME, id);
  console.log(`Pending causal matrix with ID ${id} cleared from local storage.`);
}

/**
 * Attempts to synchronize all pending causal matrices from IndexedDB to Firestore.
 * @param userId The ID of the current user.
 */
export async function syncPendingCausalMatrices(userId: string): Promise<void> {
  if (!navigator.onLine) {
    console.log('Offline: Skipping sync of pending causal matrices.');
    return;
  }

  const pendingMatrices = await getPendingCausalMatrices();

  if (pendingMatrices.length === 0) {
    console.log('No pending causal matrices to sync.');
    return;
  }

  console.log(`Attempting to sync ${pendingMatrices.length} pending causal matrices...`);

  for (const matrix of pendingMatrices) {
    if (matrix.userId !== userId) {
      console.warn(`Skipping pending matrix for different user: ${matrix.userId}`);
      continue;
    }

    try {
      await addDoc(collection(db, 'causal_matrices'), {
        userId: matrix.userId,
        rootWound: matrix.rootWound,
        triggerEvent: matrix.triggerEvent,
        cognitiveBias: matrix.cognitiveBias,
        somaticCompulsion: matrix.somaticCompulsion,
        feedbackLoop: matrix.feedbackLoop,
        ...matrix.metrics,
        interventionStrategies: matrix.interventionStrategies,
        timestamp: serverTimestamp(), // Use server timestamp for actual record
      });
      await clearPendingCausalMatrix(matrix.id);
      toast.success(`Matriz Causal sincronizada: ${matrix.id.substring(0, 8)}...`);
      console.log(`Successfully synced pending matrix: ${matrix.id}`);
    } catch (error) {
      console.error(`Failed to sync pending matrix ${matrix.id}:`, error);
      // If an error occurs, keep it in IndexedDB for a future attempt
      toast.error(`Error al sincronizar matriz ${matrix.id.substring(0, 8)}... Se reintentará.`);
      break; // Stop syncing if one fails, assume network issue persists
    }
  }
}
