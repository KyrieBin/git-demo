<template>
    <div>
        <router-view>
            
        </router-view>
    </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from "@/store/modules/setting";
import { watch, ref } from "vue";
let LayoutSettingStore = useLayoutSettingStore();

let flag = ref(true);

watch(() => LayoutSettingStore.refresh, () => {
    flag.value = false
})
</script>

<style scoped lang="scss">
    div{
        widows: 100%;
        height: 100%;
        
    }
</style>