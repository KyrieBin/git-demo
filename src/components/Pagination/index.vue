<!-- 分页器单独封装 父组件传递灵活数据  总页码、 -->
<template>
    <div>
        <el-pagination style="margin: 30px 0 10px" v-model:current-page="currentPage" v-model:page-size='limit'
            :page-sizes="[5, 10, 20]" background layout="total, sizes, prev, pager, next, jumper" :total="props.total"
            @current-change="handleCurrentChange" @size-change="changePages" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 一上来就获取品牌列表
onMounted(() => [
    $emit('changePage', currentPage.value, limit.value)
])

// 接收父组件数据
let props = defineProps(['total']);
let $emit = defineEmits(['changePage']);

let currentPage = ref(1);
let limit = ref(5);

const handleCurrentChange = () => {
    console.log('好累');

    $emit('changePage', currentPage.value, limit.value)
}

const changePages = () => {
    $emit('changePage', currentPage.value, limit.value)
}

defineExpose({ handleCurrentChange, currentPage, limit });
</script>

<style scoped></style>