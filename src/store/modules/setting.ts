// 用户信息相关小仓库
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,   //菜单是否折叠状态,
            refresh: false
        }
    }
})

export default useLayoutSettingStore