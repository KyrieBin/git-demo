<template>
    <div>
        <!-- 三级分类 -->
        <Category :jinyong="jinyong"></Category>
        <el-card style="margin: 10px auto 0;">
            <!-- 一上来就能展示看到的 -->
            <div v-show="scene === 0">
                <el-button :disabled="!CategoryStore.threeId" type="primary" icon="Plus" size="default"
                    @click="addSpu">添加SPU</el-button>
                <el-table style="margin: 10px 0px;" border :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <!-- show-overflow-tooltip:  限制一行显示的属性 -->
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作">
                        <!-- row:即为已有的SPU对象 -->
                        <template #default="{ row, $index }">
                            <el-button type="primary" size="small" icon="Plus" title="添加SKU"
                                @click="addSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Edit" title="修改SPU"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="primary" size="small" icon="View" title="查看SKU列表"
                                @click="findSku(row)"></el-button>
                            <!-- 气泡确认框 -->

                            <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                                <template #reference>
                                    <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination style="margin: 20px auto 0" v-model:current-page="pageNo" v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev, pager, next, jumper, sizes, total"
                    :total="total" @current-change="getHasSpu" @size-change="changeSize" />
            </div>
            <!-- spuForm -->
            <SpuForm ref="spuVue" @changeScene="changeScene" v-show="scene === 1"></SpuForm>
            <!-- spuForm -->
            <SkuForm ref="skuVue" @changeScene="changeScene" v-show="scene === 2"></SkuForm>

            <!-- dialog对话框:展示已有的SKU数据 -->
            <el-dialog v-model="showDialog" title="SKU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #default="{ row, $index }">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { ref, watch } from 'vue'
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import useCategoryStore from '@/store/modules/category';
let CategoryStore = useCategoryStore();

// 是添加或修改控制 scene 
let scene = ref<number>(0)

// 三级分类按钮是否禁用
let jinyong = ref(true);

// 分页器
// 当前页码
let pageNo = ref<number>(1)
// 每页显示条数
let pageSize = ref<number>(5)
// 总条数
let total = ref<number>(0)
// 表格数据
let records = ref([]);

// 在子组件身上打一个标识
let spuVue = ref();
let skuVue = ref();

// 弹出对话框
let showDialog = ref<boolean>(false);

// 对话框中的列表
let skuArr = [
    {
        skuName: '',
        price: 0,
        weight: '',
        skuDefaultImg: ''
    }
]


// 监听三级分类选中
watch(() => CategoryStore.threeId, () => {
    if (!CategoryStore.threeId) {
        records.value = [];  //先把原有的数据清空
        return
    }
    getSPUList();
    // 获取品牌列表
    spuVue.value.getPinpaiList(CategoryStore.threeId);
})


// 获取spu表格列表数据
const getSPUList = async () => {
    let res = await api.getSPUList(pageNo.value, pageSize.value, CategoryStore.threeId);
    console.log('SPU表格列表--------------', res.data);
    if (res.code === 200) {
        records.value = res.data.records;
        total.value = res.data.total
    }
}


// 添加SPU
const addSpu = () => {
    scene.value = 1;

    // 触发子组件身上的事件方法   品牌列表
    spuVue.value.getPinpaiList(CategoryStore.threeId)

    // 获取全部属性
    spuVue.value.getQuanbuShuxing(CategoryStore.threeId)

    // 清除原有数据
    spuVue.value.clearData();
}

// 添加SKU 按钮
const addSku = (row) => {
    scene.value = 2
    
    skuVue.value.initSkuData(CategoryStore.oneId, CategoryStore.twoId, CategoryStore.threeId, row);
}

// 修改SPU 按钮
const updateSpu = (row) => {
    scene.value = 1;

    // 带过去已有数据属性
    spuVue.value.father(row);

    // 获取照片墙
    spuVue.value.getPinpaiPicture(row.id)

    // 获取已有品牌属性
    spuVue.value.getPinpaiShuxing(row.id)

    // 获取全部品牌属性
    spuVue.value.getQuanbuShuxing()

}

// 查看SKU列表 按钮
const findSku = (row) => {
    getLookSpu(row.id);
}

// 获取sku列表
const getLookSpu = async (id) => {
    let res = await api.getLookSpu(id);
    console.log('sku列表-------------------------------', res);
    if (res.code === 200) {
        skuArr = res.data;
        showDialog.value = true
    }

}



// 删除 气泡确认框
const deleteSpu = (row) => {
    getDeletSpu(row.id)
}
const getDeletSpu = async (id) => {
    let res = await api.getDeleteSup(id);
    console.log('删除spu-------------', res);
    getSPUList()
}

// 页码切换时触发
const getHasSpu = () => {
    getSPUList()
}

//每页显示条数变化时触发
const changeSize = () => {
    getSPUList()
}



// 返回第一页
const changeScene = () => {
    scene.value = 0;
    getSPUList()
}

</script>

<style scoped></style>