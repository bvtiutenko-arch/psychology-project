const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      // Save session history for login
      await saveSessionHistory({
        userId: result.user.uid,
        sessionType: 'login',
        responses: { method: 'google' }
      });
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al iniciar sesión.');
    }
  };
