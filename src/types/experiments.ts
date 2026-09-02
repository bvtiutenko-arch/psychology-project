import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Experiment {
  id?: string;
  userId: string;
  hypothesis: string;
  strategy: string;
  status: 'pending' | 'success' | 'failure' | 'inconclusive';
  createdAt?: Timestamp | FieldValue;
  completedAt?: Timestamp | FieldValue | null;
  notes?: string;
}
