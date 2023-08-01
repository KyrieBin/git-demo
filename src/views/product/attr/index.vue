<template>
    <div>
        <!-- 三级分类组件 -->
        <Category :jinyong="addShow"></Category>

        <el-card style="margin:10px 0px 0">
            <div v-show="addShow">
                <el-button :disabled="CategoryStore.threeId ? false : true" @click="addAttr" type="primary" size="default"
                    icon="Plus">添加属性</el-button>
                <el-table border style="margin:10px 0px" :data="Attr" v-show="CategoryStore.threeId">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值">
                        <template #default="{ row }">
                            <el-tag v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row, $index }">
                            <el-button size="small" @click="handleEdit(row, index)">修改</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(row, $index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!addShow">
                <!-- 展示添加属性与修改数据的结构 -->
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input ref="main" placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>

                <el-button @click="addAttrValue" :disabled="attrParams.attrName.trim() ? false : true" type="primary"
                    size="default" icon="Plus">添加属性值</el-button>

                <el-button type="primary" size="default" @click="cancel">取消</el-button>

                <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <!-- row:即为当前属性值对象 -->
                        <template #default="{ row, $index }">
                            <el-input :ref="(e) => InputAll[$index] = e" v-show="row.flag" size="small"
                                @blur="shiqu(row, $index)" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
                            <p v-show="!row.flag" @click="bianhui(row, $index)">{{ row.valueName }}</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="属性值操作">
                        <template #default="{ row, $index }">
                            <el-button type="primary" size="small" icon="Delete" @click="deleteAn(row, $index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="save">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { ElMessage } from 'element-plus';

import { nextTick, reactive, ref, watch } from 'vue';

import useCategoryStore from '@/store/modules/category'

let CategoryStore = useCategoryStore();

// let sasa = ref();

// 动态设置添加属性模块的显示隐藏切换
let addShow = ref<boolean>(true);

// 收集表格数据
let Attr = ref([]);

// 监听三级分类id， 发送请求获取列表
watch(() => CategoryStore.threeId, () => {
    // 三级分类有或者没有，没有也会触发，所以需要判断
    if (!CategoryStore.threeId) {
        Attr.value = [];
        return
    }
    getShop();
})

// 获取分类商品属性接口
const getShop = async () => {
    let res = await api.getShopClassify(CategoryStore.oneId, CategoryStore.twoId, CategoryStore.threeId);
    console.log('商品属性与属性值', res);
    if (res.code === 200) {
        Attr.value = res.data
    }
}

// 添加属性按钮
const addAttr = () => {
    // 切换到添加属性模块
    addShow.value = false,
        // 收集当前要添加到哪个三级分类的id
        attrParams.CategoryId = CategoryStore.threeId
}


// 修改按钮
const handleEdit = (row, index) => {
    addShow.value = false
    Object.assign(attrParams, row)

}

// 删除属性按钮
const handleDelete = (row, index) => {
    getDeleteShop(row)
}

// 删除商品属性接口
const getDeleteShop = async (row) => {
    let res = await api.getDeleteShop(row.id);
    console.log('删除商品属性', res.data);
    if (res.code === 200) {
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
        getShop();
    }
}

// 收集添加属性参数
let attrParams = reactive({
    attrName: '',  //属性名
    attrValueList: [],  //属性值数组
    CategoryId: '',
    CategoryLevel: 3
})

const main = ref(null);


// 点击添加属性值按钮
const addAttrValue = () => {
    let obj = {
        valueName: '',
        flag: true
    }
    attrParams.attrValueList.push(obj);

    // 让最后一个input框聚焦
    nextTick(() => {
        InputAll[attrParams.attrValueList.length - 1].focus();
    })
}

// 取消属性值按钮
const cancel = () => {
    addShow.value = true
    Object.assign(attrParams, {  // es6新增方法 可以用来合并对象
        attrName: '',
        attrValueList: [],
        CategoryId: '',
        CategoryLevel: 3
    })
}

// 保存属性名按钮
let save = () => {
    getSaveInfo()
}

// 获取接口
const getSaveInfo = async () => {
    let res = await api.getSaveInfo(attrParams);
    console.log('添加属性值---------------', res);
    if (res.code === 200) {
        addShow.value = true;

        ElMessage({
            message: attrParams.id ? '修改成功' : '添加成功',
            type: 'success',
        })
        Object.assign(attrParams, {  // es6新增方法 可以用来合并对象
            attrName: '',
            attrValueList: [],
            CategoryId: '',
            CategoryLevel: 3
        })

        setTimeout(() => {
            getShop();
        }, 1000)

    } else {
        ElMessage({
            message: attrParams.id ? '修改失败' : '添加失败',
            type: 'warning',
        })
    }
}


// 删除属性值按钮
const deleteAn = (row, index) => {
    attrParams.attrValueList.splice(index, 1)
}


// 属性值input框失去焦点
const shiqu = (row, index) => {
    if (row.valueName.trim() === '') {
        alert('属性值不能为空')
        // 不符合要求就删除当前行
        attrParams.attrValueList.splice(index, 1)
        return
    }
    row.flag = false
}

const bianhui = (row, index) => {
    row.flag = true
    nextTick(() => {
        InputAll[index].focus();
    })
}


let InputAll = reactive([])


</script>

<style scoped></style>