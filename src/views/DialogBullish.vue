 <!-- 
  选择待查找股票集合组件 
  -->
<template>
  <div id="dialog-page">
    <el-dialog
      :model-value="visible"
      @update:model-value="onUpdateVisible"
      :title="多头排列表格测试"
      width=850px
      :before-close="handleClose"
      style="margin-top: 60px;"
      class="modecards-dialog-tour"
    >
      <span>多头排列模式</span>
      <hr />

      <!-- 多头排列基本信息表格 -->
      <div style="font-size: 13px; color:#000000; padding: 1px; width: 830px; margin-left: 0px; margin-top: 10px;">——————————————— 相似度问答 ————————————————</div>

      <!-- 数据分类设置区 -->
      <div style="margin-top: 10px; width: 815px; display: flex;">
        <div class="scrollable-div" style="border: #d6d6d6 1px solid; width: 815px; height: 405px; margin-left: 20px; padding: 10px; overflow-y: auto; border-radius: 4px;">
          <div v-if="currentCard === 1">
            <!-- 写一个只有一行的表格，表头是【分类1、分类2】，表格内容是两张图片 -->
              <el-carousel :interval="200000" arrow="always" style="width:100%; height: 400px;"> <!-- 保持高度一致 -->
                <!-- 第一个轮播项（原始参考项） -->
                <el-carousel-item>
                  <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 10px;">以下两张图片的框选区域是否相似？</div>
                  <el-table :data="tableData1" style="font-size: 12px; margin-top: 5px; margin-left: 7px; width: 760px;" class="custom-table-header">
                    <el-table-column label="区域1" width="380px">
                      <template #default="{ row }">
                        <img :src="row.imagePath1" alt="分类1图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="区域2" width="380px" style="margin-left: 5px;">
                      <template #default="{ row }">
                        <img :src="row.imagePath2" alt="分类2图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="display: flex;">
                    <el-button :plain="simState !== 1" @click="simState = 1" type="success" style="margin-top: 10px; margin-left: 10px; width: 370px;">是</el-button>
                    <el-button :plain="simState !== 2" @click="simState = 2" type="warning" style="margin-top: 10px; margin-left: 10px; width: 370px;">否</el-button>
                  </div>
                  <div v-if="simState === 1" style="display: flex;">
                    <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 20px; margin-left: 12px;">如果设定十分为两个多头排列片段完全相同，则上述两个框选片段的相似程度为？</div>
                    <el-input-number v-model="similarityScore" :min="0" :max="10" style="width: 100px; margin-left: 10px; height: 30px; margin-top: 15px;"></el-input-number>
                  </div>
                </el-carousel-item>

                <!-- 第二个轮播项（统一样式） -->
                <el-carousel-item>
                  <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 10px;">以下两张图片的框选区域是否相似？</div>
                  <el-table :data="tableData1" style="font-size: 12px; margin-top: 5px; margin-left: 7px; width: 760px;" class="custom-table-header">
                    <el-table-column label="区域1" width="380px">
                      <template #default="{ row }">
                        <img :src="row.imagePath3" alt="分类1图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="区域2" width="380px" style="margin-left: 5px;">
                      <template #default="{ row }">
                        <img :src="row.imagePath4" alt="分类2图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="display: flex;">
                    <el-button :plain="simState1 !== 1" @click="simState1 = 1" type="success" style="margin-top: 10px; margin-left: 10px; width: 370px;">是</el-button>
                    <el-button :plain="simState1 !== 2" @click="simState1 = 2" type="warning" style="margin-top: 10px; margin-left: 10px; width: 370px;">否</el-button>
                  </div>
                  <div v-if="simState1 === 1" style="display: flex;">
                    <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 20px; margin-left: 12px;">如果设定十分为两个多头排列片段完全相同，则上述两个框选片段的相似程度为？</div>
                    <el-input-number v-model="similarityScore1" :min="0" :max="10" style="width: 100px; margin-left: 10px; height: 30px; margin-top: 15px;"></el-input-number>
                  </div>
                </el-carousel-item>

                <!-- 第三个轮播项（统一样式） -->
                <el-carousel-item>
                  <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 10px;">以下两张图片的框选区域是否相似？</div>
                  <el-table :data="tableData1" style="font-size: 12px; margin-top: 5px; margin-left: 7px; width: 760px;" class="custom-table-header">
                    <el-table-column label="区域1" width="380px">
                      <template #default="{ row }">
                        <img :src="row.imagePath5" alt="分类1图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="区域2" width="380px" style="margin-left: 5px;">
                      <template #default="{ row }">
                        <img :src="row.imagePath6" alt="分类2图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="display: flex;">
                    <el-button :plain="simState2 !== 1" @click="simState2 = 1" type="success" style="margin-top: 10px; margin-left: 10px; width: 370px;">是</el-button>
                    <el-button :plain="simState2 !== 2" @click="simState2 = 2" type="warning" style="margin-top: 10px; margin-left: 10px; width: 370px;">否</el-button>
                  </div>
                  <div v-if="simState2 === 1" style="display: flex;">
                    <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 20px; margin-left: 12px;">如果设定十分为两个多头排列片段完全相同，则上述两个框选片段的相似程度为？</div>
                    <el-input-number v-model="similarityScore2" :min="0" :max="10" style="width: 100px; margin-left: 10px; height: 30px; margin-top: 15px;"></el-input-number>
                  </div>
                </el-carousel-item>

                <!-- 第四个轮播项（统一样式） -->
                <el-carousel-item>
                  <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 10px;">以下两张图片的框选区域是否相似？</div>
                  <el-table :data="tableData1" style="font-size: 12px; margin-top: 5px; margin-left: 7px; width: 760px;" class="custom-table-header">
                    <el-table-column label="区域1" width="380px">
                      <template #default="{ row }">
                        <img :src="row.imagePath7" alt="分类1图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="区域2" width="380px" style="margin-left: 5px;">
                      <template #default="{ row }">
                        <img :src="row.imagePath8" alt="分类2图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="display: flex;">
                    <el-button :plain="simState3 !== 1" @click="simState3 = 1" type="success" style="margin-top: 10px; margin-left: 10px; width: 370px;">是</el-button>
                    <el-button :plain="simState3 !== 2" @click="simState3 = 2" type="warning" style="margin-top: 10px; margin-left: 10px; width: 370px;">否</el-button>
                  </div>
                  <div v-if="simState3 === 1" style="display: flex;">
                    <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 20px; margin-left: 12px;">如果设定十分为两个多头排列片段完全相同，则上述两个框选片段的相似程度为？</div>
                    <el-input-number v-model="similarityScore3" :min="0" :max="10" style="width: 100px; margin-left: 10px; height: 30px; margin-top: 15px;"></el-input-number>
                  </div>
                </el-carousel-item>

                <!-- 第五个轮播项（统一样式） -->
                <el-carousel-item>
                  <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 10px;">以下两张图片的框选区域是否相似？</div>
                  <el-table :data="tableData1" style="font-size: 12px; margin-top: 5px; margin-left: 7px; width: 760px;" class="custom-table-header">
                    <el-table-column label="区域1" width="380px">
                      <template #default="{ row }">
                        <img :src="row.imagePath9" alt="分类1图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="区域2" width="380px" style="margin-left: 5px;">
                      <template #default="{ row }">
                        <img :src="row.imagePath10" alt="分类2图片" style="width: 380px; height: 190px;">
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="display: flex;">
                    <el-button :plain="simState4 !== 1" @click="simState4 = 1" type="success" style="margin-top: 10px; margin-left: 10px; width: 370px;">是</el-button>
                    <el-button :plain="simState4 !== 2" @click="simState4 = 2" type="warning" style="margin-top: 10px; margin-left: 10px; width: 370px;">否</el-button>
                  </div>
                  <div v-if="simState4 === 1" style="display: flex;">
                    <div style="color: black; font-size: 13px; margin-bottom: 10px; margin-top: 20px; margin-left: 12px;">如果设定十分为两个多头排列片段完全相同，则上述两个框选片段的相似程度为？</div>
                    <el-input-number v-model="similarityScore4" :min="0" :max="10" style="width: 100px; margin-left: 10px; height: 30px; margin-top: 15px;"></el-input-number>
                  </div>
                </el-carousel-item>
              </el-carousel>

            
          </div>
          <div v-if="currentCard === 2">
            <span style="font-size: 12px;"> 自定义分类：手动定义分类结果</span>
          </div>
          
        </div>
      </div>
      <template #footer>
        <div style="margin-top: 10px;">
          <el-button @click="onUpdateVisible(false)">Cancel</el-button>
          <el-button type="primary" @click="onConfirm" class="apply-mode-btn">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref} from "vue";

import { useStore } from "vuex";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: "选择待查找股票集合",
  },
  dialogWidth: {
    type: [String, Number],
    default: "700",
  },
});

const simState = ref(0); // 相似度状态
const simState1 = ref(0);
const simState2= ref(0);
const simState3 = ref(0);
const simState4 = ref(0);

const similarityScore = ref(0); // 相似度分数
const similarityScore1 = ref(0);
const similarityScore2 = ref(0);
const similarityScore3 = ref(0);
const similarityScore4 = ref(0);

const emit = defineEmits(["close", "update:model-value"]);

const store = useStore();

const tableData = [
  {}
];
const tableData1 = [
  {
    imagePath1: '/stage1.png',
    imagePath2: '/stage2.png',
    imagePath3: '/stage3.png',
    imagePath4: '/stage4.png',
    imagePath5: '/stage5.png',
    imagePath6: '/stage6.png',
    imagePath7: '/stage7.png',
    imagePath8: '/stage8.png',
    imagePath9: '/stage9.png',
    imagePath10: '/stage10.png',
  }
];

const cardList = [
  { id: 1, label: '默认\n分类' }, 
  { id: 2, label: '自定义\n分类' }
]

// 默认选中第一个卡片
const currentCard = ref(1)

// 点击卡片时更新选中状态
const handleCardClick = (id) => {
  currentCard.value = id
}

const handleClose = (done) => {
  done();
  emit("close");
  emit("update:model-value", false);
};

const onUpdateVisible = (newValue) => {
  emit("close");
  emit("update:model-value", false);
};

// 新增：自动全选逻辑
const tableRefs = {
  3: ref(null),
  4: ref(null),
  5: ref(null)
};


// 查找方式切换
const searchMode = ref('multi'); // multi: 多股票对比查找, history: 本股票历史行情查找
const dateRange = ref([new Date('2016-01-02'), new Date('2016-06-20')]);

const searchInfo = store.state.searchInfo;
const onConfirm = () => {
  // let selectedRows = [];
  // if (searchMode.value === 'multi') {
  //   Object.values(tableRefs).forEach(tableRef => {
  //     const table = tableRef.value;
  //     if (table) {
  //       // 使用 getSelectionRows 方法获取选中的行
  //       selectedRows = selectedRows.concat(table.getSelectionRows()); 
  //       console.log("---------------------------------------------------");
  //       console.log(selectedRows);
  //     }
  //   });

  // }
  // const startDate = dateRange.value[0];
  // const endDate = dateRange.value[1];
  // searchInfo.searchStartDate = startDate;
  // searchInfo.searchEndDate = endDate;
  // searchInfo.stockList = selectedRows;
  // console.log(searchInfo.stockList);
  onUpdateVisible(false);
};
</script>

<style scoped>
.card-group {
  gap: 10px;
}

.is-active {
  background-color: #81bfff;
  color: var(--el-color-white);
}

/* 使用/deep/或::v-deep选择器穿透scoped样式 */
.custom-table-header .el-table__header th {
  background-color: #f5f7fa !important;
  text-align: center;
height: 10px !important;
}

/* 或者使用::v-deep (Vue 3) */
::v-deep .custom-table-header .el-table__header th {
  background-color: #f5f7fa !important;
  text-align: center !important;
  font-size: 12px !important;
  
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  height: 400px;
  background-color: #e7e7e7;
}

.el-carousel__item:nth-child(2n + 1) {
  height: 400px;
  background-color: #e7e7e7;
}

</style>    