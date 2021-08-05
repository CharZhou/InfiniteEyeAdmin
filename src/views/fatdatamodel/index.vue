<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>胖数据模型系统列表</span>
      <div class="buttonGroup">
        <el-button type="primary" @click="refreshFDMList">刷新</el-button>
        <el-button type="primary" @click="showADSPopup">新增胖数据模型</el-button>
      </div>
    </div>
    <PaginationTable
      id="table"
      v-loading="loading"
      :table-data="fatDataModelList"
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
      <el-table-column label="模型名称" prop="model_name" />
      <el-table-column label="所属系统ID" prop="belong_system" />
      <el-table-column label="创建时间" prop="create_time" />
      <el-table-column label="属性条数">
        <template slot-scope="scope">
          {{ scope.row.properties.length }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="queryFDM(scope.$index, scope.row)"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editFDM(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelFDM(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </PaginationTable>

    <DataSystemAddDialog ref="dsAddDialog" @dialogClose="handleFDMDialogClose" />

  </el-card>
</template>

<script>
import { listFatDataModel, delFatDataModel } from '@/api/fatdatamodel'
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
      fatDataModelList: [],
      pageSize: 10,
      recordTotal: 0,
      currentPage: 1,
      selectedData: []
    }
  },
  async mounted() {
    await this.loadFatDataModelList()
  },
  methods: {
    async queryFDM(fatDataModelIndex, fatDataModelEntity) {
      this.$router.push({ path: './query', query: { fdmId: fatDataModelEntity._id }})
    },
    async editFDM(fatDataModelIndex, fatDataModelEntity) {
      this.$router.push({ path: './edit', query: { fdmId: fatDataModelEntity._id }})
    },
    async refreshFDMList() {
      this.currentPage = 1
      await this.loadFatDataModelList()
    },
    showADSPopup() {
      this.$refs.dsAddDialog.openDialog()
    },
    async handleFDMDialogClose(confirm) {
      if (confirm) {
        await this.loadFatDataModelList()
      }
    },
    async handleDelFDM(fatDataModelIndex, fatDataModelEntity) {
      await this.$confirm('此操作将删除该模型，但不影响已有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await delFatDataModel(fatDataModelEntity._id)
      this.$message({ message: '删除成功', type: 'success' })

      await this.loadFatDataModelList()
    },
    async loadFatDataModelList() {
      this.loading = true;
      [this.fatDataModelList, this.recordTotal] = await listFatDataModel(this.currentPage, this.pageSize)
      this.loading = false
    },
    async handlePageChange({ currentPage, pageSize }) {
      // console.log(currentPage, pageSize)
      this.pageSize = pageSize
      this.currentPage = currentPage
      await this.loadFatDataModelList()
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
