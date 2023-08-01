import type { RouteRecordRaw } from "vue-router"
// 定义小仓库数据state类型
export interface UserState {
    token: string | null,
    menuRoutes: RouteRecordRaw[],
    username: string,
    avatar: string,
    routesY: any
}

export interface categoryState {
    oneList: [],
    oneId: string | number,
    twoList: [],
    twoId: string,
    threeList: [],
    threeId: string,
    addFlag: boolean
}