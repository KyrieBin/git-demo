import axios from "./request";

// 引入封装好的ts类型
import type { loginFormData, loginResponseData } from "./type/user";

// 请求接口统一封装 
const api = {
    // 登录
    getLogin(data: any) {
        return axios.post<any, any>('/admin/acl/index/login', data);
    },
    // 用户信息
    getInfo() {
        return axios.get<any, any>('/admin/acl/index/info');
    },
    // 退出登录
    getLogout() {
        return axios.post<any, any>('/admin/acl/index/logout');
    },
    // 分页器
    getPagination(page: number, limit: number) {
        return axios.get<any, any>('/admin/product/baseTrademark/' + `${page}/${limit}`);
    },
    // 品牌的添加修改
    getAddTrand(data: any) {
        if (data.id) {
            // 修改品牌
            return axios.put<any, any>('/admin/product/baseTrademark/update', data)
        } else {
            // 新增品牌
            return axios.post<any, any>('/admin/product/baseTrademark/save', data)
        }
    },
    // 删除品牌
    getBrandDelete(id: number) {
        return axios.delete<any, any>('/admin/product/baseTrademark/remove/' + `${id}`)
    },
    // 获取商品管理一级分类
    getOneClassify() {
        return axios.get<any, any>('/admin/product/getCategory1');
    },
    // 获取商品管理二级分类   参数： category1Id
    getTwoClassify(category1Id: number | string) {
        return axios.get<any, any>('/admin/product/getCategory2/' + `${category1Id}`);
    },
    // 获取商品管理三级分类   参数： category2Id
    getThreeClassify(category2Id: number | string) {
        return axios.get<any, any>('/admin/product/getCategory3/' + category2Id);
    },

    // 获取商品分类下商品属性与属性值
    getShopClassify(category1Id: number | string, category2Id: number | string, category3Id: number | string) {
        return axios.get('/admin/product/attrInfoList/' + category1Id + '/' + category2Id + '/' + category3Id)
    },

    // 修改或添加商品分类的属性值
    getSaveInfo(info: any) {
        return axios.post('/admin/product/saveAttrInfo', info)
    },
    // 删除商品属性
    getDeleteShop(attrId: number | string) {
        return axios.delete('/admin/product/deleteAttr/' + attrId)
    },



    // SPU
    // spu管理模块的接口   page, limit, category3Id
    getSPUList(page: number, limit: number, category3Id: number | string) {
        return axios.get('/admin/product/' + page + '/' + limit + '?category3Id=' + category3Id);
    },
    // 删除spu
    getDeleteSup(spuId: number | string) {
        return axios.delete('/admin/product/deleteSpu/' + spuId)
    },

    // 品牌管理获取列表
    getPinpaiList(category3Id: number | string) {
        return axios.get<any, any>('/admin/product/baseCategoryTrademark/findTrademarkList/' + category3Id)
    },

    // 品牌照片墙
    getPinpaiPicture(spuId: number) {
        return axios.get('/admin/product/spuImageList/' + spuId)
    },

    // 获取品牌销售属性
    getPinpaiShuxing(spuId: number | string) {
        return axios({
            url: '/admin/product/spuSaleAttrList/' + spuId,
            method: 'get'
        })
    },

    // 获取整个项目全部的销售属性
    getQuanbuShuxing() {
        return axios({
            url: '/admin/product/baseSaleAttrList',
            method: 'get'
        })
    },

    // 添加spu
    getSpuAdd(data: any) {
        return axios.post('/admin/product/saveSpuInfo', { data });
    },

    // 修改spu
    getSpuXiugai(data: any) {
        return axios.post('/admin/product/updateSpuInfo', { data });
    },

    // 添加和修改合并成一个
    getSpuTijiao(data: any) {
        if (data.id) {
            return axios.post('/admin/product/updateSpuInfo', data);
        } else {
            return axios.post('/admin/product/saveSpuInfo', data);
        }
    },


    // SKU
    // 添加SKU方法
    getAddSku(skuInfo: any) {
        return axios.post('/admin/product/saveSkuInfo', skuInfo);
    },

    // 查看SKU
    getLookSpu(spuId: number | string) {
        return axios.get('/admin/product/findBySpuId/' + spuId);
    },




    // 用户管理模块
    getUserInfo(page: number, limit: number, username: string) {
        return axios.get('/admin/acl/user/' + page + '/' + limit + '/?username=' + username);
    },

    // 新增管理用户
    getUserInfoAdd(user: any) {
        if(user.id) {
            return axios.put('/admin/acl/user/update', user);
        }else{
            return axios.post('/admin/acl/user/save', user);
        }
    },

    // 删除管理用户
    getUserInfoDelete(id: number | string) {
        return axios.delete('/admin/acl/user/remove/' + id);
    },

    // 批量删除管理用户
    getUserInfoPiDelete(idList: any) {
        return axios.delete('/admin/acl/user/batchRemove', {data: idList});
    },

    // 获取角色数据
    getUserInfoToAssign(adminId: number | string) {
        return axios.get('/admin/acl/user/toAssign/' + adminId);
    },

    // 修改分配角色
    getUserInfoDoAssignRole(roleVo: any) {
        return axios.post('/admin/acl/user/doAssignRole/', roleVo);
    },





}
export default api