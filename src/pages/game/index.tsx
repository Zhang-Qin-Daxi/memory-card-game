import Taro from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import { generateCards, getCurrentLevelConfig } from '@/config/gameConfig';
import { SafeAreaView } from '@/components/SafeAreaView';
import { GetImgsService } from '@/api/getImgs';
import { Card } from '@/types/game';
import './index.scss';
import { NavBar } from '@/components/NavBar';

const GamePage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const PREVIEW_DURATION_MS = 3000; // 开局预览时长
  const MAX_LEVEL = 10;

  // 缓存下一关的图片数据，避免在关卡切换时再次等待网络
  const [cachedNext, setCachedNext] = useState<{ level: number; images: any[] } | null>(null);

  const gridSize = useMemo(() => {
    const cfg = getCurrentLevelConfig(currentLevel);
    return `grid-cols-${cfg.grid}`;
  }, [currentLevel]);

  const onCardClick = (index: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      // 使用 pairId 来判断是否匹配
      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setScore((s) => s + 10);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const onReturnHome = () => {
    Taro.navigateTo({ url: '/pages/index/index' });
  };

  const onRestartGame = () => {
    Taro.navigateTo({ url: '/pages/game/index' });
  };

  const initGame = async (level: number) => {
    try {
      const config = getCurrentLevelConfig(level);
      setLoading(true);
      // 使用缓存图片（如果已有）或根据关卡配置的 pairs 数量获取图片
      let images = [] as any[];
      if (cachedNext && cachedNext.level === level) {
        images = cachedNext.images;
        setCachedNext(null);
      } else {
        images = await GetImgsService.getImgs(config.pairs);
      }
      // 打乱图片顺序
      images.sort(() => Math.random() - 0.5);
      // 使用获取的图片生成卡片
      const newCards = generateCards(images);
      setCurrentLevel(level);
      setCards(newCards);
      // 预加载图片资源，确保图片都加载完成再开始预览/游戏
      const preloadImages = (imgs: any[]) => {
        return Promise.all(
          imgs.map(
            (img: any) =>
              new Promise((resolve) => {
                let resolved = false;
                const done = () => {
                  if (!resolved) {
                    resolved = true;
                    resolve(true);
                  }
                };
                try {
                  if (typeof window !== 'undefined' && typeof (window as any).Image === 'function') {
                    const image = new (window as any).Image();
                    image.src = img.image;
                    image.onload = () => done();
                    image.onerror = () => done();
                    // 超时保护
                    setTimeout(() => done(), 5000);
                    return;
                  }
                } catch (e) {
                  // continue to fallback
                }
                // 小程序或非浏览器环境回退到 Taro.getImageInfo
                if (Taro && typeof Taro.getImageInfo === 'function') {
                  Taro.getImageInfo({
                    src: img.image,
                    success: () => done(),
                    fail: () => done(),
                  });
                  // 超时保护
                  setTimeout(() => done(), 5000);
                } else {
                  // 最后兜底
                  setTimeout(() => done(), 0);
                }
              })
          )
        );
      };
      await preloadImages(images);
      setLoading(false);
      // 预览：先全部翻开
      setFlippedCards(newCards.map((_, index) => index));
      setMatchedCards([]);
      setScore(0);
      setTimeLeft(30);
      setGameStarted(false);
      setIsGameOver(false);
      // 若干秒后自动盖回并开始计时
      setTimeout(() => {
        setFlippedCards([]);
        setGameStarted(true);
      }, PREVIEW_DURATION_MS);
    } catch (error) {
      console.error('初始化游戏失败:', error);
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // 游戏进行中，且时间未到0，且未匹配完所有卡片
    if (gameStarted && timeLeft > 0 && matchedCards.length < cards.length) {
      timer = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 || matchedCards.length === cards.length) {
      // setGameStarted(false);
      // setIsGameOver(true);
      if (matchedCards.length === cards.length) {
        if (currentLevel < 10) {
          const nextLevel = currentLevel + 1;
          // 进入下一关，加载新的图片（若已有缓存则使用缓存）
          initGame(nextLevel);
        } else {
          // alert("Congratulations! You've completed all levels!");
          Taro.showToast({
            title: 'Congratulations! You\'ve completed all levels!',
            icon: 'success',
          });
          setIsGameOver(true);
          // Taro.navigateTo({ url: '/pages/end/index' });
        }
      }
    }
    // 当快完成当前关卡时，预加载下一关的图片到缓存
    if (
      currentLevel < MAX_LEVEL &&
      cards.length > 0 &&
      matchedCards.length >= cards.length - 2 &&
      (!cachedNext || cachedNext.level !== currentLevel + 1)
    ) {
      const nextLevel = currentLevel + 1;
      const nextConfig = getCurrentLevelConfig(nextLevel);
      // 异步预取但不阻塞当前渲染
      GetImgsService.getImgs(nextConfig.pairs)
        .then((images) => {
          setCachedNext({ level: nextLevel, images });
        })
        .catch(() => {
          // 预加载失败时无需处理，下一关会重新请求
        });
    }
    // 游戏结束,显示游戏结束页面
    if (isGameOver || timeLeft === 0) {
      let scoreList: any[] = [];
      try {
        const stored = Taro.getStorageSync('score');
        // 确保 scoreList 是数组
        scoreList = Array.isArray(stored) ? stored : [];
      } catch {
        scoreList = [];
      }
      // 存储历史记录 时间 得分
      const scoreData = {
        time: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0], // 年月日 时分秒 如 2025-11-06 10:00:00
        score: score,
      };
      scoreList.unshift(scoreData); // 将当前得分添加到历史记录中
      Taro.setStorageSync('score', scoreList);
      Taro.navigateTo({ url: '/pages/end/index' });
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, matchedCards.length, cards.length, currentLevel, isGameOver]);

  return (
    <SafeAreaView>
      <NavBar title="记忆翻牌游戏" showBack />
      <View className="game-container">
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : null}
        <View className="info-bar">
          <View className="info-item">
            <Text className="info-item-label">关卡</Text>
            <Text className="info-item-value">{currentLevel}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item-label">得分</Text>
            <Text className="info-item-value">{score}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item-label">时间</Text>
            <Text className={`${timeLeft <= 10 ? 'time-left-red' : 'info-item-value'}`}>
              {timeLeft}s
            </Text>
          </View>
        </View>
        <View className={`grid ${gridSize}`} style={{ display: loading ? 'none' : undefined }}>
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            return (
              <View
                key={card.id}
                onClick={() => onCardClick(index)}
                className={`card ${isFlipped ? 'flipped' : ''}`}
              >
                <View className={`card-back ${isFlipped ? 'hidden' : ''}`}>
                  {/* <Text>?</Text> */}
                </View>
              </View>
              );
            })
          }
        </View>
        <View className="controls">
          <Button onClick={onReturnHome} className="return-home-button">主页</Button>
          <Button onClick={onRestartGame} className="restart-game-button">重新开始</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GamePage;
