export type CausalMatrixData = CausalInputs & Omit<MentalMetrics, 'interventionStrategies'> & {
  userId: string;
  interventionStrategies: InterventionStrategy[];
  timestamp: FieldValue;
};
