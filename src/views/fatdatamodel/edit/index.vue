<template>
  <div>
    <el-card>
      <el-tabs v-model="currentTab" type="card">
        <el-tab-pane label="基础信息" name="base">
          <el-form v-model="fdmData" label-position="top" label-width="180px">
            <el-form-item label="模型名称">
              <el-input v-model="fdmData.model_name" />
            </el-form-item>
            <el-form-item label="集合名">
              <el-input v-model="fdmData.collection_name" />
            </el-form-item>
            <el-form-item label="所属系统">
              <el-select v-model="fdmData.belong_system" filterable>
                <el-option v-for="dataSystem in dataSystemList" :key="dataSystem._id" :label="dataSystem.system_name" :value="dataSystem._id" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="updateBaseInfo">保存数据</el-button>
        </el-tab-pane>
        <el-tab-pane label="属性信息" name="properties" />
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFatDataModelData, updateFatDataModelData } from '@/api/fatdatamodel'
import { listDataSystem } from '@/api/datasystem'

export default {
  name: 'Index',
  data() {
    return {
      fdmId: '',
      fdmData: {},
      currentTab: 'base',
      dataSystemList: []
    }
  },
  async mounted() {
    this.fdmId = this.$route.query.fdmId
    this.fdmData = await getFatDataModelData(this.fdmId)
    this.dataSystemList = await listDataSystem()
  },
  methods: {
    async updateBaseInfo() {
      this.$loading({
        text: '提交更新中...'
      })
      try {
        await updateFatDataModelData(this.fdmId, {
          model_name: this.fdmData.model_name,
          collection_name: this.fdmData.collection_name,
          belong_system: this.fdmData.belong_system
        })

        this.$message({
          message: '更新成功',
          type: 'success'
        })
      } catch (e) {
        console.error(e)

        this.$message({
          message: '更新失败',
          type: 'error'
        })
      } finally {
        this.$loading({}).close()
      }
    }
  }
}
</script>

<style scoped />
