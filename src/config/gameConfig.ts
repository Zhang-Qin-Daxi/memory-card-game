import { LevelConfig, Card } from '../types/game';
import { ImageData } from '../api/getImgs';

export const levelConfig: LevelConfig[] = [
  { level: 1, grid: 2, pairs: 2 },
  { level: 2, grid: 4, pairs: 4 },
  // { level: 3, grid: 4, pairs: 6 },
  // { level: 4, grid: 4, pairs: 8 },
  // { level: 5, grid: 4, pairs: 12 },
];

export const getCurrentLevelConfig = (currentLevel: number): LevelConfig => {
  return levelConfig.find(config => config.level === currentLevel) || levelConfig[0];
};

// 使用图片数据生成卡片
export const generateCards = (images: ImageData[]): Card[] => {
  // 为每个图片创建一对卡片
  const cards: Card[] = [];
  images.forEach((image, index) => {
    // 创建第一张卡片
    cards.push({
      id: index * 2,
      imageUrl: image.image,
      pairId: index,
    });
    // 创建配对的第二张卡片
    cards.push({
      id: index * 2 + 1,
      imageUrl: image.image,
      pairId: index,
    });
  });
  // 随机打乱卡片顺序
  return cards.sort(() => Math.random() - 0.5);
};
