<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>瘦数据模型系统列表</span>
      <div class="buttonGroup">
        <el-button type="primary" @click="refreshFDMList">刷新</el-button>
        <el-button type="primary" @click="showADSPopup">新增数据模型</el-button>
      </div>
    </div>
    <PaginationTable
      id="table"
      v-loading="loading"
      :table-data="thinDataModelList"
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
            @click="queryTDM(scope.$index, scope.row)"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editTDM(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelTDM(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </PaginationTable>

    <DataSystemAddDialog ref="dsAddDialog" @dialogClose="handleTDMDialogClose" />

  </el-card>
</template>

<script>
import { listThinDataModel, delThinDataModel } from '@/api/thindatamodel'
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
      thinDataModelList: [],
      pageSize: 10,
      recordTotal: 0,
      currentPage: 1,
      selectedData: []
    }
  },
  async mounted() {
    await this.loadThinDataModelList()
  },
  methods: {
    async queryTDM(thinDataModelIndex, thinDataModelEntity) {
      this.$router.push({ path: '/datamodel/thin/query', query: { tdmId: thinDataModelEntity._id }})
    },
    async editTDM(thinDataModelIndex, thinDataModelEntity) {
      this.$router.push({ path: '/datamodel/thin/edit', query: { tdmId: thinDataModelEntity._id }})
    },
    async refreshFDMList() {
      this.currentPage = 1
      await this.loadThinDataModelList()
    },
    showADSPopup() {
      this.$refs.dsAddDialog.openDialog()
    },
    async handleTDMDialogClose(confirm) {
      if (confirm) {
        await this.loadThinDataModelList()
      }
    },
    async handleDelTDM(thinDataModelIndex, thinDataModelEntity) {
      await this.$confirm('此操作将删除该模型，但不影响已有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await delThinDataModel(thinDataModelEntity._id)
      this.$message({ message: '删除成功', type: 'success' })

      await this.loadThinDataModelList()
    },
    async loadThinDataModelList() {
      this.loading = true;
      [this.thinDataModelList, this.recordTotal] = await listThinDataModel(this.currentPage, this.pageSize)
      this.loading = false
    },
    async handlePageChange({ currentPage, pageSize }) {
      // console.log(currentPage, pageSize)
      this.pageSize = pageSize
      this.currentPage = currentPage
      await this.loadThinDataModelList()
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
