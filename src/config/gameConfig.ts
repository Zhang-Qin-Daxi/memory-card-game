import { LevelConfig, Card } from '../types/game';
import { ImageData } from '../api/getImgs';

export const getCurrentLevelConfig = (currentLevel: number): LevelConfig => {
  // 第一关15对，后续每一关增加4对
  if (currentLevel === 1) {
    return { level: 1, grid: 4, pairs: 6 };
  } else {
    return { level: currentLevel, grid: 4, pairs: 6 + (currentLevel - 1) * 4 };
  } 
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
