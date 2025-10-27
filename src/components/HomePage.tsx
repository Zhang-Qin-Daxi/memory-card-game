import React from 'react';
import { View, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  return (
    <View className="home-container">
      <View className="home-content">
        <View className="title">记忆翻牌游戏</View>
        <View className="subtitle">挑战你的记忆力</View>
        <Image
          src="https://ai-public.mastergo.com/ai/img_res/07192164987a20da043b91c0609b4105.jpg"
          className="game-image"
        />
        <View className="button-group">
          <Button onClick={onStartGame} className="start-button">开始游戏</Button>
          <Button onClick={() => Taro.navigateTo({ url: '/pages/history/index' })} className="record-button">历史记录</Button>
          <Button onClick={() => Taro.navigateTo({ url: '/pages/info/index' })} className="info-button">游戏说明</Button>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
