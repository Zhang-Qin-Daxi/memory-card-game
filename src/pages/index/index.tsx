import Taro from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';
import { SafeAreaView } from '@/components/SafeAreaView';
import mainImage from '@/assets/images/main-icon.jpg';
import './index.scss';

const HomePage = () => {
  return (
    <SafeAreaView>
      <View className="home-container">
        <View className="home-content">
          <View className="title">记忆翻牌游戏</View>
          <View className="subtitle">挑战你的记忆力</View>
          <Image src={mainImage} className="game-image" />
          <View className="button-group">
            <Button onClick={() => Taro.navigateTo({ url: '/pages/game/index' })} className="start-button">开始游戏</Button>
            <Button onClick={() => Taro.navigateTo({ url: '/pages/history/index' })} className="record-button">历史记录</Button>
            <Button onClick={() => Taro.navigateTo({ url: '/pages/description/index' })} className="info-button">游戏说明</Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;