import { get } from '../utils/request';

// 图片接口返回数据
export interface ImageData {
  id: number;
  image: string;
}

// 认证服务类
export class GetImgsService {
  static async getImgs(pairs: number): Promise<ImageData[]> {
    try {
      const response = await get<ImageData[]>(`/pet/game?pairs=${pairs}`);
      console.log('获取图片:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('获取图片失败:', error);
      throw error;
    }
  }
} 