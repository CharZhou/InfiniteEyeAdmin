<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>数据系统列表</span>
      <div class="buttonGroup">
        <el-button type="primary" @click="refreshDSList">刷新</el-button>
        <el-button type="primary" @click="showADSPopup">新增数据系统</el-button>
      </div>
    </div>
    <PaginationTable
      id="table"
      v-loading="loading"
      :table-data="dataSystemList"
      :total="recordTotal"
      :page-size="10"
      @handleChange="handlePageChange"
    >
      <!--      <el-table-column type="selection" />-->
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="系统ID" prop="_id" />
      <el-table-column label="系统名称" prop="system_name" />
      <el-table-column label="数据库名" prop="database_name" />
      <el-table-column label="数据库账号" prop="system_user" />
      <el-table-column label="数据库密码" prop="system_password" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelDS(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </PaginationTable>

    <DataSystemAddDialog ref="dsAddDialog" @dialogClose="handleDsDialogClose" />

  </el-card>
</template>

<script>
import { listDataSystem, delDataSystemData } from '@/api/datasystem'
import PaginationTable from '@/components/PaginationTable'
import DataSystemAddDialog from '@/dialog/DataSystemAddDialog'

export default {
  name: 'DataSystem',
  components: {
    PaginationTable,
    DataSystemAddDialog
  },
  data() {
    return {
      loading: true,
      dataSystemList: [],
      pageSize: 10,
      recordTotal: 0,
      currentPage: 1,
      selectedData: []
    }
  },
  async mounted() {
    await this.loadDataSystemList()
  },
  methods: {
    async refreshDSList() {
      // console.log('refreshDSList')
      this.currentPage = 1
      await this.loadDataSystemList()
    },
    showADSPopup() {
      this.$refs.dsAddDialog.openDialog()
    },
    async handleDsDialogClose(confirm) {
      // console.log('handleDsDialogClose', confirm)
      if (confirm) {
        await this.loadDataSystemList()
      }
    },
    async handleDelDS(dataSystemIndex, dataSystemEntity) {
      await this.$confirm('此操作将删除该数据系统的接入权限，但不影响已有数据库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await delDataSystemData(dataSystemEntity._id)
      this.$message({ message: '删除成功', type: 'success' })

      await this.loadDataSystemList()
    },
    async loadDataSystemList() {
      this.loading = true;
      [this.dataSystemList, this.recordTotal] = await listDataSystem(this.currentPage, this.pageSize)
      this.loading = false
    },
    async handlePageChange({ currentPage, pageSize }) {
      // console.log(currentPage, pageSize)
      this.pageSize = pageSize
      this.currentPage = currentPage
      await this.loadDataSystemList()
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
