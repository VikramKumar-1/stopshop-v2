/**
 * Utility to convert weight specifications dynamically.
 * Automatically appends Imperial (Lbs) / Metric (Kg) equivalents for international buyers.
 */
export function convertWeightInSpecs(specs: string): string {
  if (!specs) return "";
  
  // Regex to match weight patterns: e.g. "1.5 Kg", "500 Gm", "2 Lbs", "1 Ton" (case-insensitive)
  return specs.replace(/(\d+(?:\.\d+)?)\s*(Kg|Gm|Lbs|Ton)/gi, (match, valStr, unit) => {
    const value = parseFloat(valStr);
    if (isNaN(value)) return match;
    
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit === "kg") {
      const lbs = (value * 2.20462).toFixed(1);
      return `${value} Kg (${lbs} Lbs)`;
    } else if (lowerUnit === "gm") {
      const lbs = (value * 0.00220462).toFixed(1);
      return `${value} Gm (${lbs} Lbs)`;
    } else if (lowerUnit === "lbs") {
      const kg = (value * 0.453592).toFixed(1);
      return `${value} Lbs (${kg} Kg)`;
    } else if (lowerUnit === "ton") {
      const lbs = (value * 2204.62).toFixed(0);
      const kg = (value * 1000).toFixed(0);
      return `${value} Ton (${kg} Kg / ${lbs} Lbs)`;
    }
    return match;
  });
}
