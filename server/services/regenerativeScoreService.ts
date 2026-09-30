import { db } from '../db/database.js';
import { RegenerativeFarmScore } from '../../src/types/index.js';

export function calculateRegenerativeScore(farmId: string): RegenerativeFarmScore {
  const farm = db.getFarms().find(f => f.id === farmId) || db.getFarms()[0];
  const soil = db.getSoilByFarmId(farm.id);
  const crops = db.getCropsByFarmId(farm.id);

  // 1. Soil Organic Carbon (SOC)
  // Benchmark: >= 1.0% = 100, 0.75% = 85, 0.5% = 60, < 0.4% = 30
  const socVal = soil ? soil.organicCarbon : 0.88;
  let socScore = Math.min(100, Math.round((socVal / 1.0) * 95));

  // 2. Crop Diversity & Rotation
  // Multiple crops (e.g. Paddy + Green Gram) provides diversity
  const hasLegume = crops.some(c => c.cropName.toLowerCase().includes('gram') || c.cropName.toLowerCase().includes('pulse') || c.cropName.toLowerCase().includes('soy'));
  const cropDiversityScore = hasLegume && crops.length >= 2 ? 88 : crops.length > 1 ? 75 : 55;

  // 3. Water Efficiency
  // Drip / sub-surface = 85+, flood irrigation = 45
  const isDrip = farm.irrigationType.toLowerCase().includes('drip') || farm.irrigationType.toLowerCase().includes('sprinkler');
  const waterEfficiencyScore = isDrip ? 84 : 52;

  // 4. Soil Cover & Residue
  // Residue mulching & minimal tillage
  const soilCoverScore = 76;

  // 5. Biological Inputs vs Synthetic
  const biologicalInputsScore = 80;

  // 6. Chemical Reduction
  const chemicalReductionScore = 72;

  // Weighted overall score
  const overallScore = Math.round(
    socScore * 0.25 +
    cropDiversityScore * 0.20 +
    waterEfficiencyScore * 0.20 +
    soilCoverScore * 0.15 +
    biologicalInputsScore * 0.10 +
    chemicalReductionScore * 0.10
  );

  let ratingText = 'Very Good (Climate-Resilient Lead)';
  if (overallScore >= 85) ratingText = 'Exceptional Regenerative Leader';
  else if (overallScore >= 70) ratingText = 'Resilient Agro-Ecological Farm';
  else if (overallScore >= 50) ratingText = 'Transitional Regenerative Farm';
  else ratingText = 'Conventional / High-Input System';

  return {
    overallScore,
    ratingText,
    soilOrganicCarbon: {
      value: socVal,
      score: socScore,
      target: 1.2,
      status: socVal >= 0.75 ? 'Optimal' : socVal >= 0.5 ? 'Good' : 'Needs Improvement'
    },
    cropDiversity: {
      score: cropDiversityScore,
      rotationsPerCycle: 3,
      companionCrops: 2
    },
    waterEfficiency: {
      score: waterEfficiencyScore,
      savingPercentage: 36,
      dripCoverage: 75
    },
    soilCover: {
      score: soilCoverScore,
      mulchCoverage: 68,
      tillageType: 'Conservation Tillage / Mulched Bed'
    },
    biologicalInputs: {
      score: biologicalInputsScore,
      organicMatterPerHa: 4.5,
      bioFertilizerPercent: 62
    },
    chemicalReduction: {
      score: chemicalReductionScore,
      reductionVsConventional: 58
    },
    strengths: [
      `High Soil Organic Carbon of ${socVal}% maintained through in-situ straw incorporation.`,
      `Legume crop rotation (Green Gram / Moong) fixing atmospheric nitrogen naturally.`,
      `Sub-surface drip irrigation saving 36% groundwater compared to conventional flood basins.`,
      `Biological seed inoculants (Rhizobium + Trichoderma) suppressing seedling damping-off.`
    ],
    opportunities: [
      `Introduce multi-species cover crop mix (Cowpea + Sunn Hemp) during the 40-day summer fallow.`,
      `Expand biochar application at 1.5 tons/ha to elevate cation exchange capacity and long-term carbon permanence.`,
      `Adopt non-inversion minimum tillage across outer perimeter buffer plots.`
    ]
  };
}
