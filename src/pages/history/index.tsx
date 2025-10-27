import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";

const HistoryPage: React.FC = () => {
  const scoreList = Taro.getStorageSync('score')?.split(',') || [];
  return (
    <View className="history-container">
      <Text className="history-title">历史记录</Text>
      {scoreList ? (
        scoreList.map((item: number) => (
          <Text className="history-score" key={item}>{item}</Text>
        ))
      ) : (
        <Text className="history-no-record-text">暂无记录</Text>
      )}
    </View>
  );
};

export default HistoryPage;