<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{ Fold: LayOutSettingStore.fold}">
            <Logo></Logo>
            <!-- <el-scrollbar> -->
            <el-menu collapse-transition :collapse="LayOutSettingStore.fold" unique-opened router active-text-color="red"
                background-color="#000" class="el-menu-vertical-demo" :default-active="$route.path" text-color="#fff">
                <Menu :menuStore="userStore.menuRoutes"></Menu>
            </el-menu>
            <!-- </el-scrollbar> --> 
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ TFold: LayOutSettingStore.fold}">
            <!-- layout组件的顶部导航Tabbar -->
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示区域 -->
        <div class="layout_main" :class="{ TFold: LayOutSettingStore.fold}">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang="ts">
// 获取仓库中的导航
import useUserStore from '@/store/modules/user'
let userStore = useUserStore();
import useLayoutSettingStore from '@/store/modules/setting';
let LayOutSettingStore = useLayoutSettingStore();

//获取路由对象
import { useRoute, useRouter } from 'vue-router'

let $route = useRoute();



import Logo from './Logo/index.vue'

import Menu from './Menu/index.vue'

import Main from './Main/index.vue'

import Tabbar from './Tabber/index.vue'
</script>
<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100vh;
        overflow: hidden;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);

            .el-menu {
                border-right: none;
            }
        }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;

        &.fold {
            width: calc(100vw - $base-menu-min-width );
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
        border-top: 1px solid #efefef;

        &.fold {
            width: calc(100vw - $base-menu-min-width );
            left: $base-menu-min-width;
        }

    }
}
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

.el-menu {
    border: none;
}

.Fold {
    width: 50px !important;
}

.TFold {
    width: calc(100% - 50px) !important;
    left: 50px !important;
}</style>