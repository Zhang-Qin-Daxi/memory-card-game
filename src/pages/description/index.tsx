  // 游戏说明页面
  import { View } from '@tarojs/components';
  import { SafeAreaView } from '@/components/SafeAreaView';
  import './index.scss';

  const DescriptionPage = () => {
    const sections: Array<{ title: string; lines: string[] }> = [
      {
        title: '玩法目标',
        lines: ['在每一关的倒计时结束前，找出所有相同图片的配对，翻开并消除全部卡片。'],
      },
      {
        title: '基本规则',
        lines: [
          '进入关卡后会先自动翻开全部卡片进行 3 秒预览。',
          '预览结束后卡片盖回，开始倒计时。',
          '每次最多同时翻开 2 张卡片。',
          '两张卡片图片相同则匹配成功并保持翻开；不相同则 1 秒后自动盖回。',
        ],
      },
      {
        title: '计分方式',
        lines: ['每成功匹配一对卡片得 10 分。'],
      },
      {
        title: '关卡与时间',
        lines: [
          '第 1 关为 6 对卡片，之后每关在上一关基础上增加 4 对。',
          '每关倒计时为 20 秒；时间归零则本局结束并结算当前得分。',
          '匹配完成会自动进入下一关，最高到第 10 关。',
        ],
      },
      {
        title: '历史记录',
        lines: ['每次结算后会保存一条得分记录，可在主页进入“历史记录”查看。'],
      },
      {
        title: '小提示',
        lines: [
          '优先记住图片的大致位置，再做配对会更快。',
          '倒计时变红表示剩余时间较少，尽量快速尝试未出现过的位置。',
        ],
      },
    ];

    return (
      <SafeAreaView>
        <View className="description-container">
          <View className="description-content">
            <View className="description-title">游戏说明</View>
            <View className="description-text">
              {sections.map((section) => (
                <View key={section.title} className="description-section">
                  <View className="description-section-title">{section.title}</View>
                  {section.lines.map((line) => (
                    <View key={line} className="description-line">
                      {line}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  export default DescriptionPage;
