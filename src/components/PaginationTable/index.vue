<template>
  <div>
    <el-table
      :data="tableData"
      border
      fit
      @selection-change="handleSelectionChange"
    >
      <slot />
    </el-table>
    <el-pagination
      v-if="showPagination"
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100, 1000, 10000, 100000]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    showPagination: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      const param = {
        currentPage: this.currentPage,
        pageSize: val
      }
      this.$emit('handleChange', param)
    },
    handleCurrentChange(val) {
      // console.log('handleCurrentChange', val)
      const param = {
        pageSize: this.pageSize,
        currentPage: val
      }
      this.$emit('handleChange', param)
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagination {
    margin-top: 10px;
    margin-right: 10px;
    text-align: right;
  }
</style>
