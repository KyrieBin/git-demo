<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>

        <el-form-item label="平台属性">

            <el-form :inline="true" label-width="70px">
                <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName"
                    style="margin-bottom: 10px;">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
                            :key="attrValue.id" :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </el-form-item>

        <el-form-item label="销售属性">

            <el-form :inline="true">
                <el-form-item :label="item.saleAttrName" v-for="(item, index) in saleArr" :key="item.id">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`"
                            v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </el-form-item>

        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #default="{ row, $index }">
                        <img :src="row.imgUrl" alt="" style="width:100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row, $index }">
                        <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
//引入请求API
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import api from '@/api';

//自定义事件的方法
let $emit = defineEmits(['changeScene']);

//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片的数据
let imgArr = ref<any>([]);

//获取table组件实例
let table = ref<any>();



//收集SKU的参数
let skuParams = reactive({
    //父组件传递过来的数据
    category3Id: "",//三级分类的ID
    spuId: "",//已有的SPU的ID
    tmId: "",//SPU品牌的ID

    //v-model收集
    skuName: "",//sku名字
    price: "",//sku价格
    weight: "",//sku重量
    skuDesc: "",//sku的描述

    skuAttrValueList: [//平台属性的收集
    ],
    skuSaleAttrValueList: [//销售属性
    ],
    skuDefaultImg: "",//sku图片地址
})




//当前子组件的方法对外暴露   清空原有数据，发送请求获取数据
const initSkuData = async (c1Id: number | string, c2Id: number | string, c3Id: number | string, spu: any) => {

    Object.assign(skuParams, {
        category3Id: "",
        spuId: "",
        tmId: "",

        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        skuDefaultImg: "",
    })

    //收集数据
    skuParams.category3Id = spu.category3Id;
    skuParams.spuId = spu.id;
    skuParams.tmId = spu.tmId;

    //获取平台属性
    let result: any = await api.getShopClassify(c1Id, c2Id, c3Id);
    console.log('平台属性---------------------', result);
    if (result.code === 200) {
        //平台属性
        attrArr.value = result.data;
    }
    // //获取对应的销售属性
    let result2: any = await api.getPinpaiShuxing(spu.id);
    console.log('销售属性-------------------', result2);
    if (result.code === 200) {
        //销售属性
        saleArr.value = result2.data;
    }
    // //获取照片墙的数据
    let result3: any = await api.getPinpaiPicture(spu.id);
    console.log('照片墙----------------------------', result3);
    if (result.code === 200) {
        // //图片
        imgArr.value = result3.data;
    }
}
//对外暴露方法
defineExpose({ initSkuData });



//取消按钮的回调
const cancel = () => {
    $emit('changeScene');
}

//设置默认图片的方法回调
const handler = (row: any) => {
    //点击的时候,全部图片的的复选框不勾选
    imgArr.value.forEach((item: any) => {
        // toggleRowSelection  这个API控制不勾选
        table.value.toggleRowSelection(item, false);
    });
    //选中的图片才勾选 
    table.value.toggleRowSelection(row, true);
    
    //收集图片地址
    skuParams.skuDefaultImg = row.imgUrl;
}


//保存按钮的方法
const save = async () => {
    //整理参数

    //整理平台属性
    let arr: any = [];
    attrArr.value.forEach(ele => {
        let [attrId, valueId] = ele.attrIdAndValueId.split(':');
        let zong = {
            attrId,
            valueId
        }
        arr.push(zong);
    });
    skuParams.skuAttrValueList = arr;

    // skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    //     if (next.attrIdAndValueId) {
    //         let [attrId, valueId] = next.attrIdAndValueId.split(':');
    //         prev.push({
    //             attrId,
    //             valueId
    //         })
    //     }
    //     return prev;
    // }, []);

    //整理销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId, saleAttrValueId
            })
        }
        return prev;
    }, []);

    //添加SKU的请求
    let result: any = await api.getAddSku(skuParams);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        });
        //通知父组件切换场景为零
        $emit('changeScene')
    } else {
        ElMessage({
            type: 'error',
            message: '添加SKU失败'
        })
    }
}

</script>

<style scoped lang="scss"></style>