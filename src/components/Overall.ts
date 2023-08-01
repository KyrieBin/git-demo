// 这里定义全部的全局组件     (自定义插件)

import SvgIcon from './SvgIcon/index.vue'
import Page from './Pagets/index.vue'
import Category from './Category/index.vue'

const allGloablComponent = { SvgIcon, Page, Category };  //是个对象，key是组件名  value是组件本身, 直接forin遍历，得到每一组的key value

export default {
    install(app: any) {
        for (const key in allGloablComponent) {
            app.component(key, allGloablComponent[key]);
        }
    }
}