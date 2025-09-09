<template>
  <div class="multiIndexLine">
    <div id="multiIndexChart"></div>
  </div>
</template>

<script>

import {defineComponent,toRaw} from "vue";
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
    }
  },
  destroyed() {
    this.beforeUnmount()
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter: function (params) {
            console.warn(params)
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
      originalMaxPrice: 1,
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
  },
  methods: {
    initChart () {
      const element = document.getElementById('multiIndexChart')
      if (element) {
        element.style.width = '100%'
        element.style.height = '100%'
      }
      let eChartsType = echarts.init(element);
      console.log(eChartsType)
      this.chart = eChartsType
      this.drawChart()
    },
    drawChart() {
      this.handleData()
      this.handleYAxis()
      toRaw(this.chart).setOption(this.options, {
        notMerge: true
      })
    },
    handleYAxis () {
      this.options.yAxis.max = Math.ceil(this.maxPercent)
      this.options.yAxis.min = -Math.ceil(this.maxPercent)
      this.options.yAxis.interval = Math.ceil(this.maxPercent) / 5
    },
    handleData () {
      const series = []
      const legendsData = []
      const legendsSelected = {}
      this.maxPercent = this.originalMaxPrice
      for (const key in this.indexTickMap) {
        let element = this.indexTickMap[key];
        legendsData.push(element.info.name)
        legendsSelected[element.info.name] = true
        series.push({
          name: element.info.name,
          showSymbol: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: this.seriesData(element.info, element.seriesList),
          type: 'line'
        })


      }
      this.options.series = series
      this.options.legend = {
        top:0,
        itemWidth: 45,
        itemHeight: 0,
        data: legendsData,
        selected: legendsSelected
      }
    },

    seriesData (info, data) {
      if (!data) {
        return []
      }
      return data.map(e => {
        if (Math.abs(e.percent) > this.maxPercent) {
          this.maxPercent = Math.abs(e.percent)
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

    }
  }
})
</script>

<style scoped>
.multiIndexLine {
  width: 100%;
  height: 100%;
}
</style>