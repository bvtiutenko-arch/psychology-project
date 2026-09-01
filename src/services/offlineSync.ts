import { openDB, IDBPDatabase } from 'idb';
import { CausalInputs, PendingCausalMatrix, CausalMatrixData } from '../types/causal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { calculateCausalMatrixMetrics } from './causalEngine';

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

  const { metrics: mentalMetricsWithoutStrategies, strategies: interventionStrategies } = calculateCausalMatrixMetrics(inputs);

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
 * Retrieves the count of pending causal matrices from IndexedDB.
 */
export async function getPendingCausalMatricesCount(): Promise<number> {
  const database = await initDB();
  return database.count(STORE_NAME);
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
 * Removes all pending causal matrices for a specific user from IndexedDB.
 * This is typically called on user logout to ensure data privacy and cleanup.
 * @param userId The ID of the user whose pending matrices should be removed.
 */
export async function clearPendingCausalMatricesForUser(userId: string): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const allMatrices = await store.getAll();

  const matricesToDelete = allMatrices.filter(matrix => matrix.userId === userId);

  for (const matrix of matricesToDelete) {
    await store.delete(matrix.id);
  }
  await tx.done;
  console.log(`Cleared ${matricesToDelete.length} pending causal matrices for user ${userId}.`);
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

  let pendingMatrices: PendingCausalMatrix[] = [];
  try {
    pendingMatrices = await getPendingCausalMatrices();
  } catch (error) {
    console.error('Error fetching pending causal matrices from IndexedDB:', error);
    toast.error('Error al cargar matrices pendientes para sincronizar.');
    return;
  }

  if (pendingMatrices.length === 0) {
    console.log('No pending causal matrices to sync.');
    return;
  }

  console.log(`Attempting to sync ${pendingMatrices.length} pending causal matrices...`);
  let syncedCount = 0;
  let failedCount = 0;
  const failedMatrixIds: string[] = [];

  for (const matrix of pendingMatrices) {
    if (matrix.userId !== userId) {
      console.warn(`Skipping pending matrix for different user: ${matrix.userId} (current user: ${userId})`);
      continue;
    }

    try {
      const dataToStore: CausalMatrixData = {
        userId: matrix.userId,
        rootWound: matrix.rootWound,
        triggerEvent: matrix.triggerEvent,
        cognitiveBias: matrix.cognitiveBias,
        somaticCompulsion: matrix.somaticCompulsion,
        feedbackLoop: matrix.feedbackLoop,
        ...matrix.metrics,
        interventionStrategies: matrix.interventionStrategies,
        timestamp: serverTimestamp(), // Use server timestamp for actual record
      };
      await addDoc(collection(db, 'causal_matrices'), dataToStore);
      await clearPendingCausalMatrix(matrix.id);
      syncedCount++;
      console.log(`Successfully synced pending matrix: ${matrix.id}`);
    } catch (error) {
      console.error(`Failed to sync pending matrix ${matrix.id}:`, error);
      failedCount++;
      failedMatrixIds.push(matrix.id.substring(0, 8));
      // Keep it in IndexedDB for a future attempt
    }
  }

  if (syncedCount > 0 || failedCount > 0) {
    if (syncedCount === pendingMatrices.length) {
      toast.success(`¡Todas las ${syncedCount} matrices pendientes sincronizadas!`);
    } else if (syncedCount > 0) {
      toast.success(`Se sincronizaron ${syncedCount} matrices. ${failedCount} fallaron: ${failedMatrixIds.join(', ')}.`);
    } else {
      toast.error(`Fallo la sincronización de ${failedCount} matrices: ${failedMatrixIds.join(', ')}.`);
    }
  }
}
