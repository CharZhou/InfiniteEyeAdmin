<template>
  <el-dialog
    title="编辑数据属性"
    :visible="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <el-form label-position="top" :rules="rules" label-width="80px" :model="dataPropertyEntity">
      <el-form-item label="数据属性名" prop="name">
        <el-input v-model="dataPropertyEntity.name" />
      </el-form-item>
      <el-form-item label="数据KEY" prop="key">
        <el-input v-model="dataPropertyEntity.key" />
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="dataPropertyEntity.type" filterable clearable>
          <el-option v-for="(value,key) in dataPropertyType" :key="key" :label="value.label" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowRefArea" prop="ref">
        <el-form label-position="top" label-width="80px" :model="dataPropertyEntity.ref" :rules="refRules">
          <el-form-item label="源KEY" prop="source_key">
            <el-select v-model="dataPropertyEntity.ref.source_key" filterable clearable>
              <el-option v-for="sourceKeyData in sourceKeyOptions" :key="sourceKeyData._id" :label="sourceKeyData.name" :value="sourceKeyData.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="目标模型" prop="target_model">
            <el-select v-model="dataPropertyEntity.ref.target_model" filterable clearable>
              <el-option v-for="model in targetModelOptions" :key="model._id" :label="model.model_name" :value="model._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="目标KEY" prop="target_key">
            <el-select v-model="dataPropertyEntity.ref.target_key" filterable clearable>
              <el-option v-for="targetKeyData in targetKeyOptions" :key="targetKeyData._id" :label="targetKeyData.name" :value="targetKeyData.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="目标节点" prop="target_node">
            <el-select v-model="dataPropertyEntity.ref.target_node" filterable clearable>
              <el-option v-for="targetKeyData in targetKeyOptions" :key="targetKeyData._id" :label="targetKeyData.name" :value="targetKeyData.key" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item v-if="isShowDataTransferArea" prop="transfer">
        <el-form label-position="top" label-width="80px" :model="dataPropertyEntity.transfer" :rules="transferRules">
          <el-form-item label="转换方法" prop="transfer_rule">
            <el-select v-model="dataPropertyEntity.transfer.transfer_rule" filterable clearable>
              <el-option v-for="(value,key) in dataTransferRule" :key="key" :label="value.label" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="源KEY" prop="source_key">
            <el-input v-model="dataPropertyEntity.transfer.source_key" />
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog(false)">取 消</el-button>
      <el-button type="primary" @click="saveDataProperty">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addDataProperty,
  getAllowedDataPropertyType,
  getDataPropertyData,
  getDataTransferRule,
  updateDataProperty
} from '@/api/dataproperty'
import { listFatDataModel, getFatDataModelData } from '@/api/fatdatamodel'
import { listThinDataModel, getThinDataModelData } from '@/api/thindatamodel'

export default {
  name: 'DataPropertyEditDialog',
  props: {
    availableType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mode: 'edit',
      targetModelOptions: [],
      sourceKeyOptions: [],
      targetKeyOptions: [],
      typeNeedToShowRef: ['ThinModelRef', 'FatModelRef'],
      dataPropertyId: '',
      dataPropertyEntity: {
        _id: '',
        name: '',
        key: '',
        type: '',
        ref: {
          target_model: null,
          target_key: null,
          source_key: null,
          target_node: null
        },
        transfer: {
          transfer_rule: null,
          source_key: null
        }
      },
      allowedDataPropertyType: {},
      dataTransferRule: {},
      refRules: {
        target_model: [
          { required: () => this.isShowRefArea, message: '请选择目标模型', trigger: 'change' }
        ]
      },
      transferRules: {},
      rules: {
        name: [
          { type: 'string', required: true, message: '请输入数据系统名', trigger: 'change' }
        ],
        key: [
          { required: true, message: '请输入数据KEY', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  computed: {
    isShowRefArea() {
      return this.typeNeedToShowRef.indexOf(this.dataPropertyEntity.type) !== -1
    },
    isShowDataTransferArea() {
      return this.dataPropertyEntity.type === 'DataTransfer'
    },
    dataPropertyType() {
      const dataPropertyType = {}
      for (const dataPropertyKey in this.allowedDataPropertyType) {
        if (this.availableType.indexOf(dataPropertyKey) !== -1) {
          dataPropertyType[dataPropertyKey] = this.allowedDataPropertyType[dataPropertyKey]
        }
      }
      return dataPropertyType
    }
  },
  watch: {
    async 'dataPropertyEntity.type'(newVal, oldVal) {
      // console.log('type', newVal)
      if (!newVal) {
        return
      }
      await this.clearTargetModel()
      await this.clearModelRef()
      await this.clearTransferRule()
      if (newVal === 'FatModelRef') {
        this.targetModelOptions = await listFatDataModel()
      } else if (newVal === 'ThinModelRef') {
        this.targetModelOptions = await listThinDataModel()
      }
    },
    async 'dataPropertyEntity.ref.target_model'(newVal, oldVal) {
      // console.log('target_model', newVal)
      if (!newVal) {
        return
      }
      await this.clearModelRef()
      let modelData
      if (this.dataPropertyEntity.type === 'FatModelRef') {
        modelData = await getFatDataModelData(newVal)
      } else if (this.dataPropertyEntity.type === 'ThinModelRef') {
        modelData = await getThinDataModelData(newVal)
      }
      this.targetKeyOptions = modelData.properties
    },
    deep: true
  },
  methods: {
    async clearTransferRule() {
      this.$set(this.dataPropertyEntity, 'transfer.source_key', null)
      this.$set(this.dataPropertyEntity, 'transfer.transfer_rule', null)
    },
    async clearModelRef() {
      this.$set(this.dataPropertyEntity, 'ref.source_key', null)
      this.$set(this.dataPropertyEntity, 'ref.target_key', null)
      this.$set(this.dataPropertyEntity, 'ref.target_node', null)
    },
    async clearTargetModel() {
      this.$set(this.dataPropertyEntity, 'ref.target_model', null)
    },
    async loadDataPropertyData() {
      this.dataPropertyEntity = await getDataPropertyData(this.dataPropertyId)
    },
    async loadBaseConfig() {
      this.allowedDataPropertyType = await getAllowedDataPropertyType()
      this.dataTransferRule = await getDataTransferRule()
    },
    async setSourceModelProperties(sourceModelProperties) {
      this.sourceKeyOptions = sourceModelProperties
    },
    async openCreateDialog() {
      this.dialogVisible = true
      this.mode = 'add'
      this.$emit('dialogOpen')

      await this.loadBaseConfig()
    },
    async openEditDialog(dataPropertyId) {
      this.dialogVisible = true
      this.mode = 'edit'
      this.$emit('dialogOpen')

      this.dataPropertyId = dataPropertyId
      await this.loadDataPropertyData()
      await this.loadBaseConfig()
    },
    closeDialog(confirm) {
      this.dialogVisible = false
      this.$emit('dialogClose', confirm)
    },
    handleClose() {
      if (this.dialogVisible) {
        this.closeDialog(false)
      }
    },
    async saveDataProperty() {
      if (this.mode === 'edit') {
        await updateDataProperty(this.dataPropertyEntity._id, {
          name: this.dataPropertyEntity.name,
          key: this.dataPropertyEntity.key,
          type: this.dataPropertyEntity.type,
          ref: this.dataPropertyEntity.ref,
          transfer: this.dataPropertyEntity.transfer
        })
        this.$message({
          message: '更新数据属性成功',
          type: 'success'
        })
        this.$emit('handleEditDataProperty')
      } else if (this.mode === 'add') {
        const dataPropertyEntity = await addDataProperty({
          name: this.dataPropertyEntity.name,
          key: this.dataPropertyEntity.key,
          type: this.dataPropertyEntity.type,
          ref: this.dataPropertyEntity.ref,
          transfer: this.dataPropertyEntity.transfer
        })
        this.$emit('handleAddDataProperty', dataPropertyEntity)
      }

      this.closeDialog(true)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
