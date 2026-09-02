import { openDB, IDBPDatabase } from 'idb';
import { CausalInputs, PendingCausalMatrix, CausalMatrixData } from '../types/causal';
import { PendingNightModeEntry } from '../types/nightMode';
import { PendingTomorrowTask } from '../types/tomorrowBox';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { calculateCausalMatrixMetrics } from './causalEngine';

const isDevelopment = import.meta.env.DEV; // Determine if in development environment

const DB_NAME = 'menteEnCalmaDB';
const CAUSAL_STORE_NAME = 'pendingCausalMatrices';
const NIGHT_MODE_STORE_NAME = 'pendingNightModeEntries';
const TOMORROW_STORE_NAME = 'pendingTomorrowTasks';
const DB_VERSION = 3; // Incremented from 2 to 3 to add tomorrow tasks store

let dbPromise: Promise<IDBPDatabase>;

async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CAUSAL_STORE_NAME)) {
          db.createObjectStore(CAUSAL_STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(NIGHT_MODE_STORE_NAME)) {
          db.createObjectStore(NIGHT_MODE_STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(TOMORROW_STORE_NAME)) {
          db.createObjectStore(TOMORROW_STORE_NAME, { keyPath: 'id' });
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

  await database.put(CAUSAL_STORE_NAME, pendingMatrix);
  if (isDevelopment) console.log('Causal matrix saved locally:', pendingMatrix);
  return id;
}

/**
 * Retrieves all pending causal matrices from IndexedDB.
 */
export async function getPendingCausalMatrices(): Promise<PendingCausalMatrix[]> {
  const database = await initDB();
  return database.getAll(CAUSAL_STORE_NAME);
}

/**
 * Retrieves the count of pending causal matrices from IndexedDB.
 * If userId is provided, only counts matrices belonging to that user.
 * @param userId Optional user ID to filter by. If omitted, counts all.
 */
export async function getPendingCausalMatricesCount(userId?: string): Promise<number> {
  const database = await initDB();
  if (!userId) {
    return database.count(CAUSAL_STORE_NAME);
  }
  const allMatrices = await database.getAll(CAUSAL_STORE_NAME);
  return allMatrices.filter(m => m.userId === userId).length;
}

/**
 * Removes a specific pending causal matrix from IndexedDB after successful synchronization.
 * @param id The ID of the pending matrix to remove.
 */
export async function clearPendingCausalMatrix(id: string): Promise<void> {
  const database = await initDB();
  await database.delete(CAUSAL_STORE_NAME, id);
  if (isDevelopment) console.log(`Pending causal matrix with ID ${id} cleared from local storage.`);
}

/**
 * Removes all pending causal matrices for a specific user from IndexedDB.
 * This is typically called on user logout to ensure data privacy and cleanup.
 * @param userId The ID of the user whose pending matrices should be removed.
 */
export async function clearPendingCausalMatricesForUser(userId: string): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(CAUSAL_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CAUSAL_STORE_NAME);
  const allMatrices = await store.getAll();

  const matricesToDelete = allMatrices.filter(matrix => matrix.userId === userId);

  for (const matrix of matricesToDelete) {
    await store.delete(matrix.id);
  }
  await tx.done;
  if (isDevelopment) console.log(`Cleared ${matricesToDelete.length} pending causal matrices for user ${userId}.`);
}

/**
 * Attempts to synchronize all pending causal matrices from IndexedDB to Firestore.
 * @param userId The ID of the current user.
 * @param silent If true, no toast notifications are shown by this function.
 *               The caller is responsible for showing appropriate feedback.
 */
export async function syncPendingCausalMatrices(userId: string, silent: boolean = false): Promise<void> {
  if (!navigator.onLine) {
    if (isDevelopment) console.log('Offline: Skipping sync of pending causal matrices.');
    return;
  }

  let pendingMatrices: PendingCausalMatrix[] = [];
  try {
    pendingMatrices = await getPendingCausalMatrices();
  } catch (error) {
    console.error('Error fetching pending causal matrices from IndexedDB:', error);
    if (!silent) {
      toast.error('Error al cargar matrices pendientes para sincronizar.');
    }
    return;
  }

  if (pendingMatrices.length === 0) {
    if (isDevelopment) console.log('No pending causal matrices to sync.');
    return;
  }

  if (isDevelopment) console.log(`Attempting to sync ${pendingMatrices.length} pending causal matrices...`);
  let syncedCount = 0;
  let failedCount = 0;
  const failedMatrixIds: string[] = [];

  for (const matrix of pendingMatrices) {
    if (matrix.userId !== userId) {
      if (isDevelopment) console.warn(`Skipping pending matrix for different user: ${matrix.userId} (current user: ${userId})`);
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
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'causal_matrices'), dataToStore);
      await clearPendingCausalMatrix(matrix.id);
      syncedCount++;
      if (isDevelopment) console.log(`Successfully synced pending matrix: ${matrix.id}`);
    } catch (error) {
      console.error(`Failed to sync pending matrix ${matrix.id}:`, error);
      failedCount++;
      failedMatrixIds.push(matrix.id.substring(0, 8));
    }
  }

  if (!silent && (syncedCount > 0 || failedCount > 0)) {
    if (syncedCount === pendingMatrices.length) {
      toast.success(`¡Todas las ${syncedCount} matrices pendientes sincronizadas!`);
    } else if (syncedCount > 0) {
      toast.success(`Se sincronizaron ${syncedCount} matrices. ${failedCount} fallaron: ${failedMatrixIds.join(', ')}.`);
    } else {
      toast.error(`Fallo la sincronización de ${failedCount} matrices: ${failedMatrixIds.join(', ')}.`);
    }
  }
}

// =====================
// Night Mode Offline Sync
// =====================

/**
 * Saves a night mode entry to IndexedDB when offline.
 * @param entry The night mode entry data (without id and timestamp).
 * @returns The ID of the saved pending entry.
 */
export async function savePendingNightModeEntry(entry: Omit<PendingNightModeEntry, 'id' | 'timestamp'>): Promise<string> {
  const database = await initDB();
  const id = crypto.randomUUID();
  const timestamp = new Date();

  const pendingEntry: PendingNightModeEntry = {
    id,
    timestamp,
    ...entry,
  };

  await database.put(NIGHT_MODE_STORE_NAME, pendingEntry);
  if (isDevelopment) console.log('Night mode entry saved locally:', pendingEntry);
  return id;
}

/**
 * Retrieves all pending night mode entries from IndexedDB.
 */
export async function getPendingNightModeEntries(): Promise<PendingNightModeEntry[]> {
  const database = await initDB();
  return database.getAll(NIGHT_MODE_STORE_NAME);
}

/**
 * Retrieves the count of pending night mode entries from IndexedDB.
 * If userId is provided, only counts entries belonging to that user.
 * @param userId Optional user ID to filter by. If omitted, counts all.
 */
export async function getPendingNightModeEntriesCount(userId?: string): Promise<number> {
  const database = await initDB();
  if (!userId) {
    return database.count(NIGHT_MODE_STORE_NAME);
  }
  const allEntries = await database.getAll(NIGHT_MODE_STORE_NAME);
  return allEntries.filter(e => e.userId === userId).length;
}

/**
 * Removes a specific pending night mode entry from IndexedDB after successful synchronization.
 * @param id The ID of the pending entry to remove.
 */
export async function clearPendingNightModeEntry(id: string): Promise<void> {
  const database = await initDB();
  await database.delete(NIGHT_MODE_STORE_NAME, id);
  if (isDevelopment) console.log(`Pending night mode entry with ID ${id} cleared from local storage.`);
}

/**
 * Removes all pending night mode entries for a specific user from IndexedDB.
 * @param userId The ID of the user whose pending entries should be removed.
 */
export async function clearPendingNightModeEntriesForUser(userId: string): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(NIGHT_MODE_STORE_NAME, 'readwrite');
  const store = tx.objectStore(NIGHT_MODE_STORE_NAME);
  const allEntries = await store.getAll();

  const entriesToDelete = allEntries.filter(entry => entry.userId === userId);

  for (const entry of entriesToDelete) {
    await store.delete(entry.id);
  }
  await tx.done;
  if (isDevelopment) console.log(`Cleared ${entriesToDelete.length} pending night mode entries for user ${userId}.`);
}

/**
 * Attempts to synchronize all pending night mode entries from IndexedDB to Firestore.
 * @param userId The ID of the current user.
 * @param silent If true, no toast notifications are shown by this function.
 */
export async function syncPendingNightModeEntries(userId: string, silent: boolean = false): Promise<void> {
  if (!navigator.onLine) {
    if (isDevelopment) console.log('Offline: Skipping sync of pending night mode entries.');
    return;
  }

  let pendingEntries: PendingNightModeEntry[] = [];
  try {
    pendingEntries = await getPendingNightModeEntries();
  } catch (error) {
    console.error('Error fetching pending night mode entries from IndexedDB:', error);
    if (!silent) {
      toast.error('Error al cargar entradas de modo noche pendientes para sincronizar.');
    }
    return;
  }

  if (pendingEntries.length === 0) {
    if (isDevelopment) console.log('No pending night mode entries to sync.');
    return;
  }

  if (isDevelopment) console.log(`Attempting to sync ${pendingEntries.length} pending night mode entries...`);
  let syncedCount = 0;
  let failedCount = 0;
  const failedEntryIds: string[] = [];

  for (const entry of pendingEntries) {
    if (entry.userId !== userId) {
      if (isDevelopment) console.warn(`Skipping pending night mode entry for different user: ${entry.userId} (current user: ${userId})`);
      continue;
    }

    try {
      const dataToStore = {
        userId: entry.userId,
        thought: entry.thought,
        needsActionNow: entry.needsActionNow,
        actionForTomorrow: entry.actionForTomorrow || '',
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'night_mode_entries'), dataToStore);
      await clearPendingNightModeEntry(entry.id);
      syncedCount++;
      if (isDevelopment) console.log(`Successfully synced pending night mode entry: ${entry.id}`);
    } catch (error) {
      console.error(`Failed to sync pending night mode entry ${entry.id}:`, error);
      failedCount++;
      failedEntryIds.push(entry.id.substring(0, 8));
    }
  }

  if (!silent && (syncedCount > 0 || failedCount > 0)) {
    if (syncedCount === pendingEntries.length) {
      toast.success(`¡Todas las ${syncedCount} entradas de modo noche sincronizadas!`);
    } else if (syncedCount > 0) {
      toast.success(`Se sincronizaron ${syncedCount} entradas. ${failedCount} fallaron: ${failedEntryIds.join(', ')}.`);
    } else {
      toast.error(`Fallo la sincronización de ${failedCount} entradas: ${failedEntryIds.join(', ')}.`);
    }
  }
}

// =====================
// Tomorrow Box Offline Sync
// =====================

/**
 * Saves a tomorrow task to IndexedDB when offline.
 * @param task The tomorrow task data (without id and timestamp).
 * @returns The ID of the saved pending task.
 */
export async function savePendingTomorrowTask(task: Omit<PendingTomorrowTask, 'id' | 'timestamp'>): Promise<string> {
  const database = await initDB();
  const id = crypto.randomUUID();
  const timestamp = new Date();

  const pendingTask: PendingTomorrowTask = {
    id,
    timestamp,
    ...task,
  };

  await database.put(TOMORROW_STORE_NAME, pendingTask);
  if (isDevelopment) console.log('Tomorrow task saved locally:', pendingTask);
  return id;
}

/**
 * Retrieves all pending tomorrow tasks from IndexedDB.
 */
export async function getPendingTomorrowTasks(): Promise<PendingTomorrowTask[]> {
  const database = await initDB();
  return database.getAll(TOMORROW_STORE_NAME);
}

/**
 * Retrieves the count of pending tomorrow tasks from IndexedDB.
 * If userId is provided, only counts tasks belonging to that user.
 * @param userId Optional user ID to filter by. If omitted, counts all.
 */
export async function getPendingTomorrowTasksCount(userId?: string): Promise<number> {
  const database = await initDB();
  if (!userId) {
    return database.count(TOMORROW_STORE_NAME);
  }
  const allTasks = await database.getAll(TOMORROW_STORE_NAME);
  return allTasks.filter(t => t.userId === userId).length;
}

/**
 * Removes a specific pending tomorrow task from IndexedDB after successful synchronization.
 * @param id The ID of the pending task to remove.
 */
export async function clearPendingTomorrowTask(id: string): Promise<void> {
  const database = await initDB();
  await database.delete(TOMORROW_STORE_NAME, id);
  if (isDevelopment) console.log(`Pending tomorrow task with ID ${id} cleared from local storage.`);
}

/**
 * Removes all pending tomorrow tasks for a specific user from IndexedDB.
 * @param userId The ID of the user whose pending tasks should be removed.
 */
export async function clearPendingTomorrowTasksForUser(userId: string): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(TOMORROW_STORE_NAME, 'readwrite');
  const store = tx.objectStore(TOMORROW_STORE_NAME);
  const allTasks = await store.getAll();

  const tasksToDelete = allTasks.filter(task => task.userId === userId);

  for (const task of tasksToDelete) {
    await store.delete(task.id);
  }
  await tx.done;
  if (isDevelopment) console.log(`Cleared ${tasksToDelete.length} pending tomorrow tasks for user ${userId}.`);
}

/**
 * Attempts to synchronize all pending tomorrow tasks from IndexedDB to Firestore.
 * @param userId The ID of the current user.
 * @param silent If true, no toast notifications are shown by this function.
 */
export async function syncPendingTomorrowTasks(userId: string, silent: boolean = false): Promise<void> {
  if (!navigator.onLine) {
    if (isDevelopment) console.log('Offline: Skipping sync of pending tomorrow tasks.');
    return;
  }

  let pendingTasks: PendingTomorrowTask[] = [];
  try {
    pendingTasks = await getPendingTomorrowTasks();
  } catch (error) {
    console.error('Error fetching pending tomorrow tasks from IndexedDB:', error);
    if (!silent) {
      toast.error('Error al cargar tareas pendientes para sincronizar.');
    }
    return;
  }

  if (pendingTasks.length === 0) {
    if (isDevelopment) console.log('No pending tomorrow tasks to sync.');
    return;
  }

  if (isDevelopment) console.log(`Attempting to sync ${pendingTasks.length} pending tomorrow tasks...`);
  let syncedCount = 0;
  let failedCount = 0;
  const failedTaskIds: string[] = [];

  for (const task of pendingTasks) {
    if (task.userId !== userId) {
      if (isDevelopment) console.warn(`Skipping pending tomorrow task for different user: ${task.userId} (current user: ${userId})`);
      continue;
    }

    try {
      const dataToStore = {
        userId: task.userId,
        text: task.text,
        completed: task.completed,
        createdAt: serverTimestamp(),
        completedAt: null,
      };
      await addDoc(collection(db, 'tomorrow_tasks'), dataToStore);
      await clearPendingTomorrowTask(task.id);
      syncedCount++;
      if (isDevelopment) console.log(`Successfully synced pending tomorrow task: ${task.id}`);
    } catch (error) {
      console.error(`Failed to sync pending tomorrow task ${task.id}:`, error);
      failedCount++;
      failedTaskIds.push(task.id.substring(0, 8));
    }
  }

  if (!silent && (syncedCount > 0 || failedCount > 0)) {
    if (syncedCount === pendingTasks.length) {
      toast.success(`¡Todas las ${syncedCount} tareas pendientes sincronizadas!`);
    } else if (syncedCount > 0) {
      toast.success(`Se sincronizaron ${syncedCount} tareas. ${failedCount} fallaron: ${failedTaskIds.join(', ')}.`);
    } else {
      toast.error(`Fallo la sincronización de ${failedCount} tareas: ${failedTaskIds.join(', ')}.`);
    }
  }
}
