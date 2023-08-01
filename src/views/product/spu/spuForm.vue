<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">
                <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>

            <el-form-item label="SPU品牌">
                <el-select v-model="SpuParams.tmId">
                    <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <el-input type="text" placeholder="请你输入SPU描述" v-model="SpuParams.description"></el-input>
            </el-form-item>

            <!-- 照片墙 -->
            <el-form-item label="SPU图片">
                <el-upload v-model:file-list="fileList" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess"
                    :on-error="handleError" :on-exceed="handleExceed" :before-upload="handleSize">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <!-- 查看大图 -->
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <!-- 销售属性 -->
            <el-form-item label="SPU销售属性">
                <el-select v-model="saleAttrIdAndValueName">
                    <el-option v-for="(item, index) in unSelectArrComputed" :key="item.id" :label="item.name"
                        :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button @click="addSaleAttr" :disabled="!saleAttrIdAndValueName" style="margin-left:10px" type="primary"
                    size="default" icon="Plus">添加属性</el-button>
                <!-- table展示销售属性与属性值的地方 -->
                <el-table border style="margin:10px 0px" :data="saleAttr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="销售属性名字" width="180px" prop="saleAttrName"></el-table-column>
                    <el-table-column label="销售属性值">
                        <template #default="{ row, $index }">
                            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" style="margin:0px 5px"
                                class="mx-1" closable @close="handleClose(row, index)">
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input @keyup.enter="huiche(row)" v-show="row.flag" v-model="row.inputShuxing"
                                @blur="toLook(row)" placeholder="请你输入属性值" size="small"
                                style="width:200px; margin-right: 10px;"></el-input>
                            <el-button v-show="!row.flag" type="primary" size="small" icon="Plus"
                                @click="addShuxing(row)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #default="{ row, $index }">
                            <el-button type="primary" size="small" icon="Delete"
                                @click="saleAttr.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="!saleAttr.length" type="primary" size="default" @click="save">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import api from '@/api';
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus';

// 定义照片墙数据
const fileList = ref<UploadUserFile[]>([])

// 子组件接收 $emit 自定义事件
let $emit = defineEmits(['changeScene', 'getSPUList']);



const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 移除图片时触发
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log('文件已移除', uploadFile, uploadFiles)
}

// 上传成功时触发
const handleSuccess = () => {

}

// 上传失败时触发
const handleError = () => {
    console.log('上传失败了')
}

// 超出限制触发
const handleExceed = () => {
    console.log('超出限制了');

}

// 点击已上传好的文件时触发
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log('这是已上传的文件');
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

// 文件上传前触发
const handleSize = (a) => {
    if (a.type == 'image/png' || a.type == 'image/jpg') {
        if (a.size / 1024 / 1024 < 3) {
            alert('上传成功');
            return true
        }
    } else {
        alert('请上传正确的格式或大小限制');
        return false
    }
}



//存储商品品牌数据
let AllTradeMark = ref([]);
// 存储照片墙数据
let imgList = ref([])
// 存储已有的销售属性
let saleAttr = ref([])
// 存储全部的销售属性
let allSaleAttr = ref([])


//存储已有的SPU对象 修改spu接口需要的参数
let SpuParams = ref({
    category3Id: '',//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],  //照片墙数组
    spuSaleAttrList: [],  //已有销售属性
});

// 收集将来要携带的属性的id和属性值
let saleAttrIdAndValueName = ref<string>('')

// 计算未选择的销售属性
let unSelectArrComputed = computed(() => {
    let unSelectArr = allSaleAttr.value.filter(ele => {
        return saleAttr.value.every(item => {
            return ele.name !== item.saleAttrName
        })
    });
    return unSelectArr
})


// 点击添加属性按钮
const addSaleAttr = () => {
    if (saleAttr.value.length === allSaleAttr.value.length) {
        return
    }

    const arr = saleAttrIdAndValueName.value.split(":");
    let baseSaleAttrId = arr[0]
    let saleAttrName = arr[1]
    let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttr.value.push(obj);
    saleAttrIdAndValueName.value = ''
}

// 新增属性值按钮
const addShuxing = (row) => {
    row.flag = true
    row.inputShuxing = ''
}

// 失去焦点时触发
const toLook = (row) => {
    if (row.inputShuxing.trim() === '') {
        alert('属性值不能为空');
        row.flag = false
        return
    }
    let repeat = row.spuSaleAttrValueList.some(ele => {
        return ele.saleAttrValueName === row.inputShuxing;
    })
    if (repeat) {
        alert('属性值不能重复');
        row.flag = false
        return
    }

    row.flag = false;
    row.spuSaleAttrValueList.push({ saleAttrValueName: row.inputShuxing, baseSaleAttrId: row.baseSaleAttrId })

}

// 标签叉号
const handleClose = (row, index) => {
    row.spuSaleAttrValueList.splice(index, 1)

}
const huiche = () => {
    console.log(123);

}


// 父组件需要触发的子组件方法

// 收集父组件数据
const father = (row) => {
    Object.assign(SpuParams.value, row)
    // SpuParams.tmId = row.id
    // SpuParams.spuName = row.spuName
    // SpuParams.description = row.description

}

// 获取select品牌列表
const getPinpaiList = async (id) => {
    SpuParams.value.category3Id = id;
    let res = await api.getPinpaiList(id)
    console.log('全部品牌列表--------------------', res);
    AllTradeMark.value = res.data;
}

// 获取照片墙
const getPinpaiPicture = async (id) => {
    let res = await api.getPinpaiPicture(id);
    console.log('照片墙-----------------', res);
    // imgList.value = res.data;
    let arr: any = [];
    res.data.forEach(ele => {
        let obj = {
            name: ele.imgName,
            url: ele.imgUrl
        }
        arr.push(obj);
    });
    // console.log('arr----------------', arr);
    fileList.value = arr
    // imgList.value = arr
}


// 获取已有品牌销售属性
const getPinpaiShuxing = async (id: string | number) => {
    let res = await api.getPinpaiShuxing(id);
    console.log('已有品牌销售属性--------------', res);
    saleAttr.value = res.data;
}

// 获取全部销售属性 
const getQuanbuShuxing = async () => {
    let res = await api.getQuanbuShuxing()
    console.log('全部销售属性----------------', res.data);
    allSaleAttr.value = res.data;
}

// 父组件触发的  清除原有数据
const clearData = () => {
    Object.assign(SpuParams.value, {
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],  //照片墙数组
        spuSaleAttrList: [],  //已有销售属性

        id: ''
    })
    // 因为是添加不需要id, 得先清除id
    // delete SpuParams.value.id

    allSaleAttr.value = []
    // 照片墙清除
    fileList.value = []
    saleAttr.value = []
}


//defineExpose    把这些方法放在了vue实例上   将来父组件可以拿到并触发
defineExpose({ father, getPinpaiList, getPinpaiPicture, getPinpaiShuxing, getQuanbuShuxing, clearData })





// 最后统一提交保存
// 保存按钮
const save = () => {
    // 整理参数
    // 照片墙
    fileList.value.forEach(ele => {
        let obj = {
            imgName: ele.name,
            imgUrl: ele.url
        }
        SpuParams.value.spuImageList.push(obj);
    })
    SpuParams.value.spuSaleAttrList = saleAttr.value   //销售属性
    console.log('总数据--------------', SpuParams.value);

    getSpuTijiao();

}

const getSpuTijiao = async () => {
    let res = await api.getSpuTijiao(SpuParams.value);
    if (res.code === 200) {
        $emit('changeScene');
        ElMessage({
            message: SpuParams.value.id ? '更新成功' : '添加成功',
            type: 'success',
        })
    } else {
        ElMessage({
            message: SpuParams.value.id ? '更新失败' : '添加失败',
            type: 'warning',
        })
    }

}

// 取消按钮
const cancel = () => {
    $emit('changeScene')
}

</script>

<style scoped lang="scss">
.el-dialog {
    img {
        max-width: 100%;
    }
}
</style>