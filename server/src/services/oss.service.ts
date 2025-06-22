// src/services/oss.service.ts

import ossClient from "../config/oss.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class OssService {
  public async uploadImageFromBuffer(buffer: Buffer, originalName: string): Promise<string> {
    const fileExt = path.extname(originalName);
    const uniqueFileName = `${uuidv4()}${fileExt}`;
    const ossKey = `blog/images/${uniqueFileName}`;

    try {
      const result = await ossClient.put(ossKey, buffer);
      console.log(`文件上传成功: ${originalName} -> ${result.url}`);
      return result.url;
    } catch (error) {
      console.error(`上传到OSS失败: ${originalName}`, error);
      // 抛出自定义错误或原始错误，让上层服务处理
      throw new Error(`Failed to upload ${originalName} to OSS.`);
    }
  }
}

// 导出一个单例，方便在其他地方使用
export const ossService = new OssService();
