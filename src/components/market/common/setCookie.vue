<template>
  <div>
    <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        title="设置数据源cookie"
        width="800"
        :before-close="handleClose"
    >
      <span style="font-size: 18px; font-weight: bold;">雪球cookie: </span>
      <el-input type="textarea" v-model="cookie" placeholder="请输入cookie">
      </el-input>
      <span style="font-size: 13px; color: #ff4d4f;">
        注意：请输入完整的cookie，否则可能会导致功能异常。
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">退出</el-button>
          <el-button type="primary" @click="saveCookie">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import xueQiuServer from "../../../service/xueQiuServer";

export default defineComponent({
  name: 'set-cookie',
  data () {
    return {
      dialogVisible: false,
      cookie: ''
    }
  },
  emits: {
  },
  methods: {
    show () {
      this.dialogVisible = true
      this.cookie = xueQiuServer.getCookie()
    },
    handleClose () {
      this.dialogVisible = false
    },
    saveCookie() {
      this.dialogVisible = false
      xueQiuServer.saveCookie(this.cookie)
    }
  }
})
</script>

<style scoped>

</style>