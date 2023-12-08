<template>
  <div class="app-container">
    <el-row>
      <el-button v-hasPermi="['system:area:add']" type="primary" icon="el-icon-plus" size="small" @click="add()">新增
      </el-button>
    </el-row>
    <el-table v-loading="loading"
      :data="dataList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%" lazy>
      <el-table-column prop="name" label="区域名称"/>
      <el-table-column prop="code" label="区域编码"/>
      <el-table-column prop="type" label="区域类型">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_area_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="首字母" align="center" prop="firstLetter" />
      <el-table-column prop="sort" label="排序号"/>
      <el-table-column prop="remark" label="备注"/>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-hasPermi="['system:area:view']" type="text" size="small" icon="el-icon-view"
            @click="view(scope.row)">查看</el-button>
          <el-button v-hasPermi="['system:area:edit']" type="text" size="small" icon="el-icon-edit"
            @click="edit(scope.row)">修改</el-button>
          <el-button v-hasPermi="['system:area:del']" type="text" size="small" icon="el-icon-delete"
            @click="del(scope.row.id)">删除</el-button>
          <el-button v-hasPermi="['system:area:add']" type="text" size="small" icon="el-icon-circle-plus-outline"
            @click="addChild(scope.row)">添加下级区域</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <AreaForm ref="areaForm" @refreshDataList="refreshList"></AreaForm>

  </div>
</template>

<script>
  import {
    delArea,
    listArea
  } from "@/api/system/area";
  import AreaForm from './AreaForm'
  export default {
    dicts: ['sys_area_type'],
    data() {
      return {
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        loading: false,
        dataList: []
      }
    },
    components: {
      AreaForm
    },
    created() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        listArea().then(response => {
          this.dataList = this.handleTree(response.data, "id");
          this.loading = false;
        })
      },
      // 新增下级
      addChild(row) {
        this.$refs.areaForm.init('addChild', row)
      },
      // 新增
      add() {
        this.$refs.areaForm.init('add', {
          id: '',
          parentId: ''
        })
      },
      // 修改
      edit(row) {
        this.$refs.areaForm.init('edit', row)
      },
      // 查看
      view(row) {
        this.$refs.areaForm.init('view', row)
      },
      // 删除
      del(id) {
        this.$confirm(`确定删除该记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delArea(id).then(res => {
            this.loading = false
            this.refreshList()
            this.$modal.msgSuccess("删除成功");
          })
        })
      }
    }
  }
</script>
