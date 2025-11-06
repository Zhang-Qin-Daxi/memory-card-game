import React, { useEffect, useState } from 'react';
import { View, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface EndPageProps {
  score: number;
  timeLeft: number;
  onRestartGame: () => void;
  onReturnHome: () => void;
}

const EndPage: React.FC<EndPageProps> = ({
  timeLeft,
  onRestartGame,
  onReturnHome,
}) => {
  const [firstScore, setFirstScore] = useState<number>(0);

  useEffect(() => {
    const scoreDataList = JSON.parse(Taro.getStorageSync('score')) || []; // 获取历史记录
    // 获取第一条历史记录
    const firstScoreData = scoreDataList[0];
    if (firstScoreData) {
      setFirstScore(firstScoreData?.score || 0);
    } else {
      setFirstScore(0);
    }
  }, []);
  
  return (
    <View className="end-container">
      <View className="end-title">
        <View className="end-title-icon">
          <Image 
            src="https://ai-public.mastergo.com/ai/img_res/07192164987a20da043b91c0609b4105.jpg" 
            className="end-title-icon-image" 
          />
        </View>
        <View className="end-title-text">游戏结束</View>
      </View>
      <View className="end-score">
        <View className="end-score-label">最终得分</View>
        <View className="end-score-value">{firstScore}</View>
        {/* <View className="end-score-time">完成时间: {60 - timeLeft} 秒</View> */}
      </View>
      <View className="end-buttons">
        <Button onClick={onRestartGame} className="end-restart-game-button">重新开始</Button>
        <Button onClick={onReturnHome} className='end-return-home-button'>返回主页</Button>
      </View>
    </View>
  );
};

export default EndPage;
