/**
 * Determines the appropriate Tailwind CSS color classes based on a metric's value.
 *
 * @param value The metric value (0-100).
 * @param reverseColors If true, lower values are "good" (green), higher values are "bad" (red).
 *                      If false, higher values are "good" (green), lower values are "bad" (red).
 * @returns An object containing `text` and `bg` color class strings.
 */
export const getMetricColorClass = (value: number, reverseColors: boolean = false): { text: string; bg: string } => {
  let textColor: string;
  let bgColor: string;

  // Define thresholds for colors as constants for better readability and maintainability
  const HIGH_THRESHOLD = 70; // e.g., >70 is good
  const MEDIUM_THRESHOLD = 40; // e.g., 40-70 is moderate

  if (reverseColors) { // For metrics where lower is better (e.g., loopIntensity, coupleFriction, sleepLatencyRisk)
    if (value <= MEDIUM_THRESHOLD) { // Low value is good
      textColor = 'text-green-500';
      bgColor = 'bg-green-500';
    } else if (value <= HIGH_THRESHOLD) { // Medium value is moderate
      textColor = 'text-yellow-500';
      bgColor = 'bg-yellow-500';
    } else { // High value is bad
      textColor = 'text-red-500';
      bgColor = 'bg-red-500';
    }
  } else { // For metrics where higher is better (e.g., clarityIndex)
    if (value >= HIGH_THRESHOLD) { // High value is good
      textColor = 'text-green-500';
      bgColor = 'bg-green-500';
    } else if (value >= MEDIUM_THRESHOLD) { // Medium value is moderate
      textColor = 'text-yellow-500';
      bgColor = 'bg-yellow-500';
    } else { // Low value is bad
      textColor = 'text-red-500';
      bgColor = 'bg-red-500';
    }
  }
  return { text: textColor, bg: bgColor };
};
