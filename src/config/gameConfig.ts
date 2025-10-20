import { LevelConfig } from '../types/game';

export const levelConfig: LevelConfig[] = [
  { level: 1, grid: 2, pairs: 2 },
  { level: 2, grid: 4, pairs: 4 },
  { level: 3, grid: 4, pairs: 6 },
  { level: 4, grid: 4, pairs: 8 },
  { level: 5, grid: 4, pairs: 12 },
];

export const getCurrentLevelConfig = (currentLevel: number): LevelConfig => {
  return levelConfig.find(config => config.level === currentLevel) || levelConfig[0];
};

export const generateCards = (currentLevel: number): number[] => {
  const config = getCurrentLevelConfig(currentLevel);
  const pairs = Array.from({ length: config.pairs }, (_, i) => i + 1);
  const cardPairs = [...pairs, ...pairs];
  return cardPairs.sort(() => Math.random() - 0.5);
};
