export interface LevelConfig {
  level: number;
  grid: number;
  pairs: number;
}

export interface Card {
  id: number;
  imageUrl: string;
  pairId: number; // 用于匹配的ID
}

export interface GameState {
  currentPage: 'home' | 'game' | 'end';
  currentLevel: number;
  score: number;
  timeLeft: number;
  flippedCards: number[];
  matchedCards: number[];
  gameStarted: boolean;
  cards: Card[];
  isGameOver: boolean;
}

export interface GameActions {
  setCurrentPage: (page: 'home' | 'game' | 'end') => void;
  setCurrentLevel: (level: number) => void;
  setScore: (score: number) => void;
  setTimeLeft: (time: number) => void;
  setFlippedCards: (cards: number[]) => void;
  setMatchedCards: (cards: number[]) => void;
  setGameStarted: (started: boolean) => void;
  setCards: (cards: Card[]) => void;
  setIsGameOver: (over: boolean) => void;
  initGame: () => void;
  handleCardClick: (index: number) => void;
  restartGame: () => void;
}
