import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { generateCards, getCurrentLevelConfig, levelConfig } from '@/config/gameConfig';
import { SafeAreaView } from '@/components/SafeAreaView';
import './index.scss';

const GamePage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [cards, setCards] = useState<number[]>([]);
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
      if (cards[firstIndex] === cards[secondIndex]) {
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

  const initGame = () => {
    const level = 1;
    const newCards = generateCards(level);
    setCurrentLevel(level);
    setCards(newCards);
    // 预览：先全部翻开
    setFlippedCards(newCards.map((_, index) => index));
    setMatchedCards([]);
    setScore(0);
    setTimeLeft(60);
    setGameStarted(false);
    setIsGameOver(false);
    // 若干秒后自动盖回并开始计时
    setTimeout(() => {
      setFlippedCards([]);
      setGameStarted(true);
    }, PREVIEW_DURATION_MS);
  };

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
        if (currentLevel < levelConfig.length) {
          const nextLevel = currentLevel + 1;
          const nextCards = generateCards(nextLevel);
          setCurrentLevel(nextLevel);
          setCards(nextCards);
          // 下一关开始时预览所有卡片
          setFlippedCards(nextCards.map((_, index) => index));
          setMatchedCards([]);
          setTimeLeft(60);
          setGameStarted(false);
          setIsGameOver(false);
          setTimeout(() => {
            setFlippedCards([]);
            setGameStarted(true);
          }, PREVIEW_DURATION_MS);
        } else {
          alert("Congratulations! You've completed all levels!");
          setIsGameOver(true);
          Taro.navigateTo({ url: '/pages/end/index' });
        }
      }
    }
    // 游戏结束,显示游戏结束页面
    if (isGameOver) {
      const scoreList = Taro.getStorageSync('score')?.split(',') || []; // 获取历史记录
      if (scoreList.length > 10) {
        scoreList.shift(); // 如果历史记录超过10条，则删除最早的一条
      }
      Taro.setStorageSync('score', scoreList.join(',')); // 将历史记录存储到本地
      initGame(); // 重新开始游戏 并设置当前页面为结束页面
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
                key={index}
                onClick={() => onCardClick(index)}
                className={`card ${isFlipped ? 'flipped' : ''}`}
              >
                <View className={`card-back ${isFlipped ? 'hidden' : ''}`}>
                  <Text>?</Text>
                </View>
                <View className={`card-front ${isFlipped ? '' : 'hidden'}`}>
                  <Text>{card}</Text>
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
