import {
  RootWound,
  TriggerEvent,
  CognitiveBias,
  SomaticCompulsion,
  FeedbackLoop,
  MentalMetrics,
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

type CausalInputs = {
  rootWound: RootWound;
  triggerEvent: TriggerEvent;
  cognitiveBias: CognitiveBias;
  somaticCompulsion: SomaticCompulsion;
  feedbackLoop: FeedbackLoop;
};

export const calculateMentalMetrics = (inputs: CausalInputs): MentalMetrics => {
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

  // Clamp values to 0-100 range
  return {
    clarityIndex: Math.max(0, Math.min(100, clarityIndex)),
    loopIntensity: Math.max(0, Math.min(100, loopIntensity)),
    coupleFriction: Math.max(0, Math.min(100, coupleFriction)),
    sleepLatencyRisk: Math.max(0, Math.min(100, sleepLatencyRisk)),
  };
};
