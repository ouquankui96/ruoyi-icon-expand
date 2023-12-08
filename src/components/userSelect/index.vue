<template>
<div>
    <el-input placeholder="请选择" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="showUserSelect" icon="el-icon-search"></el-button>
    </el-input>
    <user-select ref="userSelect" @doSubmit="selectUsersToInput" :limit="limit" :userType="userType" :selectData="selectData"></user-select>
</div>
</template>
<script>
import userSelect from './UserSelectDialog'
import {getUser} from "@/api/system/user";
import Cookies from 'js-cookie';
export default {
  data () {
    return {
      name: '',
      labelValue: this.value,
      selectData: []
    }
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    userType: String,
    value: String,
    size: String,
    readonly: {
      type: Boolean,
      default: () => { return false }
    },
    disabled: {
      type: Boolean,
      default: () => { return false }
    }
  },
  components: {
    userSelect
  },
  created () {

  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          var index = (newVal+'').indexOf(',')
          if (index > 0) {
            newVal.split(',').forEach((id) => {
              getUser(id).then(res => {
                this.selectData.push(res.data)
              })
            })
          } else {
            getUser(newVal).then(res => {
              this.selectData.push(res.data)
            })
          }
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler (newVal) {
        this.name = newVal.map(user => { return user.userName }).join(',')
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    selectUsersToInput (users) {
      this.selectData = users
      this.labelValue = users.map(user => { return user.userId }).join(',')
      this.name = users.map(user => { return user.userName }).join(',')
      this.$emit('getValue', this.labelValue, this.userName)
    },
    showUserSelect () {
      this.$refs.userSelect.init()
    }
  }
}
</script>
<style>
  .el-form-item__content .el-input-group {
      vertical-align: middle;
  }
 .el-tag + .el-tag {
    margin-left: 5px;
    margin-bottom: 5px;
  }
</style>


