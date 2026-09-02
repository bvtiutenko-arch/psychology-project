import { FieldValue, Timestamp } from 'firebase/firestore';

export interface TomorrowTask {
  id?: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt?: Timestamp | FieldValue;
  completedAt?: Date | Timestamp | FieldValue | null;
}
