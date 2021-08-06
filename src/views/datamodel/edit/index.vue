<template>
  <div>
    <el-card>
      <el-tabs v-model="currentTab" type="card">
        <el-tab-pane label="基础信息" name="base">
          <el-form v-model="dmData" label-position="top" label-width="180px">
            <el-form-item label="模型名称">
              <el-input v-model="dmData.model_name" />
            </el-form-item>
            <el-form-item v-if="dmType === 'FatModel'" label="集合名">
              <el-input v-model="dmData.collection_name" />
            </el-form-item>
            <el-form-item label="所属系统">
              <el-select v-model="dmData.belong_system" filterable clearable>
                <el-option v-for="dataSystem in dataSystemList" :key="dataSystem._id" :label="dataSystem.system_name" :value="dataSystem._id" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="updateBaseInfo">保存数据</el-button>
        </el-tab-pane>
        <el-tab-pane label="属性信息" name="properties">
          <el-card>
            <div slot="header" class="clearfix">
              <div class="buttonGroup">
                <el-button type="primary" @click="handleAddProperty">新增数据属性</el-button>
              </div>
            </div>
            <el-table
              :data="dmData.properties"
              border
              fit
            >
              <el-table-column label="序号">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="属性名" prop="name" />
              <el-table-column label="数据KEY" prop="key" />
              <el-table-column label="数据类型" prop="type" :formatter="dpTypeFormatter" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEditProperty(scope.$index, scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleRemoveProperty(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <DataPropertyEditDialog ref="editDialog" :available-type="availableDataPropertyTypes" @dialogClose="handleDPDialogClose" />
  </div>
</template>

<script>
import {
  addFatDataModelDataProperty,
  getFatDataModelData,
  removeFatDataModelDataProperty,
  updateFatDataModelData
} from '@/api/fatdatamodel'
import {
  addThinDataModelDataProperty,
  getThinDataModelData,
  removeThinDataModelDataProperty,
  updateThinDataModelData
} from '@/api/thindatamodel'
import { listDataSystem } from '@/api/datasystem'
import DataPropertyEditDialog from '@/dialog/DataPropertyEditDialog'
import { getAllowedDataPropertyType } from '@/api/dataproperty'

export default {
  name: 'Index',
  components: {
    DataPropertyEditDialog
  },
  data() {
    return {
      dmType: '',
      dmId: '',
      dmData: {},
      currentTab: 'base',
      dataSystemList: [],
      allowedDataPropertyType: {}
    }
  },
  computed: {
    availableDataPropertyTypes() {
      return Object.keys(this.allowedDataPropertyType).filter((dataPropertyType) => {
        return this.allowedDataPropertyType[dataPropertyType].availableModels.indexOf(this.dmType) !== -1
      })
    }
  },
  async mounted() {
    await this.loadAllowedDataPropertyType()

    this.dmType = this.$route.query.dmType
    this.dmId = this.$route.query.dmId
    await this.loadDMData()
  },
  methods: {
    dpTypeFormatter(row) {
      return this.allowedDataPropertyType[row.type].label
    },
    async loadAllowedDataPropertyType() {
      this.allowedDataPropertyType = await getAllowedDataPropertyType()
    },
    async loadDMData() {
      const loadHandler = this.$loading({
        text: '获取数据中'
      })
      this.dmData = this.dmType === 'FatModel' ? await getFatDataModelData(this.dmId) : await getThinDataModelData(this.dmId)
      this.dataSystemList = await listDataSystem()
      loadHandler.close()
    },
    async handleRemoveProperty(index, data) {
      await this.$confirm('此操作将删除该数据属性，但不影响已有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (this.dmType === 'FatModel') {
        await removeFatDataModelDataProperty(this.dmId, data._id)
      } else {
        await removeThinDataModelDataProperty(this.dmId, data._id)
      }

      await this.loadDMData()
    },
    async handleAddProperty() {
      await this.$refs.editDialog.openCreateDialog()
      await this.$refs.editDialog.setSourceModelProperties(this.dmData.properties)
      this.$refs.editDialog.$once('handleAddDataProperty', async(dataPropertyEntity) => {
        const loadHandler = this.$loading({
          text: '提交数据中...'
        })
        // console.log('handleAddDataProperty', dataPropertyEntity)
        if (this.dmType === 'FatModel') {
          await addFatDataModelDataProperty(this.dmId, dataPropertyEntity._id)
        } else {
          await addThinDataModelDataProperty(this.dmId, dataPropertyEntity._id)
        }
        await this.loadDMData()
        loadHandler.close()
      })
    },
    async handleDPDialogClose(confirm) {
      if (confirm) {
        await this.loadDMData()
      }
    },
    async handleEditProperty(index, data) {
      await this.$refs.editDialog.openEditDialog(data._id)
      await this.$refs.editDialog.setSourceModelProperties(this.dmData.properties)
    },
    async updateBaseInfo() {
      this.$loading({
        text: '提交更新中...'
      })
      try {
        if (this.dmType === 'FatModel') {
          await updateFatDataModelData(this.dmId, {
            model_name: this.dmData.model_name,
            collection_name: this.dmData.collection_name,
            belong_system: this.dmData.belong_system
          })
        } else {
          await updateThinDataModelData(this.dmId, {
            model_name: this.dmData.model_name,
            belong_system: this.dmData.belong_system
          })
        }

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

<style scoped lang="scss">

.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.buttonGroup{
  float: left;
}

</style>
