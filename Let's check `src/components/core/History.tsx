  useEffect(() => {
    if (user) {
      Promise.all([
        getCausalMatrices(user.uid),
        getNightModeEntries(user.uid)
      ]).then(([mData, nData]) => {
        setMatrices(mData);
        setNightEntries(nData);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
    }
  }, [user]);
