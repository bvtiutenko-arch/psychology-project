import {
  CausalInputs,
  MentalMetrics,
  InterventionStrategy,
  RootWound,
  TriggerEvent,
  CognitiveBias,
  SomaticCompulsion,
  FeedbackLoop,
} from '../types/causal';

/**
 * Deterministically calculates MentalMetrics and InterventionStrategies based on CausalInputs.
 * This function embodies the "pattern engine" with rule-based logic (no AI).
 *
 * @param inputs The CausalInputs provided by the user.
 * @returns An object containing calculated MentalMetrics and a list of InterventionStrategy.
 */
export function calculateCausalMatrixMetrics(inputs: CausalInputs): {
  metrics: Omit<MentalMetrics, 'interventionStrategies'>;
  strategies: InterventionStrategy[];
} {
  // Placeholder for deterministic rule-based logic.
  // In a real scenario, this would involve complex mappings and scoring
  // based on the combination of rootWound, triggerEvent, cognitiveBias, etc.

  let clarityIndex = 0;
  let loopIntensity = 0;
  let coupleFriction = 0;
  let sleepLatencyRisk = 0;
  const strategies: InterventionStrategy[] = [];

  // Example placeholder logic:
  // This is where the "NO AI INSIDE" rule is strictly applied.
  // All calculations are based on predefined, deterministic rules.

  // Rule 1: If RootWound is AnxiousAttachment, increase loop intensity and suggest SelfCompassion.
  if (inputs.rootWound === RootWound.AnxiousAttachment) {
    loopIntensity += 30;
    strategies.push(InterventionStrategy.SelfCompassion);
    coupleFriction += 20;
  }

  // Rule 2: If TriggerEvent is SeenMessageNoReply, increase sleep latency risk and suggest DigitalDetox.
  if (inputs.triggerEvent === TriggerEvent.SeenMessageNoReply) {
    sleepLatencyRisk += 40;
    strategies.push(InterventionStrategy.DigitalDetox);
  }

  // Rule 3: If CognitiveBias is Catastrophizing, increase clarity index slightly and suggest CognitiveRestructuring.
  if (inputs.cognitiveBias === CognitiveBias.Catastrophizing) {
    clarityIndex += 10; // Catastrophizing often means some awareness, but misdirected
    strategies.push(InterventionStrategy.CognitiveRestructuring);
  }

  // Rule 4: If SomaticCompulsion is InfiniteScrolling, suggest Mindfulness.
  if (inputs.somaticCompulsion === SomaticCompulsion.InfiniteScrolling) {
    strategies.push(InterventionStrategy.Mindfulness);
  }

  // Rule 5: If FeedbackLoop includes Insomnia, increase sleep latency risk significantly.
  if (inputs.feedbackLoop === FeedbackLoop.Insomnia) {
    sleepLatencyRisk += 50;
    strategies.push(InterventionStrategy.PhysicalActivity); // Suggest physical activity for sleep
  }

  // Ensure values are within 0-100% range
  clarityIndex = Math.max(0, Math.min(100, clarityIndex + 20)); // Base clarity
  loopIntensity = Math.max(0, Math.min(100, loopIntensity));
  coupleFriction = Math.max(0, Math.min(100, coupleFriction));
  sleepLatencyRisk = Math.max(0, Math.min(100, sleepLatencyRisk));

  // Remove duplicate strategies
  const uniqueStrategies = Array.from(new Set(strategies));

  const metrics: Omit<MentalMetrics, 'interventionStrategies'> = {
    clarityIndex,
    loopIntensity,
    coupleFriction,
    sleepLatencyRisk,
  };

  return { metrics, strategies: uniqueStrategies };
}
