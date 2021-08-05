<template>
  <el-dialog
    title="添加数据模型"
    :visible="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <el-form label-position="top" :rules="rules" label-width="80px" :model="dataModelEntity">
      <el-form-item label="模型名称" prop="modelName">
        <el-input v-model="dataModelEntity.modelName" />
      </el-form-item>
      <el-form-item v-if="modelType === 'fat'" label="集合名" prop="collectionName">
        <el-input v-model="dataModelEntity.collectionName" />
      </el-form-item>
      <el-form-item label="所属数据系统">
        <el-select v-model="dataModelEntity.belongSystem" filterable>
          <el-option v-for="dataSystem in dataSystemOptions" :key="dataSystem._id" :label="dataSystem.system_name" :value="dataSystem._id" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog(false)">取 消</el-button>
      <el-button type="primary" @click="saveDataModel">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listDataSystem } from '@/api/datasystem'
import { addFatDataModel } from '@/api/fatdatamodel'
import { addThinDataModel } from '@/api/thindatamodel'

export default {
  name: 'DataSystemAddDialog',
  props: {
    modelType: {
      type: String,
      default: 'fat'
    }
  },
  data() {
    return {
      dataModelEntity: {
        modelName: '',
        collectionName: '',
        belongSystem: ''
      },
      dataSystemOptions: [],
      rules: {
        modelName: [
          { type: 'string', required: true, message: '请输入数据模型名', trigger: 'change' }
        ],
        collectionName: [
          { required: () => this.modelType === 'fat', message: '请输入集合名', trigger: 'change' },
          { pattern: '^\\w+$', message: '不符合集合名规范', trigger: 'change' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'change' }
        ],
        belongSystem: [
          { required: true, message: '请选择所属数据系统', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  async mounted() {
    await this.loadDataSystemList()
  },
  methods: {
    async loadDataSystemList() {
      this.dataSystemOptions = await listDataSystem()
    },
    openDialog() {
      this.dialogVisible = true
      this.$emit('dialogOpen')
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
    async saveDataModel() {
      if (this.modelType === 'fat') {
        await addFatDataModel(this.dataModelEntity.modelName, this.dataModelEntity.collectionName, this.dataModelEntity.belongSystem)
      } else if (this.modelType === 'thin') {
        await addThinDataModel(this.dataModelEntity.modelName, this.dataModelEntity.belongSystem)
      }

      this.$message({
        message: '创建数据模型成功',
        type: 'success'
      })
      this.closeDialog(true)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
