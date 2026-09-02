import { FieldValue } from 'firebase/firestore';

export interface NightModeEntry {
  id?: string;
  userId: string;
  thought: string;
  needsActionNow: boolean;
  actionForTomorrow?: string;
  timestamp: Date | FieldValue;
}
