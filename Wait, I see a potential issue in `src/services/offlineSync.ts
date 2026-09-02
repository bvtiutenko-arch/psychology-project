export async function syncPendingCausalMatrices(userId: string): Promise<void> {
  if (!navigator.onLine) {
    if (isDevelopment) console.log('Offline: Skipping sync of pending causal matrices.');
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
