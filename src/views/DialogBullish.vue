<!--
  选择待查找股票集合组件
  -->
<template>
  <div id="dialog-page">
    <el-dialog
      :model-value="visible"
      @update:model-value="onUpdateVisible"
      :title="多头排列表格测试"
      width="850px"
      :before-close="handleClose"
      style="margin-top: 60px;"
      class="modecards-dialog-tour"
    >
      <span>多头排列模式相似度问答</span>
      <hr />

      <!-- 多头排列基本信息表格 -->
      <div style="display: flex; align-items: center; font-size: 13px; color:#000000; padding: 1px; width: 800px; margin-left: 0px; margin-top: -40px;">
        <span style="flex: 1;"></span>
        <el-tooltip content="切换问答类型" placement="top">
          <el-button @click="toggleQaMode" circle size="small" type="primary" style="margin-left: 8px;">
            <template #icon>
              <i :class="qaMode === 'image' ? 'el-icon-picture' : 'el-icon-edit'" />
            </template>
          </el-button>
        </el-tooltip>
      </div>

      <!-- 数据分类设置区 -->
      <div style="margin-top: 10px; width: 815px; display: flex;">
        <div class="scrollable-div" style="border: #d6d6d6 1px solid; width: 815px; height: 405px; margin-left: 20px; padding: 10px; overflow-y: auto; border-radius: 4px;">
          <div v-if="currentCard === 1">
            <!-- 图片问答轮播图 - 仅当 qaMode 为 'image' 时显示 -->
            <el-carousel :interval="200000" arrow="always" style="width:100%; height: 400px;" v-if="qaMode === 'image'">
              <!-- 第一个轮播项 -->
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

              <!-- 第二个轮播项 -->
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

              <!-- 第三个轮播项 -->
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

              <!-- 第四个轮播项 -->
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

              <!-- 第五个轮播项 -->
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

            <!-- 文字多选题 - 仅当 qaMode 为 'text' 时显示 -->
            <div v-if="qaMode === 'text'" style="color: black; font-size: 14px;">
              <h4 style="margin-top: 0px;">在比较两个股票片段是否相似时，您考虑到的因素是？（可多选）</h4>
              <div style="display: flex; margin-left: 40px;">
                <div style="width: 45%; height: 260px; border: #d6d6d6 1px solid; border-radius: 5px;">
                  <span style="font-size: 13px; background-color: antiquewhite;">系统默认因素</span>
                  <el-checkbox-group v-model="selectedFactors" style="margin-top: 10px;">
                    <el-checkbox label="片段长度" style="margin-bottom: 10px;">片段长度</el-checkbox><br>
                    <el-checkbox label="均线发散程度" style="margin-bottom: 10px;">均线发散程度</el-checkbox><br>
                    <el-checkbox label="均线倾斜程度" style="margin-bottom: 10px;">均线倾斜程度</el-checkbox><br>
                    <el-checkbox label="出现金叉情况" style="margin-bottom: 10px;">出现金叉情况</el-checkbox><br>
                    <el-checkbox label="出现死叉情况" style="margin-bottom: 10px;">出现死叉情况</el-checkbox><br>
                  </el-checkbox-group>
                </div>
                <div style="width: 45%; height: 260px; border: #d6d6d6 1px solid; border-radius: 5px; margin-left: 10px;">
                  <span style="font-size: 13px; background-color: antiquewhite;">用户自定义因素</span>
                  <el-checkbox-group v-model="selectedFactors2" style="margin-top: 10px;">
                    <el-checkbox label="MA4下穿MA20情况" style="margin-bottom: 10px;">MA4下穿MA20情况</el-checkbox><br>
                    <el-checkbox label="MA4初始倾斜角度" style="margin-bottom: 10px;">MA4初始倾斜角度</el-checkbox><br>
                  </el-checkbox-group>
                </div>
              </div>
              <div style="margin-top: 20px;">
                <span style="margin-right: 10px;">补充选项:</span>
                <el-input
                  v-model="supplementaryOption"
                  placeholder="请输入您的补充因素"
                  style="width: 300px;"
                ></el-input>
              </div>
              
              <el-button type="primary" style="margin-top: 20px;" @click="submitTextAnswer">提交补充因素（待审核）</el-button>
            </div>
          </div>
          <div v-if="currentCard === 2">
            <span style="font-size: 12px;"> 自定义分类：手动定义分类结果</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="margin-top: 10px;">
          <el-button @click="onUpdateVisible(false)">取消</el-button>
          <el-button type="primary" @click="onConfirm" class="apply-mode-btn">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref } from "vue";
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
const simState2 = ref(0);
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
];

// 默认选中第一个卡片
const currentCard = ref(1);

// qaMode 控制问答类型：'image' 为图片问答，'text' 为文字问答
const qaMode = ref('text');

// 切换问答模式的函数
const toggleQaMode = () => {
  qaMode.value = qaMode.value === 'image' ? 'text' : 'image';
};

// 文字多选题相关状态
const selectedFactors = ref([]); // 存储用户选择的系统默认因素
const selectedFactors2 = ref([]); // 存储用户选择的自定义因素
const supplementaryOption = ref(''); // 存储用户输入的补充选项

// 提交文字答案的函数
const submitTextAnswer = () => {
  console.log('用户选择的系统默认因素:', selectedFactors.value);
  console.log('用户选择的自定义因素:', selectedFactors2.value);
  if (supplementaryOption.value) {
    console.log('用户补充的因素:', supplementaryOption.value);
  }
};

// 点击卡片时更新选中状态
const handleCardClick = (id) => {
  currentCard.value = id;
};

const handleClose = (done) => {
  done();
  emit("close");
  emit("update:model-value", false);
};

const onUpdateVisible = (newValue) => {
  emit("close");
  emit("update:model-value", false);
};

// 查找方式切换
const searchMode = ref('multi'); // multi: 多股票对比查找, history: 本股票历史行情查找
const dateRange = ref([new Date('2016-01-02'), new Date('2016-06-20')]);

const searchInfo = store.state.searchInfo;
const onConfirm = () => {
  // 根据当前问答模式收集不同的答案
  if (qaMode.value === 'text') {
    console.log('=== 文字问答答案 ===');
    console.log('系统默认因素选择:', selectedFactors.value);
    console.log('自定义因素选择:', selectedFactors2.value);
    if (supplementaryOption.value) {
      console.log('补充因素:', supplementaryOption.value);
    }
  } else {
    console.log('=== 图片问答答案 ===');
    console.log('第1组图片: ', simState.value === 1 ? '相似' : simState.value === 2 ? '不相似' : '未选择');
    if (simState.value === 1) {
      console.log('第1组相似度评分:', similarityScore.value);
    }
    
    console.log('第2组图片: ', simState1.value === 1 ? '相似' : simState1.value === 2 ? '不相似' : '未选择');
    if (simState1.value === 1) {
      console.log('第2组相似度评分:', similarityScore1.value);
    }
    
    console.log('第3组图片: ', simState2.value === 1 ? '相似' : simState2.value === 2 ? '不相似' : '未选择');
    if (simState2.value === 1) {
      console.log('第3组相似度评分:', similarityScore2.value);
    }
    
    console.log('第4组图片: ', simState3.value === 1 ? '相似' : simState3.value === 2 ? '不相似' : '未选择');
    if (simState3.value === 1) {
      console.log('第4组相似度评分:', similarityScore3.value);
    }
    
    console.log('第5组图片: ', simState4.value === 1 ? '相似' : simState4.value === 2 ? '不相似' : '未选择');
    if (simState4.value === 1) {
      console.log('第5组相似度评分:', similarityScore4.value);
    }
  }
  
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