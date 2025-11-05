  // 游戏说明页面
  import { View } from '@tarojs/components';
  import { SafeAreaView } from '@/components/SafeAreaView';

  const DescriptionPage = () => {
    return (
      <SafeAreaView>
        <View className="description-container">
          <View className="description-content">
            <View className="description-title">游戏说明</View>
            <View className="description-text">游戏说明</View>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  export default DescriptionPage;