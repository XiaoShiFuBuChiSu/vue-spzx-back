<template>
  <div>
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="title" label="菜单标题" />
      <el-table-column prop="component" label="路由名称" />
      <el-table-column prop="sortValue" label="排序" />
      <el-table-column prop="status" label="状态" #default="scope">
        {{ scope.row.status == 1 ? '正常' : '停用' }}
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="success" size="small" @click="addShow(scope.row)">
          添加下级节点
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="updateShow(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="removeCheck(scope.row.id)"
        >
          删除
        </el-button>
      </el-table-column>
    </el-table>
  </div>

  <!-- 添加的弹出框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="菜单标题">
        <el-input v-model="sysMenu.title" />
      </el-form-item>
      <el-form-item label="路由名称">
        <el-input v-model="sysMenu.component" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="sysMenu.sortValue" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="sysMenu.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  GetMenuTree,
  SaveMenu,
  UpdateMenu,
  RemoveMenu,
  QueryMenu,
} from '@/api/system/sysMenu'
import { ElMessage, ElMessageBox } from 'element-plus'
// 定义表格数据模型
const list = ref([])

onMounted(() => {
  showMenuTree()
})

/* 删除 */
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
  let { code, message } = await RemoveMenu(id)
  if (code == 200) {
    ElMessage.success('删除成功')
    fetchData()
  } else {
    ElMessage.error(message)
  }
}

/* 添加或修改 */
// 定义添加表单菜单表单相关数据模型
const dialogTitle = ref('添加')
const dialogVisible = ref(false)
const defaultForm = {
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1,
}
const sysMenu = ref(JSON.parse(JSON.stringify(defaultForm)))
//进入添加
const addShow = row => {
  if (row) {
    sysMenu.value.parentId = row.id
  }
  dialogVisible.value = true
  dialogTitle.value = '添加'
}
const save = async () => {
  let { code, message } = await SaveMenu(sysMenu.value)
  if (code == 200) {
    // 是否继续添加
    // ElMessageBox.confirm('是否继续添加', '添加成功', {
    //   confirmButtonText: '是',
    //   cancelButtonText: '否',
    //   type: 'success',
    // }).catch(() => {
    //   dialogVisible.value = false
    // })
    ElMessage.success('添加成功')
    fetchData()
    dialogClose()
  } else {
    ElMessage.error(message)
  }
}
/* 修改 */
const updateShow = async id => {
  let { code, data, message } = await QueryMenu(id)
  dialogTitle.value = '修改'
  if (code == 200) {
    sysMenu.value = data
  } else {
    ElMessage.error(message)
  }
  dialogVisible.value = true
}

const update = async () => {
  // debugger
  let { code, message } = await UpdateMenu(sysMenu.value)
  if (code == 200) {
    ElMessage.success('修改成功')
    fetchData()
    dialogClose()
  } else {
    ElMessage.error(message)
  }
}

/* 提交 */
const saveOrUpdate = row => {
  debugger
  if (!sysMenu.value.id) {
    save(row)
  } else {
    update()
  }
}

const dialogClose = () => {
  dialogVisible.value = false
  sysMenu.value = JSON.parse(JSON.stringify(defaultForm))
}
/* 查询树形菜单结果 */
const showMenuTree = () => {
  fetchData()
}

const fetchData = async () => {
  let { message, code, data } = await GetMenuTree()
  if (code == 200) {
    list.value = data
    // ElMessage.success()
  } else {
    ElMessage.error(message)
  }
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
