import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Button, Image } from '@tarojs/components';
import { SafeAreaView } from '@/components/SafeAreaView';
import './index.scss';

const EndPage = () => {
  const [firstScore, setFirstScore] = useState<{time: string, score: number} | null>(null);

  useEffect(() => {
    const scoreList = Taro.getStorageSync('score') || []; // 获取历史记录
    // 获取第一条历史记录
    const firstScoreData = scoreList[0];
    if (firstScoreData) {
      setFirstScore(firstScoreData);
    } else {
      setFirstScore(null);
    }
  }, []);

  return (
    <SafeAreaView>
      <View className="end-container">
        <View className="end-title">
          <View className="end-title-icon">
            {/* <Image
              src="https://ai-public.mastergo.com/ai/img_res/07192164987a20da043b91c0609b4105.jpg"
              className="end-title-icon-image"
            /> */}
          </View>
          <View className="end-title-text">游戏结束</View>
        </View>
        <View className="end-score">
          <View className="end-score-label">最终得分</View>
          <View className="end-score-value">{firstScore?.score || 0}</View>
          <View className="end-score-time">{firstScore?.time || '--'}</View>
        </View>
        <View className="end-buttons">
          <Button onClick={() => Taro.navigateTo({ url: '/pages/game/index' })} className="end-restart-game-button">重新开始</Button>
          <Button onClick={() => Taro.navigateTo({ url: '/pages/index/index' })} className='end-return-home-button'>返回主页</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EndPage;
