export async function getCausalMatrices(userId: string): Promise<CausalMatrix[]> {
  const q = query(collection(db, 'causal_matrices'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const matrices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CausalMatrix));
  
  matrices.sort((a, b) => {
    const getTime = (timestamp: any) => {
      if (timestamp instanceof Timestamp) return timestamp.toMillis();
      if (timestamp instanceof Date) return timestamp.getTime();
      if (timestamp && typeof timestamp.seconds === 'number') return timestamp.seconds * 1000;
      return 0;
    };
    return getTime(b.timestamp) - getTime(a.timestamp);
  });
  
  return matrices;
}
