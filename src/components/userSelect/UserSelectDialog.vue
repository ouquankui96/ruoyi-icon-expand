<template>
  <div>
    <el-dialog title="用户选择" width="70%" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag
      :visible.sync="visible">
      <el-row :gutter="10">
        <el-col :span="5" v-if="userType != '01'">
          <el-tag closable size="small" style="margin-bottom:5px" v-if="selectOfficeName" :disable-transitions="false"
            @close="handleNodeClose">
            {{selectOfficeName}}
          </el-tag>
          <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText">
          </el-input>
          <el-tree class="filter-tree" :data="officeTreeData" :props="{
              value: 'deptId',             // ID字段名
              label: 'label',         // 显示名称
              children: 'children'    // 子级字段名
            }" default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false"
            @node-click="handleNodeClick" ref="officeTree">
          </el-tree>
        </el-col>
        <el-col :span="userType != '01' ? 14:19">
          <el-form :inline="true" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()"
            @submit.native.prevent>
            <el-form-item prop="userName">
              <el-input size="small" v-model="searchForm.userName" placeholder="登录名" clearable></el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input size="small" v-model="searchForm.name" placeholder="姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
              <el-button @click="resetSearch()" size="small">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList" v-loading="loading" border size="medium" ref="userTable" height="500"
            @selection-change="selectionChangeHandle" @sort-change="sortChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="avatar" header-align="center" align="center" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.avatar === ''?'/static/img/avatar.png':scope.row.avatar" style="height:50px" />
              </template>
            </el-table-column>
            <el-table-column prop="userName" header-align="center" align="center" sortable="custom" min-width="90"
              label="登录名">
            </el-table-column>
            <el-table-column prop="phonenumber" header-align="center" align="center" sortable="custom" min-width="90"
              label="手机号">
            </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" sortable="custom" min-width="90"
              label="姓名">
            </el-table-column>
            <el-table-column prop="email" header-align="center" align="center" sortable="custom" min-width="80"
              label="邮箱">
            </el-table-column>

            <el-table-column prop="loginFlag" header-align="center" align="center" min-width="100" label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0'" size="small" type="success">正常</el-tag>
                <el-tag v-else-if="scope.row.status === '1'" size="small" type="danger">禁用</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize"
            @pagination="refreshList" />
        </el-col>
        <el-col :span="5">
          <el-tag :key="tag.id" v-for="tag in dataListAllSelections" closable :disable-transitions="false"
            @close="del(tag)">
            {{tag.userName}}
          </el-tag>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="doSubmit()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listUser,
    deptTreeSelect
  } from "@/api/system/user";
  export default {
    data() {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          userName: '',
          name: '',
          phonenumber: '',
          status: '',
          autonym: '',
          deptId: '',
          userType: ''
        },
        filterText: '',
        dataListAllSelections: [], // 所有选中的数据包含跨页数据
        dataListSelections: [],
        idKey: 'userId', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        dataList: [],
        dynamicTags: [],
        officeTreeData: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        orderBy: '',
        loading: false,
        visible: false,
        selectOfficeName: ''
      }
    },
    props: {
      selectData: {
        type: Array,
        default: () => {
          return []
        }
      },
      limit: {
        type: Number,
        default: 999999
      },
      userType: {
        type: String,
        default: '00'
      }
    },
    watch: {
      filterText(val) {
        this.$refs.officeTree.filter(val)
      }
    },
    methods: {
      init() {
        this.searchForm.userType = this.userType
        this.visible = true
        this.$nextTick(() => {
          this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData))
          this.refreshTree()
          this.resetSearch()
        })
      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
          this.$refs.userTable.clearSelection()
          return
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        this.$refs.userTable.clearSelection()
        for (var i = 0; i < this.dataList.length; i++) {
          if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.userTable.toggleRowSelection(this.dataList[i], true)
          }
        }
      },
      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let that = this
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.dataListAllSelections.length <= 0) {
          this.dataListSelections.forEach(row => {
            that.dataListAllSelections.push(row)
          })
          return
        }
        // 总选择里面的key集合
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        let selectIds = []
        // 获取当前页选中的id
        this.dataListSelections.forEach(row => {
          selectIds.push(row[idKey])
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.dataListAllSelections.push(row)
          }
        })
        let noSelectIds = []
        // 得到当前页没有选中的id
        this.dataList.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey])
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.dataListAllSelections.length; i++) {
              if (that.dataListAllSelections[i][idKey] === id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.dataListAllSelections.splice(i, 1)
                break
              }
            }
          }
        })
      },
      // 得到选中的所有数据
      getAllSelectionData() {
        // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
        this.changePageCoreRecordData()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      del(tag) {
        this.dataListAllSelections.splice(this.dataListAllSelections.indexOf(tag), 1)
        this.$nextTick(() => {
          this.setSelectRow()
        })
      },
      // 获取数据列表
      refreshList() {
        this.loading = true
        listUser(this.searchForm).then(res => {
          this.dataList = res.rows
          this.total = res.total
          this.loading = false
          this.$nextTick(() => {
            this.setSelectRow()
          })
        })
      },
      refreshTree() {
        deptTreeSelect().then(res => {
          this.officeTreeData = res.data
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageNo = val
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 多选
      selectionChangeHandle(val) {
        if (this.limit < val.length) {
           this.$message.error(`你最多只能选择${this.limit}个用户`)
           return
        } else {
          this.dataListSelections = val
          this.$nextTick(() => {
            this.changePageCoreRecordData()
          })
        }
      },
      // 排序
      sortChangeHandle(obj) {
        if (obj.prop === 'office.name') {
          obj.prop = 'o.name'
        }
        if (obj.prop === 'company.name') {
          obj.prop = 'c.name'
        }
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      handleNodeClick(data) {
        this.searchForm.deptId = data.id
        this.selectOfficeName = '已选机构: ' + data.label
        this.refreshList()
      },
      handleNodeClose() {
        this.searchForm.deptId = ''
        this.selectOfficeName = ''
        this.refreshList()
      },
      resetSearch() {
        this.searchForm.deptId = ''
        this.selectOfficeName = ''
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      doSubmit() {
        if (this.limit < this.dataListAllSelections.length) {
          this.$message.error(`你最多只能选择${this.limit}个用户`)
          return
        }
        this.visible = false
        this.$emit('doSubmit', this.dataListAllSelections)
      }
    }
  }
</script>
