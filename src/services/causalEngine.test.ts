import { describe, it, expect } from 'vitest';
import { calculateCausalMatrixMetrics } from './causalEngine';
import { 
  CausalInputs, 
  RootWound, 
  TriggerEvent, 
  CognitiveBias, 
  SomaticCompulsion, 
  FeedbackLoop, 
  Emotion, 
  InterventionStrategy 
} from '../types/causal';

const baseInputs: CausalInputs = {
  rootWound: RootWound.AnxiousAttachment,
  triggerEvent: TriggerEvent.SeenMessageNoReply,
  cognitiveBias: CognitiveBias.MindReading,
  somaticCompulsion: SomaticCompulsion.LastSeenChecking,
  feedbackLoop: FeedbackLoop.SelfEsteemDrop,
  emotion: Emotion.Anxiety,
  intensity: 3,
};

describe('calculateCausalMatrixMetrics', () => {
  // Test 1: Basic calculation
  it('should calculate metrics correctly for base inputs', () => {
    const { metrics } = calculateCausalMatrixMetrics(baseInputs);
    // Manual calculation:
    // clarityIndex: 100 - 10 (rootWound) - 15 (trigger) - 25 (bias) - 0 (somatic) - 20 (feedback) - 10 (emotion) = 20
    // loopIntensity: 20 (rootWound) + 25 (trigger) + 20 (bias) + 25 (somatic) + 10 (feedback) + 20 (emotion) + 10 (intensityFactor) = 130 -> clamped to 100
    // coupleFriction: 25 (rootWound) + 20 (trigger) + 20 (bias) + 10 (somatic) + 0 (feedback) + 0 (emotion) + 15 (interaction) = 90
    // sleepLatencyRisk: 0 (rootWound) + 0 (trigger) + 0 (bias) + 0 (somatic) + 0 (feedback) + 10 (emotion) + 5 (intensityFactor/2) = 15
    expect(metrics.clarityIndex).toBe(20);
    expect(metrics.loopIntensity).toBe(100);
    expect(metrics.coupleFriction).toBe(90);
    expect(metrics.sleepLatencyRisk).toBe(15);
  });

  // Test 2: Intensity factor
  it('should increase loop intensity and sleep risk based on intensity', () => {
    const lowIntensityInputs = { ...baseInputs, intensity: 1 };
    const highIntensityInputs = { ...baseInputs, intensity: 5 };
    
    const lowResult = calculateCausalMatrixMetrics(lowIntensityInputs);
    const highResult = calculateCausalMatrixMetrics(highIntensityInputs);

    // intensityFactor = (intensity - 1) * 5
    // low: 0, high: 20
    // loopIntensity diff: 20
    // sleepLatencyRisk diff: 10
    expect(highResult.metrics.loopIntensity).toBeGreaterThan(lowResult.metrics.loopIntensity);
    expect(highResult.metrics.sleepLatencyRisk).toBeGreaterThan(lowResult.metrics.sleepLatencyRisk);
    
    // Check specific values using a lower base to avoid clamping
    const lowRiskInputs: CausalInputs = {
      rootWound: RootWound.ProtectivePerfectionism,
      triggerEvent: TriggerEvent.UnexpectedNotification,
      cognitiveBias: CognitiveBias.AllOrNothing,
      somaticCompulsion: SomaticCompulsion.PhysicalTension,
      feedbackLoop: FeedbackLoop.BrainFog,
      emotion: Emotion.Calm,
      intensity: 1,
    };
    const lowRiskResult = calculateCausalMatrixMetrics(lowRiskInputs);
    const highRiskInputs = { ...lowRiskInputs, intensity: 5 };
    const highRiskResult = calculateCausalMatrixMetrics(highRiskInputs);
    
    // Base loopIntensity (intensity 1): 10 + 10 + 10 + 5 + 0 - 15 = 20
    // High (intensity 5): 20 + 20 = 40
    expect(lowRiskResult.metrics.loopIntensity).toBe(20);
    expect(highRiskResult.metrics.loopIntensity).toBe(40);
  });

  // Test 3: Interaction effects
  it('should apply interaction effects correctly', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.AnxiousAttachment,
      triggerEvent: TriggerEvent.SeenMessageNoReply,
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // coupleFriction should include +15 for this interaction
    // Base coupleFriction (without interaction): 25 + 20 + 20 + 10 + 0 + 0 = 75
    // With interaction: 75 + 15 = 90
    expect(metrics.coupleFriction).toBe(90);
  });

  // Test 4: Clamping values
  it('should clamp values to 0-100 range', () => {
    const extremeInputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.TraumaticHypervigilance,
      triggerEvent: TriggerEvent.SeenMessageNoReply,
      cognitiveBias: CognitiveBias.Catastrophizing,
      somaticCompulsion: SomaticCompulsion.ImpulsiveMessaging,
      feedbackLoop: FeedbackLoop.Insomnia,
      emotion: Emotion.Anxiety,
      intensity: 5,
    };
    const { metrics } = calculateCausalMatrixMetrics(extremeInputs);
    expect(metrics.loopIntensity).toBeLessThanOrEqual(100);
    expect(metrics.coupleFriction).toBeLessThanOrEqual(100);
    expect(metrics.sleepLatencyRisk).toBeLessThanOrEqual(100);
    expect(metrics.clarityIndex).toBeGreaterThanOrEqual(0);
  });

  // Test 5: Strategy recommendation - high loop intensity
  it('should recommend Mindfulness and CognitiveRestructuring for high loop intensity', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.TraumaticHypervigilance,
      triggerEvent: TriggerEvent.UnexpectedNotification,
      cognitiveBias: CognitiveBias.Catastrophizing,
      somaticCompulsion: SomaticCompulsion.InfiniteScrolling,
      feedbackLoop: FeedbackLoop.NightCortisol,
      emotion: Emotion.Uncertainty,
      intensity: 5,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.Mindfulness);
    expect(strategies).toContain(InterventionStrategy.CognitiveRestructuring);
  });

  // Test 6: Strategy recommendation - high couple friction
  it('should recommend BoundarySetting and ProfessionalHelp for high couple friction', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.AnxiousAttachment,
      triggerEvent: TriggerEvent.ColdTone,
      cognitiveBias: CognitiveBias.EmotionalReasoning,
      somaticCompulsion: SomaticCompulsion.ImpulsiveMessaging,
      feedbackLoop: FeedbackLoop.RelationshipExhaustion,
      emotion: Emotion.Anger,
      intensity: 5,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.BoundarySetting);
    expect(strategies).toContain(InterventionStrategy.ProfessionalHelp);
  });

  // Test 7: Strategy recommendation - low clarity
  it('should recommend CognitiveRestructuring and Mindfulness for low clarity', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.InvalidationFear,
      triggerEvent: TriggerEvent.ColdTone,
      cognitiveBias: CognitiveBias.Catastrophizing,
      somaticCompulsion: SomaticCompulsion.PhysicalTension,
      feedbackLoop: FeedbackLoop.BrainFog,
      emotion: Emotion.Shame,
      intensity: 3,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.CognitiveRestructuring);
    expect(strategies).toContain(InterventionStrategy.Mindfulness);
  });

  // Test 8: Strategy recommendation - high sleep latency risk
  it('should recommend DigitalDetox, PhysicalActivity, and Mindfulness for high sleep latency risk', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      rootWound: RootWound.TraumaticHypervigilance,
      triggerEvent: TriggerEvent.NightSilence,
      cognitiveBias: CognitiveBias.Catastrophizing,
      somaticCompulsion: SomaticCompulsion.InfiniteScrolling,
      feedbackLoop: FeedbackLoop.Insomnia,
      emotion: Emotion.Fear,
      intensity: 5,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.DigitalDetox);
    expect(strategies).toContain(InterventionStrategy.PhysicalActivity);
    expect(strategies).toContain(InterventionStrategy.Mindfulness);
  });

  // Test 9: Strategy recommendation - specific inputs (Catastrophizing)
  it('should recommend CognitiveRestructuring for Catastrophizing', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      cognitiveBias: CognitiveBias.Catastrophizing,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.CognitiveRestructuring);
  });

  // Test 10: Strategy recommendation - specific inputs (InfiniteScrolling)
  it('should recommend DigitalDetox for InfiniteScrolling', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      somaticCompulsion: SomaticCompulsion.InfiniteScrolling,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.DigitalDetox);
  });

  // Test 11: Strategy recommendation - specific inputs (Insomnia)
  it('should recommend DigitalDetox and PhysicalActivity for Insomnia', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      feedbackLoop: FeedbackLoop.Insomnia,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.DigitalDetox);
    expect(strategies).toContain(InterventionStrategy.PhysicalActivity);
  });

  // Test 12: Strategy recommendation - emotion (Anxiety)
  it('should recommend Mindfulness for Anxiety', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      emotion: Emotion.Anxiety,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.Mindfulness);
  });

  // Test 13: Strategy recommendation - emotion (Anger)
  it('should recommend PhysicalActivity for Anger', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      emotion: Emotion.Anger,
    };
    const { strategies } = calculateCausalMatrixMetrics(inputs);
    expect(strategies).toContain(InterventionStrategy.PhysicalActivity);
  });

  // Test 14: Default strategies
  it('should recommend Mindfulness and SelfCompassion if no specific high-risk factors', () => {
    const neutralInputs: CausalInputs = {
      rootWound: RootWound.ProtectivePerfectionism,
      triggerEvent: TriggerEvent.UnexpectedNotification,
      cognitiveBias: CognitiveBias.AllOrNothing,
      somaticCompulsion: SomaticCompulsion.PhysicalTension,
      feedbackLoop: FeedbackLoop.BrainFog,
      emotion: Emotion.Sadness,
      intensity: 1,
    };
    const neutralStrategies = calculateCausalMatrixMetrics(neutralInputs).strategies;
    expect(neutralStrategies).toContain(InterventionStrategy.Mindfulness);
    expect(neutralStrategies).toContain(InterventionStrategy.SelfCompassion);
  });

  // Test 15: Emotion weights (Calm)
  it('should reduce loop intensity and increase clarity for Calm emotion', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      emotion: Emotion.Calm,
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // Base loopIntensity (Anxiety): 130 -> 100
    // Calm loopIntensity: 130 - 20 (Anxiety) - 15 (Calm) = 95
    // Base clarity (Anxiety): 20
    // Calm clarity: 20 + 10 (Anxiety) + 25 (Calm) = 55
    expect(metrics.loopIntensity).toBe(95);
    expect(metrics.clarityIndex).toBe(55);
  });

  // Test 16: Emotion weights (Hope)
  it('should reduce loop intensity and increase clarity for Hope emotion', () => {
    const lowInputs: CausalInputs = {
      rootWound: RootWound.ProtectivePerfectionism,
      triggerEvent: TriggerEvent.UnexpectedNotification,
      cognitiveBias: CognitiveBias.AllOrNothing,
      somaticCompulsion: SomaticCompulsion.PhysicalTension,
      feedbackLoop: FeedbackLoop.BrainFog,
      emotion: Emotion.Hope,
      intensity: 1,
    };
    const lowMetrics = calculateCausalMatrixMetrics(lowInputs).metrics;
    // Base loopIntensity (Sadness): 10 + 10 + 10 + 5 + 0 + 10 = 45
    // Hope loopIntensity: 45 - 10 (Sadness) - 10 (Hope) = 25
    expect(lowMetrics.loopIntensity).toBe(25);
  });

  // Test 17: Trigger event weights (NightSilence)
  it('should increase sleep latency risk for NightSilence trigger', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      triggerEvent: TriggerEvent.NightSilence,
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // Base sleepLatencyRisk (SeenMessageNoReply): 15
    // NightSilence sleepLatencyRisk: 15 - 0 (SeenMessage) + 20 (NightSilence) = 35
    expect(metrics.sleepLatencyRisk).toBe(35);
  });

  // Test 18: Cognitive bias weights (EmotionalReasoning)
  it('should increase couple friction for EmotionalReasoning bias', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      cognitiveBias: CognitiveBias.EmotionalReasoning,
      somaticCompulsion: SomaticCompulsion.ImpulsiveMessaging, // to trigger interaction
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // Base coupleFriction (MindReading, LastSeenChecking): 90
    // EmotionalReasoning, ImpulsiveMessaging:
    // rootWound: 25, trigger: 20, bias: 15, somatic: 30, feedback: 0, emotion: 0 = 90
    // Interaction: +20
    // Total: 110 -> 100
    expect(metrics.coupleFriction).toBe(100);
  });

  // Test 19: Somatic compulsion weights (PhysicalTension)
  it('should increase sleep latency risk for PhysicalTension compulsion', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      somaticCompulsion: SomaticCompulsion.PhysicalTension,
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // Base sleepLatencyRisk (LastSeenChecking): 15
    // PhysicalTension sleepLatencyRisk: 15 - 0 (LastSeen) + 10 (PhysicalTension) = 25
    expect(metrics.sleepLatencyRisk).toBe(25);
  });

  // Test 20: Feedback loop weights (RelationshipExhaustion)
  it('should increase couple friction for RelationshipExhaustion feedback loop', () => {
    const inputs: CausalInputs = {
      ...baseInputs,
      feedbackLoop: FeedbackLoop.RelationshipExhaustion,
    };
    const { metrics } = calculateCausalMatrixMetrics(inputs);
    // Base coupleFriction (SelfEsteemDrop): 90
    // RelationshipExhaustion coupleFriction: 90 - 0 (SelfEsteemDrop) + 30 (RelationshipExhaustion) = 120 -> 100
    expect(metrics.coupleFriction).toBe(100);
  });
});
