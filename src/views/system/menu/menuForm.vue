<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" :model="form" v-loading="loading" :class="method==='view'?'readonly':''"
        :disabled="method==='view'" :rules="rules" ref="form" @keyup.enter.native="doSubmit()"
        label-width="100px" @submit.native.prevent>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                placeholder="选择上级菜单" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="form.icon" clearable @focus="selectIcon" placeholder="菜单图标名称"></el-input>
              <!-- <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon
                      v-if="form.icon"
                      slot="prefix"
                      :icon-class="form.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;"
                    />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="visible">
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio v-for="dict in dict.type.sys_show_hide" :key="dict.value" :label="dict.value">{{dict.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" v-if="method != 'view'" type="primary" @click="doSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <Icon ref="icon" @getValue="value => form.icon = value"></Icon>
  </div>
</template>

<script>
  import Icon from '@/components/icon'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { getMenu, addMenu, updateMenu,listMenu  } from "@/api/system/menu";
  export default {
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    data() {
      const validateUrl = (rule, value, callback) => {
        if (this.form.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        loading: false,
        method: '',
        title: '新增',
        typeList: ['目录', '菜单', '按钮', '路由'],
        menuOptions: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        form: {},
        // 表单校验
        rules: {
          menuName: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ],
          path: [
            { required: true, message: "路由地址不能为空", trigger: "blur" }
          ]
        }
      }
    },
    components: {
      Treeselect,
      Icon
    },
    methods: {
      init(method, obj) {
        this.method = method
        this.reset();
        this.getTreeselect();
        this.form.menuId = obj.id
        if (method === 'add') {
          this.title = `新增`
          this.form.parentId = 0
          this.visible = true
          return
        } else if (method === 'addChild') {
          this.title = '添加下级'
          this.form.parentId = obj.parent;
          this.visible = true
          return
        } else if (method === 'edit') {
          this.title = '修改'
        } else if (method === 'view') {
          this.title = '查看'
        }
        getMenu(this.form.menuId).then(response => {
          this.form = response.data;
          this.visible = true
        })
      },
      // 表单重置
      reset() {
        this.form = {
          menuId: undefined,
          parentId: 0,
          menuName: undefined,
          icon: undefined,
          menuType: "M",
          orderNum: undefined,
          isFrame: "1",
          isCache: "0",
          visible: "0",
          status: "0"
        };
        this.resetForm("form");
      },
      selectIcon() {
        this.$refs.icon.visible = true
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        };
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        listMenu().then(response => {
          this.menuOptions = [];
          const menu = { menuId: 0, menuName: '主类目', children: [] };
          menu.children = this.handleTree(response.data, "menuId");
          this.menuOptions.push(menu);
        });
      },
      // 表单提交
      doSubmit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.menuId != undefined) {
              updateMenu(this.form).then(response => {
                this.loading = false
                this.$modal.msgSuccess("修改成功");
                this.$emit('getList')
              });
            } else {
              addMenu(this.form).then(response => {
                this.loading = false
                this.$modal.msgSuccess("新增成功");
                this.visible = false
                this.$emit('getList')
              });
            }
          }
        });
      }
    }
  }
</script>
<style>

</style>
