<template>
  <div class="multiIndexLine">
    <div id="multiIndexChart"></div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import {AShareMarketTimeLine} from "@/utils/constant.js";
import * as echarts from 'echarts';

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
  data() {
    return {
      options: {
        xAxis: {
          type: 'category',
          data: AShareMarketTimeLine
        },
        // xAxis: {},
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
      maxPercent: 1
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
      this.chart = echarts.init(element)
      this.drawChart()
    },
    drawChart() {
      this.handleData()
      this.handleYAxis()
      this.chart.setOption(this.options, {
        notMerge: true
      })
    },
    handleYAxis () {
      this.options.yAxis.max = Math.round((this.maxPercent + 1) * 100) / 100
      this.options.yAxis.min = -Math.round((this.maxPercent + 1) * 100) / 100
      this.options.yAxis.interval = Math.round(this.maxPercent / 3 * 100) / 100
    },
    handleData () {
      const series = []
      const legendsData = []
      const legendsSelected = {}
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
          current: e.current
        }
      })
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