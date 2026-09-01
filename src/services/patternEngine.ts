import {
  RootWound,
  TriggerEvent,
  CognitiveBias,
  SomaticCompulsion,
  FeedbackLoop,
  MentalMetrics,
  CausalInputs,
  InterventionStrategy,
} from '../types/causal';

// This is a simplified model. In a real-world scenario, these weights would be
// fine-tuned based on clinical data and user feedback.
const weights = {
  rootWound: {
    [RootWound.AnxiousAttachment]: { loopIntensity: 20, coupleFriction: 25, clarity: -10 },
    [RootWound.InvalidationFear]: { loopIntensity: 15, coupleFriction: 20, clarity: -15 },
    [RootWound.ProtectivePerfectionism]: { loopIntensity: 10, coupleFriction: 10, clarity: -20 },
    [RootWound.TraumaticHypervigilance]: { loopIntensity: 25, coupleFriction: 15, clarity: -25, sleepLatencyRisk: 10 },
  },
  triggerEvent: {
    [TriggerEvent.SeenMessageNoReply]: { loopIntensity: 25, coupleFriction: 20, clarity: -15 },
    [TriggerEvent.ColdTone]: { loopIntensity: 20, coupleFriction: 25, clarity: -10 },
    [TriggerEvent.NightSilence]: { loopIntensity: 15, coupleFriction: 15, sleepLatencyRisk: 20 },
    [TriggerEvent.UnexpectedNotification]: { loopIntensity: 10, sleepLatencyRisk: 15 },
  },
  cognitiveBias: {
    [CognitiveBias.MindReading]: { loopIntensity: 20, coupleFriction: 20, clarity: -25 },
    [CognitiveBias.Catastrophizing]: { loopIntensity: 25, clarity: -30, sleepLatencyRisk: 15 },
    [CognitiveBias.EmotionalReasoning]: { loopIntensity: 15, clarity: -20 },
    [CognitiveBias.AllOrNothing]: { loopIntensity: 10, coupleFriction: 15, clarity: -15 },
  },
  somaticCompulsion: {
    [SomaticCompulsion.ImpulsiveMessaging]: { loopIntensity: 20, coupleFriction: 30 },
    [SomaticCompulsion.LastSeenChecking]: { loopIntensity: 25, coupleFriction: 10 },
    [SomaticCompulsion.InfiniteScrolling]: { loopIntensity: 15, sleepLatencyRisk: 20 },
    [SomaticCompulsion.PhysicalTension]: { sleepLatencyRisk: 10, loopIntensity: 5 },
  },
  feedbackLoop: {
    [FeedbackLoop.RelationshipExhaustion]: { coupleFriction: 30, clarity: -10 },
    [FeedbackLoop.SelfEsteemDrop]: { loopIntensity: 10, clarity: -20 },
    [FeedbackLoop.NightCortisol]: { loopIntensity: 15, sleepLatencyRisk: 30 },
    [FeedbackLoop.Insomnia]: { sleepLatencyRisk: 40, clarity: -15 },
    [FeedbackLoop.BrainFog]: { clarity: -30 },
  },
};

/**
 * Recommends intervention strategies based on causal inputs and calculated mental metrics.
 * This is a simplified rule-based system.
 */
const recommendInterventionStrategies = (inputs: CausalInputs, metrics: Omit<MentalMetrics, 'interventionStrategies'>): InterventionStrategy[] => {
  const strategies: Set<InterventionStrategy> = new Set();

  // General recommendations based on metric thresholds
  if (metrics.loopIntensity > 60) {
    strategies.add(InterventionStrategy.Mindfulness);
    strategies.add(InterventionStrategy.CognitiveRestructuring);
  }
  if (metrics.coupleFriction > 50) {
    strategies.add(InterventionStrategy.BoundarySetting);
    strategies.add(InterventionStrategy.ProfessionalHelp); // Suggest professional help for high friction
  }
  if (metrics.clarityIndex < 40) {
    strategies.add(InterventionStrategy.CognitiveRestructuring);
    strategies.add(InterventionStrategy.Mindfulness);
  }
  if (metrics.sleepLatencyRisk > 50) {
    strategies.add(InterventionStrategy.DigitalDetox);
    strategies.add(InterventionStrategy.PhysicalActivity);
    strategies.add(InterventionStrategy.Mindfulness);
  }

  // Specific recommendations based on causal inputs
  if (inputs.rootWound === RootWound.AnxiousAttachment || inputs.rootWound === RootWound.InvalidationFear) {
    strategies.add(InterventionStrategy.SelfCompassion);
    strategies.add(InterventionStrategy.BoundarySetting);
  }
  if (inputs.cognitiveBias === CognitiveBias.Catastrophizing || inputs.cognitiveBias === CognitiveBias.MindReading) {
    strategies.add(InterventionStrategy.CognitiveRestructuring);
  }
  if (inputs.somaticCompulsion === SomaticCompulsion.InfiniteScrolling || inputs.somaticCompulsion === SomaticCompulsion.LastSeenChecking) {
    strategies.add(InterventionStrategy.DigitalDetox);
  }
  if (inputs.feedbackLoop === FeedbackLoop.Insomnia || inputs.feedbackLoop === FeedbackLoop.NightCortisol) {
    strategies.add(InterventionStrategy.DigitalDetox);
    strategies.add(InterventionStrategy.PhysicalActivity);
  }

  // Add a general recommendation if no specific high-risk factors are present but user is logging
  if (strategies.size === 0) {
    strategies.add(InterventionStrategy.Mindfulness);
    strategies.add(InterventionStrategy.SelfCompassion);
  }

  return Array.from(strategies);
};


export const calculateMetrics = (inputs: CausalInputs): MentalMetrics => {
  let clarityIndex = 100;
  let loopIntensity = 0;
  let coupleFriction = 0;
  let sleepLatencyRisk = 0;

  const layers = [
    { type: 'rootWound', value: inputs.rootWound },
    { type: 'triggerEvent', value: inputs.triggerEvent },
    { type: 'cognitiveBias', value: inputs.cognitiveBias },
    { type: 'somaticCompulsion', value: inputs.somaticCompulsion },
    { type: 'feedbackLoop', value: inputs.feedbackLoop },
  ] as const;

  for (const layer of layers) {
    // The type assertion is safe because our CausalInputs type matches the keys of `weights`
    const layerWeights = weights[layer.type][layer.value as keyof typeof weights[typeof layer.type]];
    if (layerWeights) {
      loopIntensity += layerWeights.loopIntensity || 0;
      coupleFriction += layerWeights.coupleFriction || 0;
      clarityIndex += layerWeights.clarity || 0;
      sleepLatencyRisk += layerWeights.sleepLatencyRisk || 0;
    }
  }

  // Interaction Effects for more realistic scoring
  // Example 1: Anxious attachment combined with a seen message without reply significantly increases couple friction.
  if (inputs.rootWound === RootWound.AnxiousAttachment && inputs.triggerEvent === TriggerEvent.SeenMessageNoReply) {
    coupleFriction += 15;
  }

  // Example 2: Hypervigilance combined with an unexpected notification spikes loop intensity.
  if (inputs.rootWound === RootWound.TraumaticHypervigilance && inputs.triggerEvent === TriggerEvent.UnexpectedNotification) {
    loopIntensity += 20;
  }

  // Example 3: Catastrophizing during the night significantly impacts sleep.
  if (inputs.cognitiveBias === CognitiveBias.Catastrophizing && inputs.feedbackLoop === FeedbackLoop.NightCortisol) {
    sleepLatencyRisk += 25;
  }

  // Example 4: Emotional reasoning leading to impulsive messaging creates high friction.
  if (inputs.cognitiveBias === CognitiveBias.EmotionalReasoning && inputs.somaticCompulsion === SomaticCompulsion.ImpulsiveMessaging) {
    coupleFriction += 20;
  }

  // Example 5: Fear of invalidation combined with a cold tone crushes mental clarity.
  if (inputs.rootWound === RootWound.InvalidationFear && inputs.triggerEvent === TriggerEvent.ColdTone) {
    clarityIndex -= 20;
  }

  // Clamp values to 0-100 range
  const clampedMetrics = {
    clarityIndex: Math.max(0, Math.min(100, clarityIndex)),
    loopIntensity: Math.max(0, Math.min(100, loopIntensity)),
    coupleFriction: Math.max(0, Math.min(100, coupleFriction)),
    sleepLatencyRisk: Math.max(0, Math.min(100, sleepLatencyRisk)),
  };

  const interventionStrategies = recommendInterventionStrategies(inputs, clampedMetrics);

  return {
    ...clampedMetrics,
    interventionStrategies,
  };
};
