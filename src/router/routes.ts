// 静态路由
export const routes = [
    // 登录页
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hidden: true,
            icon: 'Timer'
        },
        component: () => import('../views/Login/index.vue')
    },

    // layout页
    {
        path: '/',
        name: 'layout',
        redirect: '/home',
        component: () => import('../views/Layout/index.vue'),
        meta: {
            title: '首页',
            hidden: true,
            icon: 'House'
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'House'
                },
                component: () => import('../views/Home/index.vue')
            }
        ]
    },

    // 404页  
    {
        path: '/404',
        name: '404',
        meta: {
            title: '404',
            hidden: true,
            icon: 'ReadingLamp'
        },
        component: () => import('../views/404/index.vue')
    }
]

// 异步路由
export const asyncRoutes = [
    // 权限管理
    {
        path: '/acl',
        name: 'Acl',
        meta: {
            title: '权限管理',
            icon: 'Lock',
        },
        redirect: '/acl/user',
        component: () => import('../views/Layout/index.vue'), //默认进入到谁，谁就是我的父组件
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    icon: 'Monitor',
                },
            },
        ],
    },

    // 商品管理
    {
        path: '/product',
        component: () => import('../views/Layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods',
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull',
                },
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled',
                },
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar',
                },
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',
                    icon: 'Orange',
                },
            },
        ],
    },
]


// 任意路由
export const anyRoutes = {  //以上均不是，就重定向到404页面  当输入的路径不存在路由时跳转到该页
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '不存在',
        hidden: true,
        icon: 'Suitcase'
    }
}

