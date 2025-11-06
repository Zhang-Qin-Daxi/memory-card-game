import { SafeAreaView } from "@/components/SafeAreaView";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import './index.scss';

const HistoryPage: React.FC = () => {
  const scoreList = Taro.getStorageSync('score') || [];
  return (
    <SafeAreaView>
      <View className="history-container">
        {scoreList ? (
          scoreList.map((item: any) => (
            <View className="history-score" key={item}>
              <Text className="history-score-time">{item.time}</Text>
              <Text className="history-score-value">{item.score}</Text>
            </View>
          ))
        ) : (
          <Text className="history-no-record-text">暂无记录</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryPage;