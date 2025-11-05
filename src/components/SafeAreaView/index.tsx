import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

export const SafeAreaView = ({ children }: { children: React.ReactNode }) => {
  const [safeArea, setSafeArea] = useState<{ top: number, bottom: number }>({ top: 0, bottom: 0 });

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    const safeArea = systemInfo.safeArea || { top: 0, bottom: 0 };
    setSafeArea({ top: safeArea.top, bottom: safeArea.bottom });
  }, []); 

  return <View style={{ paddingTop: safeArea.top + 'px', paddingBottom: safeArea.bottom + 'px' }}>{children}</View>
}