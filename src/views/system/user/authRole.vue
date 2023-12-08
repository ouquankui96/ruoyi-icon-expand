<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <h4>用户昵称:{{form.nickName}}</h4>
        </el-col>
        <el-col :span="8" :offset="2">
          <h4>登录账号:{{form.userName}}</h4>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:user:edit']"
        >编辑</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="roleIds">
      <el-table-column label="角色名称" align="center" prop="roleName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="权限字符" align="center" prop="roleKey" />
    </el-table>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :close-on-click-modal="false" v-dialogDrag :visible.sync="upload.open" append-to-body>
      <el-form label-width="100px">
        <el-form-item style="margin: 0 auto;width: 79%;">
          <el-transfer :titles="['未拥有', '已拥有']" v-model="value" :data="roles"></el-transfer>
        </el-form-item>
        <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="close()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthRole, updateAuthRole } from "@/api/system/user";

export default {
  name: "AuthRole",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
      },
      userId: null,
       // 遮罩层
      loading: true,
      // 选中角色编号
      roleIds:[],
      // 角色信息
      roles: [],
      // 用户信息
      form: {},
      value: []
    };
  },
  created() {
    // const userId = this.$route.params && this.$route.params.userId;
    // if (userId) {
    //   this.refList(userId)
    // }
  },
  methods: {
    //获取数据
    refList(userId) {
      this.userId = userId
      this.loading = true;
      this.value = []
      this.roles = []
      getAuthRole(userId).then((response) => {
        this.form = response.user;
        response.roles.forEach((row) =>{
          this.roles.push({
            key: row.roleId,
            label: row.roleName,
            disabled: row.status == '0' ? false:true
          })
        })
        this.roleIds = this.form.roles
        this.roleIds.forEach((row) => {
          this.value.push(row.roleId)
        });
        this.loading = false;
      });
    },
    //编辑点击
    handleAdd() {
      this.upload.title = this.form.userName+'角色编辑'
      this.upload.open = true
    },
    //关闭
    close() {
      this.upload.open = false
    },
    /** 提交按钮 */
    submitForm() {
      const userId = this.form.userId;
      const roleIds = this.value.join(",");
      updateAuthRole({ userId: userId, roleIds: roleIds }).then((response) => {
        this.$modal.msgSuccess("授权成功");
        this.refList(userId)
        this.upload.open = false
      });
    }
  }
};
</script>
