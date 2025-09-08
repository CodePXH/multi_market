<template>
  <div class="market-index-page">
    <div class="header-cla">
      <el-select
          v-model="selectedIndices"
          multiple
          filterable
          clearable
          placeholder="请选择指数"
          class="custom-multiple-select"
          style="width: 30%;margin-right: 10px; max-height: 30px"
      >
        <el-option
            v-for="index in indexList"
            :key="index.code"
            :label="`${index.code} ${index.name}`"
            :value="index.code"
        ></el-option>
      </el-select>
      <el-icon size="20" @click="setCookie"><Setting /></el-icon>
    </div>
    <div class="content-cla2">
      <multi-index-line :index-tick-map="indexRealTimeData"></multi-index-line>
    </div>
    <set-cookie ref="setCookie"></set-cookie>
  </div>
</template>

<script>
import { getIndexCache } from '@/utils/indexSet';
import xueQiuServer from "@/service/xueQiuServer.js";
import {Setting} from "@element-plus/icons-vue";
import SetCookie from "@/components/market/common/setCookie.vue";
import {AShareMarketTimeLine} from "@/utils/constant.js";
import MultiIndexLine from "@/components/market/common/multiIndexLine.vue";
import polling from "@/utils/polling.js";

export default {
  name: 'market-index-page',
  components: {MultiIndexLine, SetCookie, Setting},
  data() {
    return {
      selectedIndices: [], // 存储选中的指数代码
      indexList: [], // 指数列表数据
      indexMap: {},
      indexRealTimeData: {} // 存储实时数据结果
    }
  },
  async mounted() {
    // 获取指数列表数据
    polling.start(this.pollingQuery, 30 * 1000)
    try {
      const indices = await getIndexCache();
      if (indices) {
        this.indexList = indices;
        indices.forEach((item, index) => {
          this.indexMap[item.code] = item
        })
      }
    } catch (error) {
      console.error('获取指数列表失败:', error);
    }
  },
  watch: {
    // 监听选中指数变化，触发实时数据查询
    selectedIndices: {
      handler: async function(newVal) {
        if (newVal.length > 0) {
          await this.fetchMultipleIndicesData(newVal);
        }
      },
      immediate: false // 初始加载时不触发，仅在选择变化时触发
    }
  },
  destroyed() {
    polling.stop(this.pollingQuery)
  },
  methods: {
    setCookie () {
      this.$refs.setCookie.show()
    },
    pollingQuery () {
      if (this.selectedIndices.length > 0) {
        this.fetchMultipleIndicesData(this.selectedIndices);
      }
    },
    /**
     * 批量获取多个指数的实时数据
     * @param indices 指数代码数组
     */
    async fetchMultipleIndicesData(indices) {
      try {
        // 创建所有请求的Promise数组
        const requests = indices.map(code =>
            xueQiuServer.getTimeSeriesData('1d', code)
                .then(data => ({ code, data, success: true }))
                .catch(error => ({ code, error, success: false }))
        );

        // 等待所有请求完成（无论成功失败）
        const results = await Promise.all(requests);

        // 统一处理结果
        this.handleAllResponses(results);
      } catch (error) {
        console.error('批量获取指数数据失败:', error);
      }
    },

    /**
     * 统一处理所有指数数据响应
     * @param results 包含所有请求结果的数组
     */
    handleAllResponses(results) {
      const successData = {};
      const failedCodes = [];

      // 分离成功和失败的请求
      results.forEach(item => {
        if (item.success) {
          const data = item.data.items.map((e,i) => {
            return {
              current: e.current,
              chg: e.chg,
              percent: e.percent,
              time: AShareMarketTimeLine[i]
            }
          })
          successData[item.code] = {
            info: this.indexMap[item.code],
            seriesList: data
          }
        } else {
          failedCodes.push(item.code);
        }
      });

      // 更新实时数据存储
      this.indexRealTimeData = successData;

      // 处理失败情况
      if (failedCodes.length > 0) {
        console.error(`以下指数数据获取失败: ${failedCodes.join(', ')}`);
        // 可以在这里添加UI提示，如this.$message.error
      }

      // 这里可以添加统一的数据处理逻辑
      console.log('所有指数数据获取完成:', successData);

    }
  }
}

</script>

<style scoped>
.market-index-page {
  height: 100%;
  width: 100vw;
  //background-color: #2de4d9;
  color: var(--color-text);
  padding: 0 1rem;
  .header-cla {
    height: 50px;
    line-height: 40px;
    width: 100%;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .custom-multiple-select {}
  .content-cla2 {
    margin-top: 5px;
    height: calc(100% - 65px);
    width: 100%;
  }
}
</style>