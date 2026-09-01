import { FieldValue } from 'firebase/firestore';

/**
 * Defines the core types and enums for the Causal Matrix feature.
 * These enums represent the various components of a user's mental pattern.
 */

// 1. Herida Raíz (Root Wound)
export enum RootWound {
  AnxiousAttachment = "Apego Ansioso",
  InvalidationFear = "Miedo a la Invalidación",
  ProtectivePerfectionism = "Perfeccionismo Protector",
  TraumaticHypervigilance = "Hipervigilancia Traumática",
}

// 2. Evento Disparador (Trigger Event)
export enum TriggerEvent {
  SeenMessageNoReply = "Mensaje dejado en 'Visto' > 30 min",
  ColdTone = "Tono cortante o frío",
  NightSilence = "Silencio nocturno",
  UnexpectedNotification = "Notificación inesperada",
}

// 3. Distorsión Cognitiva (Cognitive Bias)
export enum CognitiveBias {
  MindReading = "Lectura de Mente",
  Catastrophizing = "Catastrofismo",
  EmotionalReasoning = "Razonamiento Emocional",
  AllOrNothing = "Todo o Nada",
}

// 4. Compulsión Somática / Conductual (Somatic/Behavioral Compulsion)
export enum SomaticCompulsion {
  ImpulsiveMessaging = "Mensajes impulsivos",
  LastSeenChecking = "Revisar última conexión",
  InfiniteScrolling = "Scroll infinito",
  PhysicalTension = "Tensión física",
}

// 5. Bucle de Retroalimentación Causal (Causal Feedback Loop)
export enum FeedbackLoop {
  RelationshipExhaustion = "Agotamiento del vínculo",
  SelfEsteemDrop = "Caída de autoestima",
  NightCortisol = "Cortisol nocturno",
  Insomnia = "Insomnio",
  BrainFog = "Niebla mental",
}

// 6. Estrategia de Intervención (Intervention Strategy)
export enum InterventionStrategy {
  Mindfulness = "Mindfulness y Respiración",
  CognitiveRestructuring = "Reestructuración Cognitiva",
  BoundarySetting = "Establecimiento de Límites",
  SelfCompassion = "Autocompasión",
  DigitalDetox = "Desintoxicación Digital",
  ProfessionalHelp = "Buscar Ayuda Profesional",
  PhysicalActivity = "Actividad Física",
}

export type CausalInputs = {
  rootWound: RootWound;
  triggerEvent: TriggerEvent;
  cognitiveBias: CognitiveBias;
  somaticCompulsion: SomaticCompulsion;
  feedbackLoop: FeedbackLoop;
};

// Type for a causal matrix submission that is pending synchronization
export interface PendingCausalMatrix extends CausalInputs {
  id: string; // Local unique ID for pending item
  userId: string;
  timestamp: Date; // Local timestamp when it was created
  metrics: Omit<MentalMetrics, 'interventionStrategies'>; // Store calculated metrics
  interventionStrategies: InterventionStrategy[]; // Store calculated strategies
}

// New type for data sent to Firestore
export type CausalMatrixData = CausalInputs & Omit<MentalMetrics, 'interventionStrategies'> & {
  userId: string;
  interventionStrategies: InterventionStrategy[];
  timestamp: FieldValue;
};

// The full causal matrix for a single event (as read from Firestore)
export interface CausalMatrix extends MentalMetrics {
  id: string;
  timestamp: Date;
  userId: string;
  rootWound: RootWound;
  triggerEvent: TriggerEvent;
  cognitiveBias: CognitiveBias;
  somaticCompulsion: SomaticCompulsion;
  feedbackLoop: FeedbackLoop;
}

// Calculated metrics
export interface MentalMetrics {
  clarityIndex: number; // 0-100%
  loopIntensity: number; // 0-100%
  coupleFriction: number; // 0-100%
  sleepLatencyRisk: number; // 0-100%
  interventionStrategies: InterventionStrategy[];
}

