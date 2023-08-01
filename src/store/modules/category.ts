// 商品分类id

import { defineStore } from "pinia";

import api from "@/api";

import { categoryState } from './type/types'

const useCategoryStore = defineStore('categoryStore', {
    state: (): categoryState => {  //小仓库数据类型
        return {
            oneList: [],   //一级分类列表
            oneId: '',  //一级分类id
            twoList: [],   //二级分类列表
            twoId: '',  //二级分类id
            threeList: [],   //三级分类列表
            threeId: '',   //三级分类id

            addFlag: true
        }
    },
    actions: {
        // 获取一级分类列表
        async first() {
            let res = await api.getOneClassify();
            console.log('商品一级分类', res.data);
            if (res.code === 200) {
                this.oneList = res.data;
            }
        },
        // 获取二级分类列表
        async second() {
            let res = await api.getTwoClassify(this.oneId);
            console.log('商品二级分类', res.data);
            if (res.code === 200) {
                this.twoList = res.data;
            }
        },
        // 获取三级分类列表
        async three() {
            let res = await api.getThreeClassify(this.twoId);
            console.log('商品三级分类', res.data);
            if (res.code === 200) {
                this.threeList = res.data;
            }
        }
    },
    getters: {

    }
})

export default useCategoryStore