<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="box-card" shadow="hover">
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchModel.username" placeholder="用户名"></el-input>
          <el-input v-model="searchModel.password" placeholder="电话"></el-input>
          <el-button @click="getUserList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle/>
        </el-col>
      </el-row>
    </el-card>

    <!--表格-->
    <el-card class="box-card" shadow="hover">
      <el-table :data="userList" height="500" style="width: 100%">
        <el-table-column prop="id" label="用户Id" width="200" align="center"/>
        <el-table-column prop="username" label="用户名" width="200" align="center"/>
        <el-table-column prop="phone" label="电话" width="200" align="center"/>
        <el-table-column prop="status" label="用户状态" width="200" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" align="center"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="pageTotal"
                     pager-count="5" v-model:current-page="searchModel.pageNo"/>

    </el-card>

    <!-- 表格 -->
    <el-dialog @close="closeForm" :title="formTitle" width="30%" center :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名:" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="showPassword" label="密码:" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import userAPI from '@/api/userManager.js'

export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'));
      }
      callback();
    };
    return {
      pageTotal: 10,
      searchModel: {
        pageNo: 1,
        username: "",
        phone: ""
      },
      userList: [],
      dialogFormVisible: false,
      form: {
        username: "",
        password: "",
        phone: "",
        email: "",
        status: 1,
      },
      formLabelWidth: '28%',
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入电子邮件', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
      },
      formTitle: "",
      showPassword: null,

    }
  },
  methods: {
    getUserList() {
      userAPI.getUserList(this.searchModel).then(response => {
        this.userList = response.data.rows
        this.pageTotal = response.data.total / 10 * 10
        // alert(this.pageTotal);
      });
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getUserList()
    },
    addUser() {
      //表单验证
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          //发送数据
          userAPI.addUser(this.form).then(response => {
            this.form = {},
              this.dialogFormVisible = false
            this.getUserList()
          })
          //成功提示
          this.$message({
            message: '新增用户成功',
            type: 'success'
          });
        } else {
          return false;
        }
      })
    },
    closeForm() {
      this.dialogFormVisible = false
      this.form = {}
      this.$refs.userFormRef.clearValidate()
    },
    updateUser() {
      //表单验证
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          //发送数据
          userAPI.updateUser(this.form).then(response => {
            this.form = {},
              this.dialogFormVisible = false
            this.getUserList()
          })
          //成功提示
          this.$message({
            message: '修改用户成功',
            type: 'success'
          });
        } else {
          return false;
        }
      })
    },
    openEditUI(id) {
      if (id != null) {
        this.formTitle = "修改用户"
        this.showPassword = false
        userAPI.getUserById(id).then(response => {
          this.form = response.data;
        });
      } else {
        this.formTitle = "新增用户"
        this.showPassword = true
      }
      this.dialogFormVisible = true
    },
    submitForm() {
      if (this.showPassword) {
        this.addUser()
      } else {
        this.updateUser()
      }
    },
    deleteUser(user) {
      this.$confirm('确认删除用户' + user.username, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userAPI.deletedUser(user.id).then(response => {
          this.$message({
            message: "删除用户" + user.username + "成功",
            type: 'success'
          });
          this.getUserList()
        })
      });
    },

  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style>
/* .item {
    padding: 18px 0;
}*/

.box-card .el-input {
  margin-right: 1%;
  width: 200px;
}

@media screen and (min-width: 220px) and (max-width:600px) {
  .el-dialog{
    width: 90% !important;
  }
}

</style>
