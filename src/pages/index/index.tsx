import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import './index.scss';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'end'>('end');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const levelConfig = [
    { level: 1, grid: 2, pairs: 2 },
    { level: 2, grid: 4, pairs: 4 },
    { level: 3, grid: 4, pairs: 6 },
    { level: 4, grid: 4, pairs: 8 },
    { level: 5, grid: 4, pairs: 12 },
  ];

  const getCurrentLevelConfig = () => {
    return levelConfig.find(config => config.level === currentLevel) || levelConfig[0];
  };

  const generateCards = () => {
    const config = getCurrentLevelConfig();
    const pairs = Array.from({ length: config.pairs }, (_, i) => i + 1);
    const cardPairs = [...pairs, ...pairs];
    return cardPairs.sort(() => Math.random() - 0.5);
  };

  const initGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setTimeLeft(60);
    setGameStarted(true);
    setIsGameOver(false);
  };

  const handleCardClick = (index: number) => {
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && matchedCards.length < cards.length) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 || matchedCards.length === cards.length) {
      setGameStarted(false);
      setIsGameOver(true);
      if (matchedCards.length === cards.length) {
        if (currentLevel < levelConfig.length) {
          setCurrentLevel(currentLevel + 1);
          initGame();
        } else {
          alert("Congratulations! You've completed all levels!");
        }
      }
    }
    // 游戏结束,显示游戏结束页面
    if (isGameOver) {
      setCurrentPage('end');
      setGameStarted(false);
      setIsGameOver(false);
      setCurrentLevel(1);
      setScore(0);
      setTimeLeft(60);
      setFlippedCards([]);
      setMatchedCards([]);
      setCards([]);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, matchedCards.length, cards.length, currentLevel]);

  const restartGame = () => {
    initGame();
    setCurrentPage('game');
  };

  const renderHome = () => (
    <View className="home-container">
      <View className="home-content">
        <View className="title">记忆翻牌游戏</View>
        <View className="subtitle">挑战你的记忆力</View>
        <Image
          src="https://ai-public.mastergo.com/ai/img_res/07192164987a20da043b91c0609b4105.jpg"
          className="game-image"
        />
        <View className="button-group">
          <Button onClick={restartGame} className="start-button">开始游戏</Button>
          <Button className="record-button">历史记录</Button>
          <Button className="info-button">游戏说明</Button>
        </View>
      </View>
    </View>
  );

  const renderGame = () => {
    const config = getCurrentLevelConfig();
    const gridSize = `grid-cols-${config.grid}`;

    return (
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
                onClick={() => handleCardClick(index)}
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
          <Button onClick={() => setCurrentPage('home')} className="return-home-button">主页</Button>
          <Button onClick={restartGame} className="restart-game-button">重新开始</Button>
        </View>
      </View>
    );
  };

  const renderEnd = () => (
    <View className="end-container">
      <View className="end-title">
        <View className="end-title-icon">
          <Image src="https://ai-public.mastergo.com/ai/img_res/07192164987a20da043b91c0609b4105.jpg" className="end-title-icon-image" />
        </View>
        <View className="end-title-text">游戏结束</View>
      </View>
      <View className="end-score">
        <View className="end-score-label">最终得分</View>
        <View className="end-score-value">{score}</View>
        <View className="end-score-time">完成时间: {60 - timeLeft} 秒</View>
      </View>
      <View className="end-buttons">
        <Button onClick={restartGame} className="end-restart-game-button">重新开始</Button>
        <Button onClick={() => setCurrentPage('home')} className='end-return-home-button'>返回主页</Button>
      </View>
    </View>
  );

  return (
    <View className="app">
      {currentPage === 'home' && renderHome()}
      {currentPage === 'game' && renderGame()}
      {currentPage === 'end' && renderEnd()}
    </View>
  );
};

export default App;