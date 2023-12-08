<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="change()">
      <!-- 登录配置 -->
      <el-tab-pane label="登录" name="first">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>单一登陆配置</h3>
          </div>
          <el-form ref="loginFormSetting" :model="loginFormSetting">
            <el-form-item>
               <el-checkbox true-label="1" false-label="0" v-model="loginFormSetting.multiaccountlogin">单一登录</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="loginFormSetting.singlelogintype">
                <el-radio :disabled="loginFormSetting.multiaccountlogin ==='0'" label="1">后登陆踢出先登录</el-radio>
                <el-radio :disabled="loginFormSetting.multiaccountlogin ==='0'" label="2">已登陆禁止再登陆</el-radio>
              </el-radio-group>
            </el-form-item>
             <el-form-item>
              <el-button type="primary" @click="doSubmit(loginFormSetting)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <!-- 外观配置 -->
      <el-tab-pane label="外观" name="second">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>外观配置</h3>
          </div>
          <el-form label-width="150px" :model="themeFormSetting">
            <el-form-item label="产品标题">
              <el-input v-model="themeFormSetting.productname"></el-input>
            </el-form-item>
            <el-form-item label="产品logo">
              <image-upload v-model="themeFormSetting.logo" :limit="1" />
            </el-form-item>
            <el-form-item label="默认布局">
                <el-select v-model="themeFormSetting.defaultLayout" placeholder="请选择"  style="width: 100%;">
                  <el-option
                    v-for="item in layouts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认主题">
              <div class="tag-group" style="margin-top:7px">
                <el-tooltip effect="dark" :content="item.key" placement="top-start" v-for="(item, index) in colorList" :key="index">
                  <el-tag :color="item.color" class="themeColorTag" @click="themeFormSetting.defaultTheme = item.color">
                    <i class="el-icon-check themeColorFont" v-if="item.color === themeFormSetting.defaultTheme"></i>
                  </el-tag>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="首页地址">
                <el-input v-model="themeFormSetting.homeUrl"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSubmit(themeFormSetting)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <!-- 短信配置 -->
      <el-tab-pane label="短信" name="third">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>阿里大鱼短信配置(<a href="https://dayu.aliyun.com" target="_blank">官网</a>)</h3>
          </div>
          <el-form label-width="150px" :model="smsFormSetting">
            <el-form-item label="accessKeyId" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="smsFormSetting.accessKeyId" placeholder="此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)"></el-input>
            </el-form-item>
            <el-form-item label="accessKeySecret" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="smsFormSetting.accessKeySecret" placeholder="此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)"></el-input>
            </el-form-item>
            <el-form-item label="短信签名" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="smsFormSetting.signature" placeholder="必填:短信签名-可在短信控制台中找到"></el-input>
            </el-form-item>
            <el-form-item label="短信模板" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="smsFormSetting.templateCode" placeholder="必填:短信模板编号-可在短信控制台中找到"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSubmit(smsFormSetting)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="邮箱" name="fourth">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>发件人账户</h3>
          </div>
           <el-form label-width="150px" :model="emailFormSetting">
            <el-form-item label="邮箱服务器地址" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="emailFormSetting.smtp" placeholder="此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)"></el-input>
            </el-form-item>
            <el-form-item label="邮箱服务器端口" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="emailFormSetting.port" placeholder="此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)"></el-input>
            </el-form-item>
            <el-form-item label="系统邮箱地址" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="emailFormSetting.mailName" placeholder="必填:短信签名-可在短信控制台中找到"></el-input>
            </el-form-item>
            <el-form-item label="系统邮箱密码" :rules="[
                    {required: true, message:'必填项不能为空', trigger:'blur'}
                   ]">
              <el-input v-model="emailFormSetting.mailPassword" placeholder="必填:短信模板编号-可在短信控制台中找到"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSubmit(emailFormSetting)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <!-- 关于我们 -->
      <el-tab-pane label="关于我们" name="fifth">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>关于我们</h3>
          </div>
          <el-form label-width="150px" :model="hereto">
            <el-form-item label="标题">
              <el-input v-model="hereto.productname"></el-input>
            </el-form-item>
            <el-form-item label="logo">
              <image-upload v-model="hereto.logo" :limit="1" />
            </el-form-item>
            <el-form-item label="官方邮箱">
              <el-input v-model="hereto.defaultlayout"></el-input>
            </el-form-item>
            <el-form-item label="服务热线">
              <el-input v-model="hereto.defaulttheme"></el-input>
            </el-form-item>
            <el-form-item label="官网地址">
                <el-input v-model="hereto.homeUrl"></el-input>
            </el-form-item>
            <el-form-item label="客服微信">
              <image-upload v-model="hereto.smtp" :limit="1" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="hereto.port"></el-input>
            </el-form-item>
            <el-form-item label="客服QQ">
              <el-input v-model="hereto.mailname"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSubmit(hereto)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <!-- 安卓更新配置 -->
      <el-tab-pane label="安卓更新" name="sixth">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>安卓更新</h3>
          </div>
          <el-form label-width="150px" :model="appInfo">
            <el-form-item label="版本名(浮点)">
              <el-input v-model="appInfo.productname" placeholder="请填写版本名(浮点)"></el-input>
            </el-form-item>
            <el-form-item label="下载地址">
              <el-input v-model="appInfo.defaultlayout" placeholder="请填写下载地址"></el-input>
            </el-form-item>
            <el-form-item label="版本说明">
              <el-input v-model="appInfo.defaulttheme" placeholder="请填写版本说明"></el-input>
            </el-form-item>
            <el-form-item label="版本号(整数)">
              <el-input v-model="appInfo.smtp" placeholder="请填写版本号(整数)"/>
            </el-form-item>
            <el-form-item label="强制更新">
              <el-radio-group v-model="appInfo.singlelogintype">
                <el-radio label="N">否</el-radio>
                <el-radio label="Y">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSubmit(appInfo)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {queryById,getAllocation,updateAllocation} from '@/api/system/allocation.js'
  export default {
    data () {
      return {
        activeName: 'first',
        loginFormSetting: {
          multiaccountlogin: '0',
          singlelogintype: '1'
        },
        themeFormSetting: {
          defaultTheme: '#1890FF',
          productname: '',
          logo: '',
          defaultLayout: '',
          homeUrl: ''
        },
        // 关于 我们
        hereto: {},
        // app信息
        appInfo: {},
        smsFormSetting: {
          accessKeyId: '',
          accessKeySecret: '',
          signature: '',
          templateCode: ''
        },
        emailFormSetting: {
          smtp: '',
          port: '',
          mailName: '',
          mailPassword: ''
        },
        colorList: [
          {
            key: '拂晓蓝（默认）', color: '#1890FF'
          },
          {
            key: '薄暮', color: '#F5222D', label: '1'
          },
          {
            key: '火山', color: '#FA541C', label: '2'
          },
          {
            key: '日暮', color: '#FAAD14'
          },
          {
            key: '明青', color: '#13C2C2'
          },
          {
            key: '极光绿', color: '#52C41A'
          },
          {
            key: '极客蓝', color: '#2F54EB'
          },
          {
            key: '酱紫', color: '#722ED1'
          },
          {
            key: '天空蓝', color: '#3e8df7'
          },
          {
            key: '咖啡色', color: '#9a7b71'
          },
          {
            key: '深湖蓝', color: '#07b2d3'
          },
          {
            key: '原谅绿', color: '#0cc26c'
          },
          {
            key: '古铜灰', color: '#757575'
          },
          {
            key: '珊瑚紫', color: '#6779fa'
          },
          {
            key: '橙黄', color: '#eb6607'
          },
          {
            key: '粉红', color: '#f74584'
          },
          {
            key: '青紫', color: '#9463f7'
          },
          {
            key: '橄榄绿', color: '#16b2a3'
          }
        ],
        layouts: [
          {label: '横向菜单', value: 'top'},
          {label: '左侧菜单', value: 'left'}
        ]
      }
    },
    created () {
      queryById().then(res => {
        this.loginFormSetting = res.config
        this.themeFormSetting = res.config
        this.smsFormSetting = res.config
        this.emailFormSetting = res.config
      })
    },
    methods: {
      doSubmit (form) {
        updateAllocation(form).then(res => {
          this.$message.success(res.msg)
          localStorage.setItem('defaultLayout', res.config.defaultLayout)
          localStorage.setItem('defaultTheme', res.config.defaultTheme)
          this.$events.$emit('updateTheme', res.config.defaultTheme)
          this.$store.commit('config/updateConfig', res.config)
        })
      },
      change() {
        if (this.activeName == 'fifth') {
          getAllocation(2).then(res => {
            this.hereto = res.data
          })
        } else if (this.activeName == 'sixth') {
          getAllocation(3).then(res => {
            this.appInfo = res.data
          })
        }
      }
    }
  }
</script>
<style>
.themeColorTag{
  width:25px !important;
  height:25px !important;
}
 .themeColorTag.el-tag + .el-tag {
    margin-left: 5px;
    margin-bottom: 0px;
}
.themeColorFont{
  position: absolute;
  color: #fff;
  margin-top: 3px;
  margin-left: -6px;
  font-weight: bold;
  font-size: 16px;
}
</style>
