<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible" width="500px" append-to-body>
    <el-form size="small" :model="inputForm" :rules="dataRule" ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="80px" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="12">
          <el-form-item label="上级区域" prop="parentId">
             <SelectTree
             ref="parentTree"
             :props="{
                value: 'id',             // ID字段名
                label: 'name',         // 显示名称
                children: 'children'    // 子级字段名
              }"
            v-if="visible"
            :url="`/system/area/selectTree`"
            :value="inputForm.parentId"
            :clearable="true"
            :accordion="true"
            @getValue="(value) => {inputForm.parentId=value}"/>
          </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="区域名称" prop="name">
              <el-input maxlength="50" v-model="inputForm.name" placeholder="区域名称"></el-input>
            </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="区域编码" prop="code">
            <el-input maxlength="50" v-model="inputForm.code" placeholder="区域编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域类型" prop="type">
            <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                <el-option
                  v-for="item in dict.type.sys_area_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="排序号" prop="sort">
            <el-input-number  v-model="inputForm.sort" :step="30" style="width:100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input maxlength="200" v-model="inputForm.remark" type="textarea"
                  :rows="2" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" v-if="method != 'view'" type="primary" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import {
    addArea,
    getArea,
    updateArea
  } from "@/api/system/area";
  export default {
    dicts: ['sys_area_type'],
    data () {
      return {
        areaListTreeProps: {
          label: 'name',
          children: 'children'
        },
        visible: false,
        loading: false,
        method: '',
        title: '新增',
        inputForm: {
          id: '',
          name: '',
          parentId: '',
          sort: '30',
          code: '', // 区域编码
          type: '', // 区域类型（1：公司；2：部门；3：小组）
          remark: ''
        },
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '区域类型不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '区域编码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      SelectTree
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.inputForm.id = obj.id
          this.title = '新增区域'
        } else if (method === 'addChild') {
          this.inputForm.parentId = obj.id
          this.title = '添加下级区域'
        } else if (method === 'edit') {
          this.inputForm.id = obj.id
          this.title = '修改区域'
        } else if (method === 'view') {
          this.inputForm.id = obj.id
          this.title = '查看区域'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          this.inputForm.parenId = obj.parenId
          if (method === 'edit' || method === 'view') { // 修改或者查看
            getArea(this.inputForm.id).then((data) => {
              this.inputForm = data.data
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.method === 'edit') {
              updateArea(this.inputForm).then((data) => {
                this.loading = false
                this.$modal.msgSuccess('操作成功')
                this.visible = false
                this.$emit('refreshDataList')
              })
            } else {
              addArea(this.inputForm).then((data) => {
                this.loading = false
                this.$modal.msgSuccess('操作成功')
                this.visible = false
                this.$emit('refreshDataList')
              })
            }
          }
        })
      }
    }
  }
</script>
