import { Recipe } from '../types';
import { HIGH_PERF_PUPPIES_JUNIOR } from './recipesHighPerformancePuppiesJunior';
import { HIGH_PERF_ADULTS_SENIORS } from './recipesHighPerformanceAdultsSeniors';

export const HIGH_PERFORMANCE_DOG_RECIPES: Recipe[] = [
  ...HIGH_PERF_PUPPIES_JUNIOR,
  ...HIGH_PERF_ADULTS_SENIORS,
];
