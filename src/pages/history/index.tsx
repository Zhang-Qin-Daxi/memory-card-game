import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { SafeAreaView } from "@/components/SafeAreaView";
import { NavBar } from '@/components/NavBar';
import './index.scss';

const HistoryPage: React.FC = () => {
  const scoreList = Taro.getStorageSync('score') || [];
  return (
    <SafeAreaView>
      <NavBar title="历史记录" showBack />
      <View className="history-container">
        {scoreList && scoreList.length > 0 ? (
          scoreList.map((item: any, idx: number) => (
            <View className="history-score" key={idx}>
              <Text className="history-score-time">{item.time}</Text>
              <Text className="history-score-value">{item.score}</Text>
            </View>
          ))
        ) : (
          <View className="history-empty-card">
            <Image
              src={
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%238da2fb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8v5l3 3'/><path d='M21 12a9 9 0 1 1-9-9'/><path d='M7 12H3'/></svg>"
              }
              className="history-empty-icon"
              mode="widthFix"
            />
            <Text className="history-no-record-text">暂无游戏记录</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryPage;
