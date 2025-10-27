import { useState, useEffect } from 'react';
import { GameState, GameActions } from '../types/game';
import { levelConfig, generateCards } from '../config/gameConfig';
import Taro from '@tarojs/taro';

export const useGameState = (): GameState & GameActions => {
  const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'end'>('home');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const PREVIEW_DURATION_MS = 3000; // 开局预览时长

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

  const restartGame = () => {
    initGame();
    setCurrentPage('game');
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
          const scoreList = Taro.getStorageSync('score')?.split(',') || []; // 获取历史记录
          if (scoreList.length > 10) {
            scoreList.shift(); // 如果历史记录超过10条，则删除最早的一条
          }
          if (score > 0) {
            scoreList.unshift(score.toString()); // 将当前得分添加到历史记录中
          }
          Taro.setStorageSync('score', scoreList.join(',')); // 将历史记录存储到本地
          initGame(); // 重新开始游戏 并设置当前页面为结束页面
          setCurrentPage('end');
        }
      }
    }
    // 游戏结束,显示游戏结束页面
    if (isGameOver) {
      const scoreList = Taro.getStorageSync('score')?.split(',') || []; // 获取历史记录
      if (scoreList.length > 10) {
        scoreList.shift(); // 如果历史记录超过10条，则删除最早的一条
      }
      if (score > 0) {
        scoreList.unshift(score.toString()); // 将当前得分添加到历史记录中
      }
      Taro.setStorageSync('score', scoreList.join(',')); // 将历史记录存储到本地
      initGame(); // 重新开始游戏 并设置当前页面为结束页面
      setCurrentPage('end');
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, matchedCards.length, cards.length, currentLevel]);

  return {
    // State
    currentPage,
    currentLevel,
    score,
    timeLeft,
    flippedCards,
    matchedCards,
    gameStarted,
    cards,
    isGameOver,
    // Actions
    setCurrentPage,
    setCurrentLevel,
    setScore,
    setTimeLeft,
    setFlippedCards,
    setMatchedCards,
    setGameStarted,
    setCards,
    setIsGameOver,
    initGame,
    handleCardClick,
    restartGame,
  };
};
