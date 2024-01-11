<template>
  <div>
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <el-table :data="list" style="width: 100%">
      <el-table-column prop="name" label="单位名称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="updateShow(scope.row)">
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

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />

  <!-- 添加的弹出框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="单位名称">
        <el-input v-model="productUnit.name" />
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
  QueryPage,
  Save,
  Update,
  RemoveById,
  QueryById,
} from '@/api/basicData/productUnit'
import { ElMessage, ElMessageBox } from 'element-plus'
// 定义表格数据模型
const list = ref([])

onMounted(() => {
  showPage()
})

/* 删除 */
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
  let { code, message } = await RemoveById(id)
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
  name: '',
}
const productUnit = ref(JSON.parse(JSON.stringify(defaultForm)))
//进入添加
const addShow = () => {
  dialogVisible.value = true
  dialogTitle.value = '添加'
}
const save = async () => {
  let { code, message } = await Save(productUnit.value)
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
const updateShow = async row => {
  // let { code, data, message } = await QueryMenu(id)
  dialogTitle.value = '修改'
  productUnit.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

const update = async () => {
  // debugger
  let { code, message } = await Update(productUnit.value)
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
  if (!productUnit.value.id) {
    save(row)
  } else {
    update()
  }
}

const dialogClose = () => {
  dialogVisible.value = false
  productUnit.value = JSON.parse(JSON.stringify(defaultForm))
}
/* 分页查询 */
//分页数据
const pageParamsForm = {
  page: 1, // 页码
  limit: 10, // 每页记录数
}
const pageParams = ref(pageParamsForm)

const total = ref(0)

const showPage = () => {
  fetchData()
}

const fetchData = async () => {
  let { message, code, data } = await QueryPage(
    pageParams.value.page,
    pageParams.value.limit
  )
  if (code == 200) {
    list.value = data.list
    total.value = data.total
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
