<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="关键字">
            <el-input
              style="width: 100%"
              placeholder="用户名、姓名、手机号码"
              v-model="queryDto.keyWord"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              v-model="dateArr"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysUser">
          搜索
        </el-button>
        <el-button size="small" @click="resetSysUser">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <!---数据表格-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="updateShow(scope.row.id)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="removeCheck(scope.row.id)">
        删除
      </el-button>
      <el-button
        type="warning"
        size="small"
        @click="showAssignedRole(scope.row)"
      >
        分配角色
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />

  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="sysUser.username" />
      </el-form-item>
      <el-form-item label="密码" v-if="!sysUser.id">
        <el-input v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input disabled :value="sysUser.username"></el-input>
      </el-form-item>

      <el-form-item label="角色列表">
        <el-checkbox-group v-model="userRoleIds">
          <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitUserRoles()">提交</el-button>
        <el-button @click="closeRoleDialog()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  QueryPage,
  QueryUser,
  SaveUser,
  UpdateUser,
  RemoveUser,
} from '@/api/system/sysUser'
import { GetAssignedRole, AssignRole } from '@/api/system/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'

onMounted(() => {
  searchSysUser()
})
/* 分配角色 */
const userRoleIds = ref([])
const allRoles = ref([])
const dialogRoleVisible = ref(false)
const showAssignedRole = async row => {
  sysUser.value = row
  dialogRoleVisible.value = true
  let { message, code, data } = await GetAssignedRole(row.id)
  if (+code === 200) {
    userRoleIds.value = data.userRoleIds
    allRoles.value = data.allRoles
  } else {
    ElMessage.error(message)
  }
}

const closeRoleDialog = () => {
  dialogRoleVisible.value = false
  userRoleIds.value = []
  allRoles.value = []
  sysUser.value = {}
}

const submitUserRoles = async () => {
  const assignRoleDto = {
    userId: sysUser.value.id,
    roleIds: userRoleIds.value,
  }
  let { code, message } = await AssignRole(assignRoleDto)
  if (code == 200) {
    ElMessage.success('用户分配成功')
  } else {
    ElMessage.error(message)
  }
  closeRoleDialog()
}

/* 文件上传 */
// 请求头中设置token
let headers = {
  token: useApp().authorization.token,
}

const handleAvatarSuccess = (res, uploadFile) => {
  if (+res.code === 200) {
    sysUser.value.avatar = res.data
  } else {
    ElMessage.error(res.message)
  }
}

/* 用户删除相关 */
const removeCheck = id => {
  ElMessageBox.confirm('是否确认删除', '删除', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning',
  }).then(() => {
    remove(id)
  })
}

const remove = async id => {
  let { code, message } = await RemoveUser(id)
  if (code == 200) {
    ElMessage.success('删除成功')
    fetchData()
  } else {
    ElMessage.error(message)
  }
}
/* 用户添加修改相关 */
let dialogVisible = ref(false)
let sysUser = ref({
  username: '',
  password: '',
  name: '',
  phone: '',
  avatar: '',
  description: '',
})
/* 添加 */
const addShow = () => {
  dialogVisible.value = true
}

const save = async () => {
  let { code, message } = await SaveUser(sysUser.value)
  if (code == 200) {
    // 是否继续添加
    ElMessageBox.confirm('是否继续添加', '添加成功', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'success',
    }).catch(() => {
      dialogVisible.value = false
    })
  } else {
    ElMessage.error(message)
  }
}
/* 修改 */
const updateShow = async id => {
  let { code, data, message } = await QueryUser(id)
  if (code == 200) {
    sysUser.value = data
  } else {
    ElMessage.error(message)
  }
  dialogVisible.value = true
}

const update = async () => {
  // debugger
  console.log(sysUser)
  let { code, message } = await UpdateUser(sysUser.value)
  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('修改成功')
  } else {
    ElMessage.error(message)
  }
}

/* 提交 */
const saveOrUpdate = () => {
  if (!sysUser.value.id) {
    save()
  } else {
    update()
  }
  // 刷新
  fetchData()
  // 重置
  sysUser.value = {}
}

const dialogClose = () => {
  dialogVisible.value = false
  sysUser.value = {}
}

/* 分页查询相关 */
// 表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

// 关键字
let queryDto = ref({
  keyWord: '',
  beginTime: '',
  endTime: '',
})

const defaultPageParams = {
  page: 1,
  limit: 10,
}

let pageParams = ref(defaultPageParams)

let dateArr = ref([])

const fetchData = async () => {
  if (dateArr.value.length == 2) {
    queryDto.value.beginTime = dateArr.value[0]
    queryDto.value.endTime = dateArr.value[1]
  }
  console.log(dateArr.value)
  console.log(queryDto.value)
  let { code, data, message } = await QueryPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  if (code == 200) {
    list.value = data.list
    total.value = data.total
  } else {
    ElMessage.error(message)
  }
}

const searchSysUser = () => {
  fetchData()
}

const resetSysUser = () => {
  queryDto.value = {}
  dateArr.value = []
  fetchData()
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
