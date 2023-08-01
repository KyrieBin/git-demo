// // 一。用户相关数据的      ts类型

// // 所有公共接口返回的数据
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// // 登录接口   携带的参数
export interface loginFormData {
    username: string,
    password: string
}

interface loginData {
    token: string
}

// // 登录接口   返回数据的类型
export interface loginResponseData extends ResponseData {
    data: loginData
}

// 商品分类
export interface fenlei {
    code: number,
    message: string,
    ok: boolean
}

interface junhua {
    id: number,
    createTime: string,
    updateTime: string,
    name: string,
}

export interface fenleiXiao extends fenlei {
    data: junhua[]
}