<template>
  <div class="multiIndexLine">
    <div id="multiIndexChart"></div>
  </div>
</template>

<script>

import {defineComponent, toRaw} from "vue";
import {AShareMarketTimeLine} from "@/utils/constant.js";
import * as echarts from 'echarts';
import {getRedOrGreenColorHtml} from "@/utils/ustils.js";

export default defineComponent({
  name: 'multiIndexLine',
  props: {
    indexTickMap: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    securityColor: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  destroyed() {
    this.beforeUnmount()
  },
  data() {
    return {
      options: {
        grid: {
          left: 50,   // 距离容器左侧100px
          top: 50,     // 距离容器顶部50px
          right: 150,   // 距离容器右侧50px
          bottom: 30,  // 距离容器底部50px
          containLabel: true // 确保标签不被裁剪
        },
        legend: {
          right: 10, // 距离容器右侧 10px（固定在右侧）
          top: 'center', // 垂直居中
          orient: 'vertical', // 垂直排列（默认 horizontal 水平）
          itemWidth: 45,
          itemHeight: 0,
          data: [],
          selected: {}
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter: function (params) {
            let str = ''
            params.sort((a, b) => {
              return b.value - a.value
            }).forEach((e, i) => {
              str += `<div>${e.marker}${e.seriesName}：${getRedOrGreenColorHtml(e.data.current, e.value)}：${getRedOrGreenColorHtml(e.value + '%', e.value)}</div>`
            })
            return `<div>
              <div style="color:#034ef8;font-size:14px;font-weight:bold;">${params[0].axisValue}</div>
              ${str}
              </div>`
          }
        },
        xAxis: {
          type: 'category',
          data: AShareMarketTimeLine,
          axisLabel: {
            interval: 0, // 强制显示所有标签
            formatter: function(value, index) {
              // AShareMarketTimeLine是['09:30','10:00','10:30'...]格式
              if (value === '11:30') {
                return '';
              }
              if (value === '13:00') {
                return '11:30/13:00';
              }
              return value.includes(':30') || value.includes(':00') ? value : ''; // 每半小时显示一个
            }
          },
          axisTick: {
            alignWithLabel: true // 刻度与标签对齐
          }
        },
        yAxis: {
          type: 'value',
          name: '涨跌幅（%）',
          min: -7,
          max: 7,
          interval: 1
        },
        series: [],
      },
      chart: null,
      maxPercent: 1,
      minPercent: -1,
      originalMaxPrice: 1,
      resizeListener: null, // 添加resize监听器引用
    }
  },
  watch: {
    indexTickMap: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
    this.addResizeListener()
  },
  methods: {
    addResizeListener() {
      // 添加resize事件监听
      this.resizeListener = () => {
        this.chart.resize()
      }
      window.addEventListener('resize', this.resizeListener)
    },
    removeResizeListener() {
      // 移除resize事件监听
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener)
        this.resizeListener = null
      }
    },
    initChart () {
      const element = document.getElementById('multiIndexChart')
      if (element) {
        element.style.width = '100%'
        element.style.height = '100%'
      }
      this.chart = echarts.init(element)
      this.drawChart()
    },
    drawChart() {
      this.handleData()
      this.handleYAxis()
      toRaw(this.chart).setOption(this.options, {
        notMerge: true
      })
      toRaw(this.chart).on('legendselectchanged', (obj) => {
        this.options.legend.selected = obj.selected;
      });
    },
    handleYAxis () {
      console.warn('handleYAxis', this.maxPercent, this.minPercent)
      this.options.yAxis.max = Math.ceil(this.maxPercent)
      this.options.yAxis.min = Math.ceil(this.minPercent) - 1
      // this.options.yAxis.interval = (Math.abs(this.options.yAxis.max) + Math.abs(this.options.yAxis.min)) / 5
    },
    handleData () {
      const series = []
      const legendsData = []
      const legendsSelected = {}
      this.maxPercent = this.originalMaxPrice
      for (const key in this.indexTickMap) {
        let element = this.indexTickMap[key];
        legendsData.push(element.info.name)
        legendsSelected[element.info.name] = this.options.legend.selected[element.info.name] === undefined ? true : this.options.legend.selected[element.info.name]
        series.push({
          name: element.info.name,
          showSymbol: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: this.seriesData(element.info, element.seriesList),
          type: 'line',
          itemStyle: {
            color: this.securityColor[element.info.code]
          }
        })


      }
      this.options.series = series
      this.options.legend = {
        ...this.options.legend,
        data: legendsData,
        selected: legendsSelected
      }
    },

    seriesData (info, data) {
      if (!data) {
        return []
      }
      return data.map(e => {
        if (e.percent > this.maxPercent) {
          this.maxPercent = e.percent
        }
        if (e.percent < this.minPercent) {
          this.minPercent = e.percent
        }
        return {
          value: e.percent,
          name: info.name,
          code: info.code,
          current: e.current,
          time: e.time
        }
      })
    },
    beforeUnmount() {
      this.removeResizeListener()
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
    }
  }
})
</script>

<style scoped>
.multiIndexLine {
  width: 100%;
  height: 100%;
  background-color: #f8f0f0;
}
</style>