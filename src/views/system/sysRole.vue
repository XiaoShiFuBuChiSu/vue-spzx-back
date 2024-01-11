import { dataType } from 'element-plus/es/components/table-v2/src/common';
import list from '@/i18n/locales/en/test/list'; import list from
'@/i18n/locales/en/test/list'; import { dataType } from
'element-plus/es/components/table-v2/src/common'; import { valueEquals } from
'element-plus'; import { onMounted } from 'vue';
<template>
  <div>
    <div class="search-div">
      <!-- 搜索表单 -->
      <el-form label-width="70px" size="small">
        <el-form-item label="角色名称">
          <el-input
            style="width: 100%"
            placeholder="角色名称"
            v-model="queryDto.roleName"
          ></el-input>
        </el-form-item>
        <el-row style="display:flex">
          <el-button type="primary" size="small" @click="searchSysRole">
            搜索
          </el-button>
          <el-button size="small" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="showDialog">
        添 加
      </el-button>
    </div>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="showUpdate(scope.row)">
          修改
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="removeCheck(scope.row.id)"
        >
          删除
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="showAssignMenu(scope.row)"
        >
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />

    <!-- 添加角色表单对话框 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdate">提交</el-button>
          <el-button @click="closeDialog()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

  <!-- 分配菜单的对话框  -->
  <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
    <el-form label-width="80px">
      <el-form-item label="角色名">
        <el-input disabled :value="sysRole.roleName"></el-input>
      </el-form-item>
      <el-tree
        ref="treeRef"
        :data="sysMenuTreeList"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps"
        :check-on-click-node="true"
      />
      <el-form-item>
        <el-button type="primary" @click="assignRoleMenu">提交</el-button>
        <el-button @click="dialogMenuVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  QueryPage,
  QueryRole,
  SaveRole,
  UpdateRole,
  RemoveRole,
} from '@/api/system/sysRole'
import { GetRoleMenuTree, saveRoleMenuTree } from '@/api/system/sysMenu'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  searchSysRole()
})

/* 分配菜单 */
//分配菜单
const defaultProps = {
  children: 'children',
  label: 'title',
}
const dialogMenuVisible = ref(false)
const sysMenuTreeList = ref([])
const treeRef = ref()
// 显示菜单树弹出层
const showAssignMenu = async row => {
  dialogMenuVisible.value = true
  sysRole.value = row
  showMenuTree(row.id)
}
// 显示角色已选择的菜单树
const showMenuTree = async roleId => {
  let { message, data, code } = await GetRoleMenuTree(roleId)
  if (code == 200) {
    sysMenuTreeList.value = data.menuTree
    treeRef.value.setCheckedKeys(data.menusInRole)
  } else {
    ElMessage.error(message)
  }
}

// 修改已选择的菜单
const assignRoleMenu = async () => {
  const checkedNodes = treeRef.value.getCheckedNodes() // 获取选中的节点
  const checkedNodesIds = checkedNodes.map(node => {
    // 获取选中的节点的id
    return {
      menuId: node.id,
      isHalf: 0,
    }
  })

  // 获取半选中的节点数据，当一个节点的子节点被部分选中时，该节点会呈现出半选中的状态
  const halfCheckedNodes = treeRef.value.getHalfCheckedNodes()
  const halfCheckedNodesIds = halfCheckedNodes.map(node => {
    // 获取半选中节点的id
    return {
      menuId: node.id,
      isHalf: 1,
    }
  })

  // 将选中的节点id和半选中的节点的id进行合并
  const menuIds = [...checkedNodesIds, ...halfCheckedNodesIds]

  // 构建请求数据
  const assignMenuDto = {
    roleId: sysRole.value.id,
    menuIdList: menuIds,
  }

  let { message, code } = await saveRoleMenuTree(assignMenuDto)
  if (code == 200) {
    ElMessage.success(message)
  } else {
    ElMessage.error(message)
  }

  dialogMenuVisible.value = false
}
// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([])

const defaultPageParams = {
  page: 1,
  limit: 10,
}

let pageParams = ref(defaultPageParams)

let queryDto = ref({
  roleName: '',
})

const fetchData = async () => {
  let { code, message, data } = await QueryPage(
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

const resetData = () => {
  queryDto.value.roleName = ''
  fetchData()
}

const searchSysRole = () => {
  fetchData()
}

let dialogVisible = ref(false)

let sysRole = ref({})

const saveOrUpdate = () => {
  if (!sysRole.value.id) {
    save()
  } else {
    update()
  }
  // 重置
  sysRole.value = {}
}

const save = async () => {
  let { code, message } = await SaveRole(sysRole.value)
  if (code == 200) {
    // 是否继续添加
    ElMessageBox.confirm('是否继续添加', '添加成功', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'success',
    }).catch(() => {
      fetchData()
      dialogVisible.value = false
    })
  } else {
    ElMessage.error(message)
  }
}

const showUpdate = async row => {
  showDialog()
  let { code, data, message } = await QueryRole(row.id)
  if (code == 200) {
    sysRole.value = data
  } else {
    ElMessage.error(message)
  }
}

const update = async () => {
  // debugger
  console.log(sysRole)
  let { code, message } = await UpdateRole(sysRole.value)
  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('修改成功')
    fetchData()
  } else {
    ElMessage.error(message)
  }
}

const closeDialog = () => {
  dialogVisible.value = false
  sysRole.value = {}
}

const showDialog = () => {
  sysRole.value = {}
  dialogVisible.value = true
}

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
  let { code, message } = await RemoveRole(id)
  if (code == 200) {
    ElMessage.success('删除成功')
    fetchData()
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
