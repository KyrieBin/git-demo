<template>
    <div>
        <el-card class="box-card">
            <!-- 卡片顶部按钮 -->
            <el-button type="primary" icon="Plus" @click="addBrand">添加品牌</el-button>
            <el-table :data="arr" style="width: 100%; margin: 10px 0;" border>
                <el-table-column prop="" type="index" label="序号" width="180" align="center" />
                <el-table-column prop="tmName" label="品牌名称" width="180" />
                <el-table-column prop="" label="品牌logo">
                    <template #default="{ row, column, $index }">
                        <img style="width: 100px;" :src="row.logoUrl" alt="暂无图片">
                    </template>
                </el-table-column>
                <el-table-column prop="" label="品牌操作">
                    <template #default="{ row }">
                        <el-button type="warning" small="small" @click="compile(row)" icon="Edit"></el-button>
                        <el-button type="danger" icon="Delete" @click="brandDelete(row, $index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination ref="fenye" :total="total" @changePage="Pinpai"></Pagination>
        </el-card>

        <!-- current-page  当前高亮的页码数 -->

        <!-- 弹出框 -->
        <el-dialog v-model="dialogFormVisible" :title="flag ? '添加品牌' : '修改品牌'">
            <el-form :model="formBrand" :rules="rules" ref="ruleFormRef">
                <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
                    <el-input v-model="formBrand.tmName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="品牌LOGO" :label-width="formLabelWidth">
                    <el-upload :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader"
                        action="/api/admin/product/fileUpload" :show-file-list="false">
                        <img v-if="formBrand.logoUrl" :src="formBrand.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirm(ruleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
 
<script setup lang="ts">
import api from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import Pagination from '@/components/Pagination'
import { ref, reactive, onMounted } from 'vue';

// 定义总页码数 
let total = ref(0);

// 定义表格数据
let arr = ref([]);


// 获取列表接口数据
const Pinpai = async (a = 1, b: any) => {
    let he = a;
    let res = await api.getPagination(he, b);
    console.log('品牌列表数据-----------------', res);
    if (res.code === 200) {
        total.value = res.data.total;
        arr.value = res.data.records;
    }
}

// 收集弹出框数据
let formBrand = reactive({
    tmName: '',
    logoUrl: ''
})

// 弹出框左上角字的不同显示
let flag = ref(true);

// 添加/修改 弹出框
const dialogFormVisible = ref(false);

// 添加品牌 
const addBrand = () => {
    dialogFormVisible.value = true;  //显示弹出框

    flag.value = true   //弹出框左上角文字为添加

    // formBrand.tmName = ''  //清空弹出框表单数据

    // formBrand.logoUrl = ''  //清空弹出框表单数据

    Object.assign(formBrand, {  //合并对象，后者会复制到前者，并且返回前者
        tmName: '',
        logoUrl: '',
        id: ''
    })
}

// 输入框左侧字的宽度
const formLabelWidth = '140px'

// 图片上传逻辑
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile
) => {
    // formBrand.logoUrl.value = URL.createObjectURL(uploadFile.raw!)
    formBrand.logoUrl = response.data;
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('文件类型不能为jpeg')
        return false
        // rawFile.size  字节  1kb = 1024字节   1M = 1024kb  
    } else if (rawFile.size / 1024 / 1024 > 4) {
        ElMessage.error('文件大小必须小于4M')
        return false
    }
    return true

}

// 确定按钮
const confirm = async (ruleFormRef) => {
    // 校验输入框规则
    if (!ruleFormRef) return
    ruleFormRef.validate((valid) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
            return
        }
    })
    // 修改
    if (!flag.value) {
        let res = await api.getAddTrand(formBrand);
        if (res.code === 200) {
            dialogFormVisible.value = false
            ElMessage({
                type: 'success',
                message: '修改成功！'
            })
            fenye.value.handleCurrentChange()
        } else {
            console.log('修改失败');
        }
    }
    //添加
    else {
        let res = await api.getAddTrand(formBrand);
        if (res.code === 200) {
            dialogFormVisible.value = false
            ElMessage({
                type: 'success',
                message: '添加成功！'
            })
            Pinpai(1, fenye.value.limit)
            fenye.value.currentPage = 1;
        }
    }
}

let fenye = ref();





// 编辑商品
const compile = (row: any) => {
    flag.value = false

    dialogFormVisible.value = true;

    formBrand.tmName = row.tmName;

    formBrand.logoUrl = row.logoUrl;

    formBrand.id = row.id;
}

// 拿到form表单
const ruleFormRef = ref()

// 弹出框表单校验  自定义校验
const validatePass = (rule, value, callBack) => {
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('输入不能少于2个字符'))
    }
}

const rules = {
    tmName: [{ required: true, validator: validatePass, trigger: 'blur' }],
}




// 删除
const brandDelete = (row: any, index: any) => {
    ElMessageBox.confirm(
        '确定要删除吗?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await api.getBrandDelete(row.id);
        console.log('删除------------', res);
        fenye.value.handleCurrentChange()
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除',
        })
    })

}



</script>

<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}



/* 图片上传 */
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader {
    border: 1px dashed #e8e8e8;
}

.avatar-uploader .el-upload {
    border: 1px dashed #efefef !important;
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