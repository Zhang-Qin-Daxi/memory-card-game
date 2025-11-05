import React from 'react';
import { View } from '@tarojs/components';
import { useGameState } from '../../hooks/useGameState';
import HomePage from '../../components/HomePage';
import GamePage from '../../components/GamePage';
import EndPage from '../../components/EndPage';
import './index.scss';

const App: React.FC = () => {
  const gameState = useGameState();

  return (
    <View className="app">
      {gameState.currentPage === 'home' && (
        <HomePage onStartGame={gameState.restartGame} />
      )}
      {gameState.currentPage === 'game' && (
        <GamePage
          currentLevel={gameState.currentLevel}
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          cards={gameState.cards}
          flippedCards={gameState.flippedCards}
          matchedCards={gameState.matchedCards}
          onCardClick={gameState.handleCardClick}
          onReturnHome={() => gameState.setCurrentPage('home')}
          onRestartGame={gameState.restartGame}
        />
      )}
      {gameState.currentPage === 'end' && (
        <EndPage
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          onRestartGame={gameState.restartGame}
          onReturnHome={() => gameState.setCurrentPage('home')}
        />
      )}
    </View>
  );
};

export default App;