<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="box-card" shadow="hover">
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchModel.roleName" placeholder="角色名称"></el-input>
          <el-button @click="getRoleList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle/>
        </el-col>
      </el-row>
    </el-card>

    <!--表格-->
    <el-card class="box-card" shadow="hover">
      <el-table :data="roleList" height="500" style="width: 100%">
        <el-table-column prop="roleId" label="角色Id" width="200" align="center"/>
        <el-table-column prop="roleName" label="角色名称" width="200" align="center"/>
        <el-table-column prop="roleDesc" label="角色描述" width="200" align="center"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.roleName==='admin' || scope.row.roleName==='FangDaniu'"
                       @click="openEditUI(scope.row.roleId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button :disabled="scope.row.roleName==='admin' || scope.row.roleName==='FangDaniu'"
                       @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="pageTotal"
                     :pager-count=5 v-model:current-page="searchModel.pageNo"/>

    </el-card>

    <!-- 表格 -->
    <el-dialog @close="closeForm" :title="formTitle" width="30%" center :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">

        <el-form-item label="角色名称:" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色描述:" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色权限:" prop="menuIdList" :label-width="formLabelWidth">
          <el-tree show-checkbox :data="menuList" :props="menuProps" node-key="menuId" ref="menuRef"></el-tree>
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
import roleAPI from '@/api/roleManager.js'
import menuAPI from '@/api/menuManager.js'

export default {
  data() {
    return {
      pageTotal: 10,
      searchModel: {
        pageNo: 1,
        roleName: "",
      },
      roleList: [],
      dialogFormVisible: false,
      roleForm: {
        roleName: "",
        roleDesc: "",

      },
      formLabelWidth: '28%',
      rules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],

      },
      formTitle: "",
      menuProps: {
        children: 'children',
        label: 'title'
      },
      menuList: [],


    }
  },
  methods: {
    getRoleList() {
      roleAPI.getRoleList(this.searchModel).then(response => {
        this.roleList = response.data.rows
        this.pageTotal = response.data.total / 10 * 10
        // alert(this.pageTotal);
      });
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getRoleList()
    },
    saveRole() {
      //表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          this.updateMenuIdList();
          //发送数据
          roleAPI.saveRole(this.roleForm).then(response => {
            this.cleanForm();
            this.getRoleList()
          })
          //成功提示
          this.$message({
            message: '新增角色成功',
            type: 'success'
          });
        } else {
          return false;
        }
      })
    },
    closeForm() {
      this.cleanForm();
      this.$refs.roleFormRef.clearValidate()
    },
    cleanForm() {
      this.dialogFormVisible = false
      this.$refs.menuRef.setCheckedKeys([])
      this.roleForm = {}
    },
    updateRole() {
      //表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          this.updateMenuIdList();
          //发送数据
          roleAPI.updateRole(this.roleForm).then(response => {
            this.cleanForm();
            this.getRoleList()
          })
          //成功提示
          this.$message({
            message: '修改角色成功',
            type: 'success'
          });
        } else {
          return false;
        }
      })
    },
    openEditUI(id) {
      if (id != null) {
        this.formTitle = "修改角色"
        roleAPI.getRoleById(id).then(response => {
          this.roleForm = response.data;
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList)
          // console.log(response.data.menuIdList)
        });
      } else {
        this.formTitle = "新增角色"
      }
      this.dialogFormVisible = true
    },
    submitForm() {
      if (this.formTitle == "新增角色") {
        this.saveRole()
      } else {
        this.updateRole()
      }
    },
    deleteRole(role) {
      this.$confirm('确认删除角色' + role.roleName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleAPI.deletedRole(role.id).then(response => {
          this.$message({
            message: "删除角色" + role.roleName + "成功",
            type: 'success'
          });
          this.getRoleList()
        })
      });
    },
    getAllMenu() {
      menuAPI.getAllMenu().then(response => {
        this.menuList = response.data;
      })
    },
    updateMenuIdList() {
      let checkedKeys = this.$refs.menuRef.getCheckedKeys();
      let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();
      this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys);
    }


  },
  mounted() {
    this.getRoleList()
    this.getAllMenu()
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

@media screen and (min-width: 220px) and (max-width: 600px) {
  .el-dialog {
    width: 90% !important;
  }
}

</style>
