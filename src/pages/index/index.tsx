import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import './index.scss';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<number[]>([]);

  const levelConfig = [
    { level: 1, grid: 2, pairs: 2 },
    { level: 2, grid: 4, pairs: 8 },
    { level: 3, grid: 4, pairs: 12 },
    { level: 4, grid: 8, pairs: 32 },
    { level: 5, grid: 8, pairs: 48 },
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
      if (matchedCards.length === cards.length) {
        // Move to the next level if all cards are matched
        if (currentLevel < levelConfig.length) {
          setCurrentLevel(currentLevel + 1);
          initGame();
        } else {
          // Handle game completion
          alert("Congratulations! You've completed all levels!");
          setGameStarted(false);
        }
      } else {
        setGameStarted(false);
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, matchedCards.length, cards.length, currentLevel]);

  return (
    <View className="game">
      <View className="info-bar">
        <Text>关卡: {currentLevel}</Text>
        <Text>得分: {score}</Text>
        <Text className={timeLeft <= 10 ? 'time-red' : 'time-normal'}>时间: {timeLeft}s</Text>
      </View>
      <View className={`grid grid-cols-${getCurrentLevelConfig().grid}`}>
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
        <Button onClick={() => { /* Return to home */ }}>主页</Button>
        <Button onClick={initGame}>重新开始</Button>
      </View>
    </View>
  );
};

export default App;