<template>
    <el-button size="small" icon="Refresh" @click="shuaxin" circle></el-button>
    <el-button size="small" icon="FullScreen" circle @click="quanping"></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
    <img :src=UserStore.avatar style="width: 24px;height: 24px;margin:0px 10px;border-radius: 50%;">
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ UserStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user';
import useLayoutSettingStore from '@/store/modules/setting';
import { ref } from 'vue';
const refreshY = useLayoutSettingStore();
let UserStore = useUserStore();
const shuaxin = () => {
    refreshY.refresh = true
}
let quan = ref(false);
const quanping = () => {
    const docElm = document.documentElement;
    if (!quan.value) {
        docElm.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
    quan.value = !quan.value
}

let $router = useRouter();
let $route = useRoute();
// 退出登录
const loginOut = async() => {
    await UserStore.exitLogin();
    $router.push({ path: '/login', query: { rediract: $route.path } });

}
</script>

<style scoped></style>