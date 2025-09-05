// 定义A股指数基本信息接口
interface AShareIndexInfo {
  code: string;         // 指数代码
  name: string;         // 指数名称
}

// 缓存键名
const CACHE_KEY = 'a_share_index_cache';

/**
 * 保存指数信息到localStorage
 * @param indexData 指数数据数组
 */
export const saveIndexCache = (indexData: AShareIndexInfo[]): void => {
  const cacheData = {
    data: indexData,
    timestamp: Date.now() // 记录缓存时间
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('保存指数缓存失败:', error);
  }
};

/**
 * 增加一个或多个指数到缓存
 * @param indices 单个指数对象或指数对象数组
 */
export const addIndices = (indices: AShareIndexInfo | AShareIndexInfo[]): void => {
    try {
        // 统一将输入转换为数组格式
        const newIndices = Array.isArray(indices) ? indices : [indices];

        // 获取现有缓存数据（若无则为空数组）
        const existingData = getIndexCache() || [];

        // 使用Map按code去重并合并（重复code会被新数据覆盖）
        const indexMap = new Map<string, AShareIndexInfo>(
            existingData.map(index => [index.code, index])
        );

        // 添加/更新新指数
        newIndices.forEach(index => {
            indexMap.set(index.code, index);
        });

        // 转换Map为数组并保存到缓存
        const mergedData = Array.from(indexMap.values());
        saveIndexCache(mergedData);
    } catch (error) {
        console.error('添加指数失败:', error);
    }
};
/**
 * 从localStorage获取指数信息
 * @param forceRefresh 是否强制刷新(忽略过期时间)
 * @returns 指数数据数组或null(缓存不存在/过期)
 */
export const getIndexCache = async (forceRefresh: boolean = false): AShareIndexInfo[] | null => {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);

    // 强制刷新或无缓存时从CSV加载
    if (!cacheStr) {
      const csvData = await loadIndicesFromCSV();
      if (csvData) {
          saveIndexCache(csvData); // 保存到缓存
          return csvData;
      }
      return null;
    }
    const cacheData = JSON.parse(cacheStr) as {
      data: AShareIndexInfo[];
      timestamp: number;
    };


    return cacheData.data;
  } catch (error) {
    console.error('获取指数缓存失败:', error);
    return null;
  }
};

/**
 * 获取单个指数信息
 * @param code 指数代码
 * @returns 单个指数信息或undefined
 */
export const getSingleIndex = (code: string): AShareIndexInfo | undefined => {
  const allIndexData = getIndexCache();
  return allIndexData?.find(index => index.code === code);
};

/**
 * 清除指数缓存
 */
export const clearIndexCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('指数缓存已清除');
  } catch (error) {
    console.error('清除指数缓存失败:', error);
  }
};

/**
 * 从CSV文件加载指数数据
 */
const loadIndicesFromCSV = async (): Promise<AShareIndexInfo[] | null> => {
    try {
        // 加载CSV文件（路径根据实际项目结构调整）
        const response = await fetch('/a_share_indices.csv');
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);

        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length <= 1) return null; // 无数据行

        // 解析CSV内容（跳过表头行）
        const indices: AShareIndexInfo[] = [];
        for (let i = 1; i < lines.length; i++) {
            const [code, name] = lines[i].split(',').map(item => item.trim());
            if (code && name) {
                indices.push({ code, name });
            }
        }

        console.warn("加载CSV文件" + JSON.stringify(indices));

        return indices;
    } catch (error) {
        console.error('从CSV加载指数数据失败:', error);
        return null;
    }
};
