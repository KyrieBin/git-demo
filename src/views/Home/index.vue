<template>
    <div>
        我是首页
    </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { onMounted } from 'vue';
const userStore = useUserStore();
onMounted(() => {
    userStore.userInfo();
})
</script>

<style lang="scss" scoped></style>