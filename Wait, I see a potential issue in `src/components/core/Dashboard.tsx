  const isToday = (timestamp: any): boolean => {
    if (!timestamp) return false;
    let date;
    if (timestamp instanceof Date) date = timestamp;
    else if (timestamp instanceof Timestamp) date = timestamp.toDate();
    else if (typeof timestamp === 'object' && timestamp.seconds) date = new Date(timestamp.seconds * 1000);
    else return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const latestDateLabel = latestMatrix ? (isToday(latestMatrix.timestamp) ? 'Hoy' : 'Último registro') : 'Hoy';
