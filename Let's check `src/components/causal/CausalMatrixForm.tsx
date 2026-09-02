  const handleSubmit = async () => {
    if (!user || !isFormComplete) {
      toast.error('Por favor, completa todos los campos de la matriz.');
      return;
    }

    setIsSubmitting(true);
    const { metrics: mentalMetricsWithoutStrategies, strategies: interventionStrategies } = calculateCausalMatrixMetrics(formData);

    try {
      const dataToStore: CausalMatrixData = {
        userId: user.uid,
        ...formData,
        ...mentalMetricsWithoutStrategies,
        interventionStrategies, // Store strategies separately
        timestamp: serverTimestamp(),
      };
      await saveCausalMatrix(dataToStore);

      setLatestMetrics({ ...mentalMetricsWithoutStrategies, interventionStrategies });
      toast.success('Matriz Causal registrada con éxito.');
      setShowSummary(false);
    } catch (error) {
      console.error("Error adding document to Firestore, attempting offline save: ", error);
      await savePendingCausalMatrix(formData, user.uid);
      setLatestMetrics({ ...mentalMetricsWithoutStrategies, interventionStrategies });
      toast.success('Matriz Causal guardada localmente. Se sincronizará cuando haya conexión.');
      setShowSummary(false);

      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-causal-matrices')
            .then(() => { if (isDevelopment) console.log('Background sync registered: sync-causal-matrices'); })
            .catch(err => console.error('Failed to register background sync:', err));
        });
      } else {
        if (isDevelopment) console.warn('Background Sync API not supported or service worker not ready.');
      }

      await syncPendingCausalMatrices(user.uid);
    } finally {
      setIsSubmitting(false);
    }
  };
