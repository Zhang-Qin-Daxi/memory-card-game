import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { getCurrentLevelConfig } from '../config/gameConfig';

interface GamePageProps {
  currentLevel: number;
  score: number;
  timeLeft: number;
  cards: number[];
  flippedCards: number[];
  matchedCards: number[];
  onCardClick: (index: number) => void;
  onReturnHome: () => void;
  onRestartGame: () => void;
}

const GamePage: React.FC<GamePageProps> = ({
  currentLevel,
  score,
  timeLeft,
  cards,
  flippedCards,
  matchedCards,
  onCardClick,
  onReturnHome,
  onRestartGame,
}) => {
  const config = getCurrentLevelConfig(currentLevel);
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
  );
};

export default GamePage;
