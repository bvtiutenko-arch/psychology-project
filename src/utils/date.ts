import { Timestamp } from 'firebase/firestore';

export const formatDate = (timestamp: any, includeTime: boolean = false): string => {
  if (!timestamp) return 'Fecha no disponible';
  let date;
  if (timestamp instanceof Date) date = timestamp;
  else if (timestamp instanceof Timestamp) date = timestamp.toDate();
  else if (typeof timestamp === 'object' && timestamp.seconds) date = new Date(timestamp.seconds * 1000);
  else return 'Fecha no disponible';
  
  if (includeTime) {
    return date.toLocaleString('es-PE');
  }
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
};
