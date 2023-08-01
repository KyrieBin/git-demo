<!-- 三级分类  单独封装成组件 数据放在了pinia上 ：  请求接口逻辑，存放数据都在pinia上 -->

<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.oneId" placeholder="请选择" @change="oneChange" :disabled="!props.jinyong">
                    <el-option v-for="item in categoryStore.oneList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.twoId" placeholder="请选择" @change="twoChange" :disabled="!props.jinyong">
                    <el-option v-for="item in categoryStore.twoList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.threeId" placeholder="请选择" @change="threeChange" :disabled="!props.jinyong">
                    <el-option v-for="item in categoryStore.threeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
// 引用pinia
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore();

let props = defineProps(['jinyong']);

// 一上来先获取一级分类列表
onMounted(async () => {
    categoryStore.first();
})

const oneChange = () => {
    categoryStore.twoId = ''
    categoryStore.twoList = []
    categoryStore.threeId = ''
    categoryStore.threeList = []
    categoryStore.second();
}
const twoChange = () => {
    categoryStore.threeId = ''
    categoryStore.threeList = []
    categoryStore.three();
}
const threeChange = () => {
    categoryStore.addFlag = false
}

// 组件销毁之前  清空选择框
onBeforeUnmount(() => {
    categoryStore.oneId = ''
    categoryStore.twoId = ''
    categoryStore.threeId = ''
    categoryStore.oneList = []
    categoryStore.twoList = []
    categoryStore.threeList = []
})

</script>

<style scoped></style>