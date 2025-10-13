<template>
  <div class="multi-index-section-yield">
    <el-table
        class="indexTable"
        ref="indexTable"
        :data="tableData"
        size="small"
        border
        :highlight-current-row="true"
        style="width: 100%"
        height="200"
        :row-key="'secu_code'"
    >
      <el-table-column
          type="index"
          :width="45"
          align="center"
          :fixed="true"
          label="序号">
      </el-table-column>
      <el-table-column v-for="(item, index) in columnList" :key="item.prop" :prop="item.prop" :label="item.label"
                       :width="item.width || '105px'" show-overflow-tooltip
                       :min-width="item.minWidth || ''"
                       :sortable="item.sortable || false"
                       :fixed="item.fixed"
                       :align="item.align"
      >
        <template #header>
          <div class="custom-header">
            <div>{{ getHeaderLine1(item.prop) }}</div>
            <div v-if="item.br">{{ getHeaderLine2(item.prop) }}</div>
          </div>
        </template>
        <template #default="scope">
          <div v-if="!item.singleNode && !item.type" @click="itemClick(item.clickName, scope.row)"
               :class="['overflow_ellipsis', item.itemClass]"
               v-html="item.render ? item.render(scope.row[item.prop],scope.row) : getValue(scope.row, item)"
          ></div>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getRedOrGreenColorHtml} from "@/utils/ustils.js";
import indexAnalysisServer from "@/service/indexAnalysisServer.js";
import polling from "@/utils/polling.js";

export default {
  name: 'multi-index-section-yield',
  data() {
    return {
      sectionDate: {},
      tableData: [],
      columnList: [
        {
          prop: 'secu_code',
          label: '指数代码',
          width: '100',
          align: 'center',
          fixed: true,
          itemClass: 'text-align-center'
        },
        {
          prop: 'secu_name',
          label: '指数名称',
          width: '100',
          align: 'center',
          fixed: true,
          itemClass: 'text-align-center'
        },
        {
          prop: 't1',
          label: 'T',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 't_1',
          label: 'T-1',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 't_2',
          label: 'T-2',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 'this_week',
          label: '本周',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },

        {
          prop: 'last_week',
          label: '上周',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },

        {
          prop: 'last_two_week',
          label: '上上周',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 'this_month',
          label: '本月',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 'last_month',
          label: '上月',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },

        {
          prop: 'last_two_month',
          label: '上上月',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 'this_year',
          label: '今年',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
        {
          prop: 'last_year',
          label: '去年',
          br: true,
          sortable: true,
          width: '100',
          align: 'center',
          itemClass: 'text-align-center',
          render: (val, row) => {
            return getRedOrGreenColorHtml(`${this.$currency(val, 2)}%`, val)
          }
        },
      ]
    }
  },
  mounted() {
    polling.start(this.getTableData, 60 * 1000)
  },
  methods: {
    getTableData() {
      return indexAnalysisServer.getIndexAnalysis().then(res => {
        this.tableData = res.yield_list
        this.sectionDate = res.section_date
      })
    },
    itemClick (clickName, row) {
    },
    getValue(rowData, item) {
      const valueEmpty = this.isEmpty(rowData[item.prop])
      if (valueEmpty) {
        return item.placeholder || rowData[item.prop]
      }
      return rowData[item.prop]
    },
    isEmpty(data) {
      let empty = false
      const type = typeof data
      const excludeList = ['number', 'boolean']
      if (data) {
        if (type === 'object') {
          empty = Object.keys(data).length === 0
        }
      } else if (excludeList.indexOf(type) === -1) {
        empty = true
      }
      return empty
    },
    getColumnMap() {
      const columnMap = {}
      this.columnList.forEach(column => {
        if (column.prop) {
          columnMap[column.prop] = column
        }
      })
      return columnMap
    },
    getHeaderLine1(prop){
      return this.getColumnMap()[prop].label
    },
    getHeaderLine2(prop){
      return this.sectionDate[prop]
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-index-section-yield {
  width: 100%;
  height: 100%;
  background-color: #ff4d4f;

  .indexTable {
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
  }
}
</style>