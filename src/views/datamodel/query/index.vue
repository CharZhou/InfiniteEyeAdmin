<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ dmData.model_name }}</span>
        <div class="buttonGroup">
          <el-button type="primary" @click="checkJson">执行查询</el-button>
        </div>
      </div>
      <vue-json-editor
        v-model="queryJson"
        :show-btns="false"
        mode="code"

        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      />
      <!--      <JsonEditor v-if="canBeEditKeys.length > 0 && isShowEditor" ref="jsonEditor" v-model="queryJson" :schema="querySchema">-->
      <!--        <button @click="submit">submit</button>-->
      <!--        <button @click="reset">Reset</button>-->
      <!--      </JsonEditor>-->
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <vue-json-editor
        v-model="queryResult"
        :show-btns="false"
        mode="view"
      />
    </el-card>
  </div>
</template>
<script>
import { getFatDataModelData, queryFatDataModel } from '@/api/fatdatamodel'
import { getThinDataModelData, queryThinDataModel } from '@/api/thindatamodel'
import VueJsonEditor from 'vue-json-editor'
// import JsonEditor from 'vue-json-ui-editor'

// JsonEditor.setComponent('form', 'el-form', ({ vm }) => {
//   // vm is the JsonEditor VM
//
//   const labelWidth = '120px'
//   const model = vm.data
//   const rules = {}
//
//   function parseField(fields) {
//     Object.keys(fields).forEach(key => {
//       if (key.indexOf('$') === 0 && key !== '$sub') return
//       const field = fields[key]
//       if (field.$sub) {
//         return parseField(field)
//       }
//       if (!field.name) return
//       rules[field.name] = []
//       // http://element.eleme.io/#/en-US/component/form#validation
//       const type = field.schemaType === 'array' && field.type === 'radio' ? 'string' : field.schemaType
//       const required = field.required
//       const message = field.title
//       const trigger = ['radio', 'checkbox', 'select'].includes(field.type) ? 'change' : 'blur'
//       rules[field.name].push({ type, required, message, trigger })
//
//       if (field.minlength !== undefined || field.maxlength !== undefined) {
//         const max = field.maxlength || 255
//         const min = field.minlength || 0
//         const msg = `Length must between ${min} and ${max}`
//         rules[field.name].push({ min, max, message: msg, trigger })
//       }
//     })
//   }
//
//   parseField(vm.fields)
//
//   // returning the form props
//   return { labelWidth, rules, model }
// })
//
// // http://element.eleme.io/#/en-US/component/form#validation
// JsonEditor.setComponent('label', 'el-form-item', ({ field }) => ({
//   prop: field.name
// }))
//
// JsonEditor.setComponent('email', 'el-input')
// JsonEditor.setComponent('url', 'el-input')
// JsonEditor.setComponent('number', 'el-input-number')
// JsonEditor.setComponent('text', 'el-input')
// JsonEditor.setComponent('textarea', 'el-input')
// JsonEditor.setComponent('checkbox', 'el-checkbox')
// JsonEditor.setComponent('checkboxgroup', 'el-checkbox-group')
// JsonEditor.setComponent('radio', 'el-radio')
// JsonEditor.setComponent('select', 'el-select')
// JsonEditor.setComponent('switch', 'el-switch')
// JsonEditor.setComponent('color', 'el-color-picker')
// JsonEditor.setComponent('rate', 'el-rate')
//
// // You can also use the component object
// JsonEditor.setComponent('option', Option)
//
// // By default `<h1/>` is used to render the form title.
// // To override this, use the `title` type:
// JsonEditor.setComponent('title', 'h2')
//
// // By default `<p/>` is used to render the form title.
// // To override this, use the `description` type:
// JsonEditor.setComponent('description', 'small')
//
// // By default `<div/>` is used to render the message error.
// // To override this, use the `error` type:
// JsonEditor.setComponent('error', 'el-alert', ({ vm }) => ({
//   type: 'error',
//   title: vm.error
// }))

export default {
  name: 'Index',
  components: {
    VueJsonEditor
    // JsonEditor
  },
  data() {
    return {
      dmType: '',
      dmId: '',
      dmData: {},
      queryResult: {},
      hasJsonFlag: true,
      queryJson: {},
      querySchema: {},
      isShowEditor: false,
      jsonExcludeKey: ['FatModelRef', 'ThinModelRef', 'DataTransfer']
    }
  },
  computed: {
    canBeEditKeys() {
      if (!this.dmData.properties || this.dmData.properties.length === 0) {
        return []
      }
      return Object.values(this.dmData.properties
        .filter(prop => this.jsonExcludeKey.indexOf(prop.type) === -1)
        .map(prop => prop.key))
    },
    propertyDict() {
      const dict = {}
      if (!this.dmData.properties || this.dmData.properties.length === 0) {
        return dict
      }
      this.dmData.properties.forEach(property => {
        dict[property.key] = property
      })
      return dict
    }
  },
  async mounted() {
    this.dmType = this.$route.query.dmType
    this.dmId = this.$route.query.dmId
    await this.loadDMData()
    await this.initQueryJson()
    // await this.initQuerySchema()
    // this.isShowEditor = true
  },
  methods: {
    async initQueryJson() {
      const newQueryJson = {}
      const values = this.canBeEditKeys
      // console.log('values', values)
      for (const value of values) {
        newQueryJson[value] = ''
      }
      this.queryJson = newQueryJson
    },
    parseDatePropertyType(typeString) {
      const mapping = {
        String: 'string',
        Boolean: 'boolean',
        Date: 'string',
        Number: 'number',
        ObjectId: 'string'
      }
      const mapResult = mapping[typeString]
      return mapResult || String
    },
    async initQuerySchema() {
      const properties = {}
      const propertyKeys = this.canBeEditKeys
      // console.log(propertyKeys)
      for await (const propertyKey of propertyKeys) {
        properties[propertyKey] = {
          type: this.parseDatePropertyType(this.propertyDict[propertyKey].type),
          title: this.propertyDict[propertyKey].name,
          required: false
        }
      }

      // console.log(properties)
      this.querySchema = {
        type: 'object',
        properties: properties
      }
    },
    async loadDMData() {
      const loadHandler = this.$loading({
        text: '获取数据中'
      })
      this.dmData = this.dmType === 'FatModel' ? await getFatDataModelData(this.dmId) : await getThinDataModelData(this.dmId)
      loadHandler.close()
    },
    async makeQuery(queryCondition, queryOption = {}) {
      const loadHandler = this.$loading({
        text: '正在查询中...'
      })
      try {
        this.queryResult = this.dmType === 'FatModel' ? await queryFatDataModel(this.dmId, queryCondition, queryOption) : await queryThinDataModel(this.dmId, queryCondition, queryOption)
        this.$message({ message: '查询完毕', type: 'success' })
      } catch (e) {
        this.$message({ message: '查询失败', type: 'error' })
        console.error(e)
      } finally {
        loadHandler.close()
      }
    },
    onJsonChange(value) {
      this.onJsonSave(value)
    },
    onJsonSave(value) {
      this.queryJson = value
      this.hasJsonFlag = true
    },
    onError(value) {
      this.hasJsonFlag = false
    },
    // 检查json
    async checkJson() {
      // if (this.hasJsonFlag === false) {
      //   this.$message.error('json验证失败')
      //   return
      // }
      await this.makeQuery(this.queryJson)
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
