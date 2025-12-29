import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import { generateCards, getCurrentLevelConfig } from '@/config/gameConfig';
import { SafeAreaView } from '@/components/SafeAreaView';
import { GetImgsService } from '@/api/getImgs';
import { Card } from '@/types/game';
import './index.scss';

const GamePage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const PREVIEW_DURATION_MS = 3000; // 开局预览时长

  const config = getCurrentLevelConfig(currentLevel);
  const gridSize = `grid-cols-${config.grid}`;

  const onCardClick = (index: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      // 使用 pairId 来判断是否匹配
      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setScore(score + 10);
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
      // 根据关卡配置的 pairs 数量获取图片
      const images = await GetImgsService.getImgs(config.pairs);
      // 打乱图片顺序
      images.sort(() => Math.random() - 0.5);
      // 使用获取的图片生成卡片
      const newCards = generateCards(images);
      setCurrentLevel(level);
      setCards(newCards);
      // 预览：先全部翻开
      setFlippedCards(newCards.map((_, index) => index));
      setMatchedCards([]);
      setScore(0);
      setTimeLeft(20);
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
    initGame(1); // 初始化第1关
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && matchedCards.length < cards.length) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 || matchedCards.length === cards.length) {
      // setGameStarted(false);
      // setIsGameOver(true);
      if (matchedCards.length === cards.length) {
        if (currentLevel < 10) {
          const nextLevel = currentLevel + 1;
          // 进入下一关，加载新的图片
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
      // if (scoreList.length > 10) {
      //   scoreList.pop(); // 如果历史记录超过10条，则删除最后一条
      // }
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
      <View className="game-container">
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
        <View className={`grid ${gridSize}`}>
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
                <View className={`card-front ${isFlipped ? '' : 'hidden'}`}>
                  <Image 
                    src={card.imageUrl} 
                    mode="aspectFill"
                    className="card-image"
                  />
                </View>
              </View>
            );
          })}
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
