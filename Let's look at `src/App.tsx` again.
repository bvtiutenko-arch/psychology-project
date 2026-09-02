  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const action = params.get('action');

      let targetPath = location.pathname;
      let shouldNavigate = false;

      if (action === 'new_matrix') {
        targetPath = '/new-matrix';
        shouldNavigate = true;
      } else if (action === 'view_dashboard') {
        targetPath = '/dashboard';
        shouldNavigate = true;
      }

      if (action) {
        params.delete('action');
        shouldNavigate = true;
      }

      if (shouldNavigate) {
        const newSearch = params.toString();
        navigate(targetPath + (newSearch ? `?${newSearch}` : ''), { replace: true });
      }

      if (isOnline) {
        syncPendingCausalMatrices(user.uid).then(() => refreshPendingCount());
      }
      refreshPendingCount();
    }
  }, [loading, user, location.search, navigate, location.pathname, isOnline])
