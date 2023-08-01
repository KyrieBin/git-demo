// 定义SPU数据（请求参数，返回数据）  ts类型

export interface ResponesData {
    code: number,
    message: string,
    ok: boolean
}




export interface Records {
    id?: number | string,
    category3Id: number,
    description: string,
    spuImageList: any,   //照片墙列表
    spuName: string,
    spuSaleAttrList: any,  //商品属性列表
    tmId: number | string
}

export interface DataResponesData extends ResponesData {
    data: {
        records: Records[],
        total: number,
        size: number,  //一页展示条数
        pages: number,   //总页码数
        current: number   //当前是第几页
        searchCount: boolean
    }
}