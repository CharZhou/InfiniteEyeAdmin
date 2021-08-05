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
        <el-select v-model="dataPropertyEntity.type" filterable>
          <el-option v-for="(value,key) in dataPropertyType" :key="key" :label="value.label" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowRefArea" label="数据REF" prop="ref">
        <span>REF</span>
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
  updateDataProperty
} from '@/api/dataproperty'

export default {
  name: 'DataPropertyEditDialog',
  props: {
    excludeType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mode: 'edit',
      typeNeedToShowRef: ['ThinDataModelRef', 'FatDataModelRef'],
      dataPropertyId: '',
      dataPropertyEntity: {
        _id: '',
        name: '',
        key: '',
        type: '',
        ref: null
      },
      allowedDataPropertyType: {},
      rules: {
        name: [
          { type: 'string', required: true, message: '请输入数据系统名', trigger: 'change' }
        ],
        key: [
          { required: true, message: '请输入数据KEY', trigger: 'change' },
          { pattern: '^\\w+$', message: '不符合数据KEY规范', trigger: 'change' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        ref: [
          {
            required: () => this.isShowRefArea,
            message: '请填写模型REF', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  computed: {
    isShowRefArea() {
      return this.typeNeedToShowRef.indexOf(this.dataPropertyEntity.type) !== -1
    },
    dataPropertyType() {
      const dataPropertyType = {}
      for (const dataPropertyKey in this.allowedDataPropertyType) {
        if (this.excludeType.indexOf(dataPropertyKey) === -1) {
          dataPropertyType[dataPropertyKey] = this.allowedDataPropertyType[dataPropertyKey]
        }
      }
      return dataPropertyType
    }
  },
  methods: {
    async loadDataPropertyData() {
      this.dataPropertyEntity = await getDataPropertyData(this.dataPropertyId)
    },
    async loadAllowedDataPropertyType() {
      this.allowedDataPropertyType = await getAllowedDataPropertyType()
    },
    async openCreateDialog() {
      this.dialogVisible = true
      this.mode = 'add'
      this.$emit('dialogOpen')

      await this.loadAllowedDataPropertyType()
    },
    async openEditDialog(dataPropertyId) {
      this.dialogVisible = true
      this.mode = 'edit'
      this.$emit('dialogOpen')

      this.dataPropertyId = dataPropertyId
      await this.loadDataPropertyData()
      await this.loadAllowedDataPropertyType()
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
          ref: this.dataPropertyEntity.ref
        })
        this.$message({
          message: '更新数据属性成功',
          type: 'success'
        })
        this.$emit('handleEditDataProperty')
      } else if (this.mode === 'add') {
        const dataPropertyEntity = await addDataProperty(this.dataPropertyEntity.name, this.dataPropertyEntity.key, this.dataPropertyEntity.type, this.dataPropertyEntity.ref)
        this.$emit('handleAddDataProperty', dataPropertyEntity)
      }

      this.closeDialog(true)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
