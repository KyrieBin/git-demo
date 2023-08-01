<template>
    <template v-for="(item) in menuStore" :key="item.path">
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden">
                <el-icon>
                    <!-- 使用全局组件的另一种写法 -->
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>

                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <template v-if="item.children && item.children.length === 1">
            <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path">
                <el-icon>
                    <!-- 使用全局组件的另一种写法 -->
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon> 
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuStore="item.children"></Menu>
            <!-- <el-menu-item v-for="(items) in item.children" :key="items.path" :index="items.path">
                <el-icon>
                    <setting />
                </el-icon>
                <span>{{ items.meta.title }}</span>
            </el-menu-item> -->
        </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
defineProps(['menuStore'])

</script>
<script lang="ts">
export default {
    name: 'Menu'    //组件自己使用自己必须得有这个name属性
}
</script>

<style scoped lang="scss"></style>