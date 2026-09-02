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
