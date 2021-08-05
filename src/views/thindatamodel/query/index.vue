<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询语句</span>
        <div class="buttonGroup">
          <el-button type="primary" @click="checkJson">执行查询</el-button>
        </div>
      </div>
      <vue-json-editor
        v-model="queryJson"
        :show-btns="false"
        mode="code"

        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      />
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <vue-json-editor
        v-model="queryResult"
        :show-btns="false"
        mode="view"
      />
    </el-card>
  </div>
</template>
<script>
import { getThinDataModelData, queryThinDataModel } from '@/api/thindatamodel'
import VueJsonEditor from 'vue-json-editor'

export default {
  name: 'Index',
  components: {
    VueJsonEditor
  },
  data() {
    return {
      tdmId: '',
      tdmData: {},
      queryResult: {},
      hasJsonFlag: true,
      queryJson: {}
    }
  },
  async mounted() {
    this.tdmId = this.$route.query.tdmId
    await this.loadTDMData()
  },
  methods: {
    async loadTDMData() {
      const loadHandler = this.$loading({
        text: '获取数据中'
      })
      this.tdmData = await getThinDataModelData(this.tdmId)
      loadHandler.close()
    },
    async makeQuery(queryCondition, queryOption = {}) {
      const loadHandler = this.$loading({
        text: '正在查询中...'
      })
      try {
        this.queryResult = await queryThinDataModel(this.tdmId, queryCondition, queryOption)
        this.$message({ message: '查询完毕', type: 'success' })
      } catch (e) {
        this.$message({ message: '查询失败', type: 'error' })
        console.error(e)
      } finally {
        loadHandler.close()
      }
    },
    onJsonChange(value) {
      this.onJsonSave(value)
    },
    onJsonSave(value) {
      this.queryJson = value
      this.hasJsonFlag = true
    },
    onError() {
      this.hasJsonFlag = false
    },
    // 检查json
    async checkJson() {
      if (this.hasJsonFlag === false) {
        this.$message.error('json验证失败')
        return
      }
      await this.makeQuery(this.queryJson)
    }
  }
}
</script>

<style scoped lang="scss">
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.buttonGroup{
  float: right;
}
</style>
