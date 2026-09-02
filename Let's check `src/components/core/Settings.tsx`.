  const handleDelete = async () => {
    if (!user) return;
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todos tus registros.')) {
      try {
        await deleteAllUserData(user.uid);
        toast.success('Todos tus datos han sido eliminados.');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al eliminar datos.');
      }
    }
  };
