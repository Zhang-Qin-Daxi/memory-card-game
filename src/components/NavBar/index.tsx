import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
}

const BACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0ZjQ2ZTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUgMThsLTYtNiA2LTYiLz48L3N2Zz4=';

export const NavBar: React.FC<NavBarProps> = ({ title = '', showBack = true }) => {
  const onBack = () => {
    const pages = Taro.getCurrentPages?.() || [];
    if (pages.length > 1) {
      Taro.navigateBack();
    } else {
      Taro.redirectTo({ url: '/pages/index/index' });
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '48px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
      }}
    >
      {showBack && (
        <View
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            marginLeft: '8px',
            marginRight: '4px',
          }}
        >
          <Image src={BACK_ICON} style={{ width: '24px', height: '24px' }} aria-label='返回' />
        </View>
      )}
      <Text style={{ fontSize: '16px', color: '#111827', fontWeight: 600 }}>{title}</Text>
    </View>
  );
};
