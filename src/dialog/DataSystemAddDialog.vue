<template>
  <el-dialog
    title="添加数据系统"
    :visible="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <el-form label-position="top" :rules="rules" label-width="80px" :model="dataSystemEntity">
      <el-form-item label="系统名称" prop="systemName">
        <el-input v-model="dataSystemEntity.systemName" />
      </el-form-item>
      <el-form-item label="数据库名" prop="databaseName">
        <el-input v-model="dataSystemEntity.databaseName" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog(false)">取 消</el-button>
      <el-button type="primary" @click="saveDataSystem">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDataSystemData } from '@/api/datasystem'

export default {
  name: 'DataSystemAddDialog',
  data() {
    return {
      dataSystemEntity: {
        systemName: '',
        databaseName: ''
      },
      rules: {
        systemName: [
          { type: 'string', required: true, message: '请输入数据系统名', trigger: 'change' }
        ],
        databaseName: [
          { required: true, message: '请输入数据库名', trigger: 'change' },
          { pattern: '^\\w+$', message: '不符合数据库名规范', trigger: 'change' },
          { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  methods: {
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
    async saveDataSystem() {
      await addDataSystemData(this.dataSystemEntity.systemName, this.dataSystemEntity.databaseName)
      this.$message({
        message: '创建数据系统成功',
        type: 'success'
      })
      this.closeDialog(true)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
