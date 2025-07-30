<template>
  <div id="current-page">
    <div style="margin: -8px">
      <el-container class="container">
        <div class="logo">MA均线分析平台</div>
      </el-container>
      <el-container style="height: 94vh;">
        <!--左侧股票检索部分-->
        <el-aside>
          <div style="height: 340px; background-color: #f3f3f3; border-radius: 10px; margin-top: 5px; margin-left: 5px;">
            <el-tabs
              class="custom-tabs" v-model="activeName1" style="margin-left: 10px; width: 275px; "
            >
              <el-tab-pane label="全部股票" name="near" style="">
                <el-input
                  v-model="searchQuery"
                  style="height: 25px; font-size: 12px; width: calc(98.5%);"
                  placeholder="搜索全部股票"
                />
                <el-table
                  :data="filteredTableData1(item)"
                  class="scrollable-div"
                  max-height="240"
                  style="border-radius: 8px;"
                  border
                >
                  <el-table-column
                    fixed="left"
                    label="股票名称"
                    :width="getColumnWidth(0.4)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <div style="display: flex; flex-direction: column">
                        <span
                          style="font-size: 13px"
                          @click="handleRowClick(scope.row)"
                          >{{ scope.row.name }}</span
                        >
                        <span
                          style="
                            font-size: 10px;
                            color: #999;
                            margin-top: -7px;
                          ">{{ scope.row.code }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="ratio"
                    label="涨跌幅"
                    :width="getColumnWidth(0.3)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 13px">{{
                        scope.row.ratio
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="value"
                    label="涨跌额"
                    :width="getColumnWidth(0.3)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 13px">{{
                        scope.row.value
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="我的自选" name="self">
                <el-input
                  v-model="searchQuery"
                  style="height: 25px; width: calc(98.5%); font-size: 12px;"
                  placeholder="搜索我的自选"
                />
                <el-table
                  :data="filteredTableData2(item)"
                  style="
                    height: 230px;
                    font-size: 12px;
                    margin-top: 5px;
                    border-radius: 8px;
                  "
                  max-height="230"
                  border
                >
                  <el-table-column
                    fixed="left"
                    label="股票名称"
                    :width="getColumnWidth(0.4)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <div style="display: flex; flex-direction: column">
                        <span
                          style="font-size: 14px;"
                          @click="handleRowClick(scope.row)"
                        >{{ scope.row.name }}</span>
                        <span
                          style="
                            font-size: 10px;
                            color: #999;
                            margin-top: -7px;
                          "
                          >{{ scope.row.code }}</span
                        >
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="ratio"
                    label="涨跌幅"
                    :width="getColumnWidth(0.3)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 13px">{{
                        scope.row.ratio
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="value"
                    label="涨跌额"
                    :width="getColumnWidth(0.3)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 13px">{{
                        scope.row.value
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="scrollable-div" style="height: 340px; background-color: #f3f3f3; margin-top: 5px; border-radius: 10px;margin-left: 5px; overflow-y: auto;">
            <div style="height: auto;">
              
              <div class="div4 stock-mode-step2" style="margin-left: 15px; width: 130px; margin-top: 10px;">基准股票时间区间设置</div>
                <div>
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    size="small"
                    style="
                      width: calc(100% - 50px);
                      margin-top: 5px;
                      margin-left: -7px;
                    "
                    @change="handleDateChange"/>
                </div>
              <div v-if="isChooseStock" style="display: flex; margin-left: -25px; margin-top: -10px;">
                <div class="div2">选股考察区间：</div>
                <el-select
                  v-model="value"
                  placeholder="请选择查找区间"
                  size="small"
                  style="width: 168px; margin-left: -35px; margin-top: 17px;"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-if="isHistorySearch">
                <div style="margin-top: 10px; margin-left: -3px;">
                  <div  style="margin-top: 10px">
                      <el-button
                        plain
                        @click="dialogVisible = true"
                        class="custom-button btn-search-range"
                        style="margin-top: 0px; width: 270px; margin-left: -5px;"
                      >
                        请选择待查找股票集
                      </el-button> 
                    <!----------------Dialog-------------------->
                    <DialogChoose2
                      :visible="dialogVisible"
                      @close="dialogVisible = false"
                    />
                  </div>
                </div>

                <div>
                  <div class="div2" style="width: 200px; margin-left: -15px; margin-top: 5px;">设置查找历史时间范围：</div>
                  <el-date-picker
                        v-model="value2"
                        type="daterange"
                        range-separator="To"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        size="small"
                        style="
                          width: calc(100% - 48px);
                          margin-top: 5px;
                          margin-left: -10px;
                        "
                        @change="handleDateChange2"
                      />
                </div>
              </div>


              <div style="font-size: 13px; font-weight: 700; color:#a9a9a9; background-color: #ededed; padding: 1px; width: 275px; margin-left: 10px; margin-top: 15px;">|    选用均线类型设置 ————————————</div>
              <div class="div5 tour-ma-config">
                <div
                  style="
                    font-size: 13px;
                    font-weight: bold;
                    margin-left: -180px;
                    margin-top: 5px;
                  "
                >
                  基础 MA 指标:
                </div>
                <el-checkbox-group
                  v-model="store.state.modeInfo.lines"
                  class="custom-checkbox-group"
                  style="margin-top: 0px; margin-left: 15px;"
                >
                  <el-checkbox
                    v-for="item in maList"
                    :key="item"
                    :label="item"
                    :value="item"
                    class="custom-checkbox"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="div7 tour-Market-index">
                <div
                  style="
                    font-size: 13px;
                    font-weight: bold;
                    margin-left: -180px;
                    margin-top: 6px;
                  "
                >
                  上证/深证指数:
                </div>
                <el-checkbox-group
                  v-model="store.state.modeInfo.lines1"
                  class="custom-checkbox-group"
                  style = "margin-left: 15px;"
                >
                  <el-checkbox
                    v-for="item in maList"
                    :key="item"
                    :label="item"
                    :value="item"
                    class="custom-checkbox"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>

              <div class="div7 tour-career-index">
                <div
                  style="
                    font-size: 13px;
                    font-weight: bold;
                    margin-left: -210px;
                    margin-top: 6px;
                  "
                >
                  行业指数:
                </div>
                <el-checkbox-group
                  v-model="store.state.modeInfo.lines2"
                  class="custom-checkbox-group"
                  style = "margin-left: 15px;"
                >
                  <el-checkbox
                    v-for="item in maList"
                    :key="item"
                    :label="item"
                    :value="item"
                    class="custom-checkbox"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>

              <div style="margin-left: -10px; margin-top: 15px; margin-bottom: 10px;">
                <el-button @click="getShowDialog" type="primary" plain style="font-size: 13px; height: 26px; width: 120px;" >配置确认</el-button>
                <el-button type="primary" plain style="margin-left: 5px; font-size: 13px; height: 26px; width: 120px;" @click="getResult">开始查找</el-button>
              </div>
              <DialogBullish
                :visible ="showDialog"
                @close="showDialog = false"
              />

              <div v-if="isGetResult">
                <div style="font-size: 13px; font-weight: 700; color:#8c8c8c; background-color: #ededed; padding: 1px; width: 275px; margin-left: 10px; margin-top: 10px;">|    相似股票筛选结果 ————————————</div>
                <!--展示对比股票-->
                <el-table
                  :data="tableDataRecent"
                  class="scrollable-div"
                  max-height="295px"
                  style="margin-left: 10px; margin-top: 10px; border-radius: 10px; width:275px; margin-bottom: 10px;"
                  border
                >
                  <el-table-column
                    property="index"
                    label="股票名称"
                    :width="getColumnWidth(0.35)"
                    header-align="center"
                    
                  >
                    <template #default="scope">
                        <div style="height: 6px;"></div>
                        <span style="font-size: 13px; padding: 2px;" @click="handleRowClick1(scope.row)">{{ scope.row.name }}</span>
                        <div style="height: 6px;"></div>
                      </template>
                  </el-table-column>
                  <el-table-column
                    property="code"
                    label="股票代码"
                    :width="getColumnWidth(0.35)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 12px">{{ scope.row.code }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="similarity"
                    label="相似程度"
                    :width="getColumnWidth(0.32)"
                    header-align="center"
                  >
                    <template #default="scope">
                      <el-button 
                        size="small" 
                        type="warning" 
                      >
                        {{ scope.row.sim }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="isGetResult2">
                <div style="font-size: 13px; font-weight: 700; color:#8c8c8c; background-color: #ededed; padding: 1px; width: 275px; margin-left: 10px; margin-top: 10px;">|    相似股票筛选结果 ————————————</div>
                <!--展示股票结果数-->
                <el-table
                  :data="tableDataRecent1"
                  class="scrollable-div"
                  max-height="295px"
                  style="margin-left: 10px; margin-top: 10px; border-radius: 10px; width:275px; margin-bottom: 10px;"
                  border
                >
                  <el-table-column
                    property="index"
                    label="股票名称"
                    :width="getColumnWidth(0.32)"
                    header-align="center"
                    
                  >
                    <template #default="scope">
                        <div style="height: 6px;"></div>
                        <span style="font-size: 13px; padding: 2px;" @click="handleRowClick1(scope.row)">{{ scope.row.name }}</span>
                        <div style="height: 6px;"></div>
                      </template>
                  </el-table-column>
                  <el-table-column
                    property="code"
                    label="股票代码"
                    :width="getColumnWidth(0.35)"
                    align="center"
                    header-align="center"
                  >
                    <template #default="scope">
                      <span style="font-size: 12px">{{ scope.row.code }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="count"
                    label="相似结果数"
                    :width="getColumnWidth(0.4)"
                    align="center"
                    header-align="center"
                    
                  >
                    <template #default="scope">
                      <span style="font-size: 12px; text-align: center;">{{ scope.row.count }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

        </el-aside>
        <!--右侧中央均线展示部分-->
        <el-main
          style="background-color: white; padding: 0; position: relative; height: 100%; min-height: 0;"
          class="hide-scrollbar"
        >
          <!--选中股票信息展示部分-->
          <div
            style="
              display: flex;
              background-color: #e1f0ff ;
              height: 80px;
              position: sticky;
              top: 0;
              z-index: 100;
              width: 99%;
              border-radius: 10px;
              margin-top: 5px;
              margin-left: 5px;
              /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
            "
          >
            <div style="display: flex; flex-direction: column; justify-content: flex-start; min-width: 900px;">
              <!-- 股票名、代码、现手等单独一行（7列） -->
              <div style="display: flex; align-items: center; padding-top: 5px;">
                <span style="margin-top:-3px; font-weight: bold; margin-left: 14px; display: inline-block;">{{ stockShowInfo.name }} </span>
                <span style="font-weight: bold;  margin-left: 5px; display: inline-block;">({{ stockShowInfo.code }})</span>
                <span style="margin-left: 10px; display: inline-block; font-weight: bold;" :style="{color: valueColor, 'font-weight': 'bold'}">{{ stockShowInfo.value }}</span>
                <span style="margin-left: 2px; display: inline-block;" :style="{color: valueColor, 'font-weight': 'bold', 'margin-top':'-5px'}">↑</span>
                <span style="margin-left: 15px; display: inline-block; font-weight: bold;" :style="{color: ratioColor, 'font-weight': 'bold'}">{{ stockShowInfo.ratio }}</span>
                <span style="margin-left: 10px; display: inline-block;"></span>
                <span style="margin-left: 10px; display: inline-block;">
                  <el-tooltip :content="isSelected ? '已添加' : '添加到自选'" placement="top">
                    <el-icon size="20" style="margin-top: 2px; cursor: pointer;" @click="toggleFavorite" :color="isSelected ? '#222' : '#aaa'">
                      <component :is="isSelected ? StarFilled : Star" />
                    </el-icon>
                  </el-tooltip>
                </span>
                <!-- <el-button
                  type="primary"
                  class="btn-base-stock"
                  style="margin-top: 0px; margin-left: -20px; height: 25px; font-size: 12px; font-weight: bold; width: 100px;"
                  @click="handleAnalyze"
                >设置为基准股票</el-button> -->
              </div>

              <!-- 第一行标签（7列） -->
              <div style="display: flex; align-items: left; padding-top: 5px; font-size: 12px; margin-left: 7px;">
                <span style="min-width: 90px; margin-left: 7px; display: inline-block;">日期：2025-05-23</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA4：19.560</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA8：19.959</span>
                <span style="min-width: 90px; margin-left: 14px; display: inline-block;">MA12：19.935</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA16：20.054</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA20：20.179</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA47：19.899</span>
              </div>
              <!-- 第二行标签（7列） -->
              <div style="display: flex; align-items: left; padding-top: 2px; font-size: 12px; margin-left: 15px;">
                <span style="min-width: 90px; margin-left: -15px; display: inline-block;">板块：主板</span>
                <span style="min-width: 90px; margin-left: 6px; display: inline-block;">行业：计算机、通信和其他电子设备制造业</span>
              </div>
            </div>
          </div>
          <!--MA曲线展示部分-->
          <div style="display: flex; margin-top: 20px; width: 100%; justify-content: center; align-items: flex-start;">
            <div style="width: 1000px; gap: 0px; margin-top: -40px; margin-left: -60px;">
                <Graph style="position: relative; z-index: 3;" :code="graphCode1" :startDate="modeInfo.startDate" :endDate="modeInfo.endDate" :checkListMAOption="store.state.modeInfo.lines" :width="1050" :height="240" :legendData="store.state.modeInfo.lines" />
                <Graph style="position: relative; z-index: 2; margin-top: -40px;" :code="graphCode3" :startDate="modeInfo.startDate" :endDate="modeInfo.endDate" :checkListMAOption="store.state.modeInfo.lines2" :width="1050" :height="240" :legendData="store.state.modeInfo.lines2" />
                <Graph style="position: relative; z-index: 1; margin-top: -40px;" :code="graphCode2" :startDate="modeInfo.startDate" :endDate="modeInfo.endDate" :checkListMAOption="store.state.modeInfo.lines1" :width="1050" :height="240" :legendData="store.state.modeInfo.lines1" />            </div>
            <div style="margin-left: 10px;"><ModeCards /></div>
          </div>
          <hr style="margin-top:10px; margin-bottom: 0px;"/>
          <!--结果展示部分-->
          <ResultShow v-if="resultType"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { nextTick, ref, watch, computed, reactive } from "vue";
import axios from "axios";
import { useStore } from "vuex";

// 引入子组件
import ModeCards from "@/views/ModeCards.vue";
import ResultShow from "@/views/ResultShow.vue";
import Graph from "@/views/Graph.vue";
import DialogBullish from "@/views/DialogBullish.vue";
import DialogChoose2 from "@/views/DialogChoose2.vue";

const value = ref('')
const isGetResult = ref(false);
const isGetResult2 = ref(false);

const options = [
  {
    value: '近20天',
    label: '近20天',
  },
    {
    value: '近30天',
    label: '近30天',
  },
    {
    value: '近40天',
    label: '近40天',
  },
 
]

// dialog测试数据 ********************************
const showDialog = ref(false);

// 设置全局store数据
const store = useStore();
const resultType = ref(false);
const resultMode = ref(false);
const resultStock = ref(false);
const dialogVisible = ref(false);
const graphCode1 = ref("000021");
const graphCode2 = ref("000001");
const graphCode3 = ref("600746");
const maList = ref(["MA4", "MA8", "MA12", "MA16", "MA20", "MA47"]);
// const isBaseStock = computed(() => {
//   return store.state.baseInfo.isStock === true;
// });
// const isBaseMode = computed(() => {
//   return store.state.baseInfo.isMode === true;
// });
// const isDisabled = computed(() => {
//   return store.state.baseInfo.isDisabled === true;
// });
const isSelected = computed(() => {
  const code = stockShowInfo.value?.code;
  return store.state.stockList.some(item => item.code === code && item.isSelected);
});
const isHistorySearch = computed(() => {
  return store.state.baseInfo.isHistorySearch === true;
});

const isChooseStock = computed(() => {
  return store.state.baseInfo.isChooseStock === true;
});

// 定义响应式状态
const baseInfo = reactive({
  isHistory: false, // 是否为历史查找
  isCross: false,   // 是否为横向对比查找
  isSection: false, // 是否为区间
  isChoose: false,  // 是否为选股
});
// 状态重置函数
const resetBaseInfo = () => {
  baseInfo.isHistory = false;
  baseInfo.isCross = false;
  baseInfo.isSection = false;
  baseInfo.isChoose = false;
};

const getButtonType = (weight) => {
  switch (weight) {
    case 3: return 'danger';      // 极强 - 红色
    case 2: return 'warning';     // 强 - 橙色
    case 1: return 'success';     // 中 - 绿色
    case 0: return 'primary';     // 弱 - 蓝色
    default: return 'default';    // 默认 - 灰色
  }
};

// 收藏/取消收藏逻辑
const toggleFavorite = () => {
  const code = stockShowInfo.value?.code;
  if (!code) return;
  const idx = store.state.stockList.findIndex(item => item.code === code);
  if (idx !== -1) {
    if (!store.state.stockList[idx].isSelected) {
      // 加入自选
      store.state.stockList[idx].isSelected = true;
      // 可选：弹窗提示"已添加到自选"
    } else {
      // 已在自选，再次点击则移除
      store.state.stockList[idx].isSelected = false;
      // 可选：弹窗提示"已移除自选"
    }
  }
};

// // 切换按钮状态的方法
// const toggleButton = (key) => {
//   console.log("切换按钮状态------------------", key);
//   // 如果点击的按钮当前为true，则点击后设为false
//   if (baseInfo[key]) {
//     baseInfo[key] = false;
//   } else {
//     // 否则将点击的设为true，另一个设为false
//     baseInfo.isHistory = key === 'isHistory';
//     baseInfo.isCross = key === 'isCross';
//   }
// };

// const toggleButton1 = (key) => {
//   console.log("切换第一序列按钮状态------------------", key);
//   // 如果点击的按钮当前为true，则点击后设为false
//   if (baseInfo[key]) {
//     baseInfo[key] = false;
//   } else {
//     // 否则将点击的设为true，另一个设为false
//     baseInfo.isChoose = key === 'isChoose';
//     baseInfo.isSection = key === 'isSection';
//   }
// };

// 在组件 setup 函数中添加监听
watch(() => baseInfo.isSection,(newValue) => {
    if (newValue === false) {
      baseInfo.isHistory = false;
      baseInfo.isCross = false;
    }
  }
);

// 新手指引--------------------------------------------------
// 导入ref
const stockTourVisible = ref(false);   // 个股指引显示状态
const modeTourVisible = ref(false);    // 推荐模式指引显示状态
const tourStep = ref(0);
const modeTourStep = ref(0);

// 开启指引方法
const startStockTour = () => {
  console.log("点击了个股新手指引");
  setTimeout(() => {
    stockTourVisible.value = true;
  }, 80);
};

const startModeTour = () => {
  console.log("点击了推荐模式新手指引");
  setTimeout(() => {
    modeTourVisible.value = true;
  }, 80);
};


// input查找目标股票--------------------------------------------------
const searchQuery = ref("");
const filteredTableData1 = (item) => {
  return store.state.stockList.filter((row) => {
    return (
      row.code.includes(searchQuery.value) ||
      row.name.includes(searchQuery.value)
    );
  });
};
const filteredTableData2 = (item) => {
  return store.state.stockList.filter((row) => {
    return (
      (row.code.includes(searchQuery.value) ||
        row.name.includes(searchQuery.value)) &&
      row.isSelected === true
    );
  });
};

// const tableDataRecent = ref(store.state.stockList1);
const tableDataRecent = ref([
  {
    code: '002165',
    name: '红宝丽',
    weight: 3,
    sim: '极强',
  },
  {
    code: '002057',
    name: '中钢天源',
    weight: 2,
    sim: '强',
  },
  {
    code: '002455',
    name: '百川股份',
    weight: 2,
    sim: '强',
  },
  {
    code: '000830',
    name: '鲁西化工',
    weight: 1,
    sim: '中',
  },
  {
    code: '001207',
    name: '联科科技',
    weight: 0,
    sim: '弱',
  },
])

const tableDataRecent1 = ref([
  {
    code: '001255',
    name: '博菲电器',
    count: 21,
  },
  {
    code: '001333',
    name: '光华股份',
    count: 20,
  },
  {
    code: '000830',
    name: '鲁西化工',
    count: 10,
  },
  {
    code: '002913',
    name: '奥士康',
    count: 8,
  },
  {
    code: '002106',
    name: '莱宝高科',
    count: 6,
  },
  {
    code: '001207',
    name: '联科科技',
    count: 5,
  },
])

// 界面展示股票信息
const stockShowInfo = ref();
stockShowInfo.value = store.state.stockShowInfo;

// 用户当前设置的模式信息
const modeInfo = store.state.modeInfo;
const searchInfo = store.state.searchInfo;

const getShowDialog = () => {
  console.log("点击了自定义配置按钮");
  showDialog.value = true;
};

// 处理生成结果按钮的点击事件
const getResult = async() => {
  console.log("生成结果------------------------");
  
  const timestamp = new Date().getTime();
  const newLines = store.state.modeInfo.lines.map(item => parseInt(item.replace('MA', ''), 10));
  
  console.log("当前的modeInfo------------------", store.state.modeInfo);
  if(isChooseStock.value === true)
  {
    isGetResult.value = true;
  }
  if(isHistorySearch.value === true)
  {
    isGetResult2.value = true;
  }
  // **************** 历史相似模式检测0713 ****************
  // try {
  //   resultType.value = true;
  //   console.log("modeInfo----", store.state.modeInfo)
  //   console.log("searchInfo----", store.state.searchInfo)
  //   // 获取股票模式检测结果
  //   const response = await axios.post(
  //     `http://127.0.0.1:5000/detect_sim_history?timestamp=${timestamp}`,
  //     {
  //       pool: searchInfo.stockList, // 备选股票池
  //       base_code: store.state.modeInfo.index,
  //       base_start_date: store.state.modeInfo.startDate,
  //       base_end_date: store.state.modeInfo.endDate,
  //       start_date: searchInfo.searchStartDate, // 开始时间
  //       end_date: searchInfo.searchEndDate, // 结束时间
  //       ma_list: newLines.slice(1), // MA列表
  //     },
  //     {
  //       withCredentials: true,  // 如果需要携带凭证
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   );
  //   console.log("获取到的结果列表------------------", response.data);
  //   store.state.resultInfo.futureIncome = response.data.overall_return;
  //   store.state.resultList2 =  response.data.result;    
  // }catch (error) {
  //   console.error('errors:', error);
  // }
};

// 处理分析按钮的点击事件,设置当前股票为基准股票【更新modeInfo的数据】
// const handleAnalyze = () => {
//   resetBaseInfo();
//   const foundStock = store.state.stockList.find(
//     (item) => item.code === stockShowInfo.value.code
//   );
//   console.log("设置为基准股票--------------", foundStock);
//   store.commit("updateModeInfo", {
//     index: foundStock.code,
//     name: foundStock.name,
//     startDate: "2023-03-30",
//     endDate: "2023-04-21",
//     isMode: false, // 不是模式而是股票
//     lines: ["个股", "MA4", "MA8", "MA12","MA16", "MA20", "MA47"],
//     lines1: ["深证指数", "MA4", "MA8", "MA12","MA16", "MA20", "MA47"],
//     lines2: ["行业指数", "MA4", "MA8", "MA12","MA16", "MA20", "MA47"],
//   });
//   store.commit("updateBaseInfo", {
//     isMode: false,
//     isStock: true,
//     currentFunction: "个股模式查找"
//   });
//   value1.value = ['2023-03-30', '2023-04-21'];
// };

// 定义点击事件处理函数
const handleRowClick = async (row) => {
  const code = row.code;
  graphCode1.value = code; // 修改子图的数据
  // 通过code的起始值判断上证指数 or 深证指数
  if (code.startsWith('0')) {
    graphCode2.value =  '000001'; // 上证指数
  } else if (code.startsWith('6')) {
    graphCode2.value =  '399001'; // 深证指数
  }
  const foundStock = store.state.stockList.find((item) => item.code === code);
  stockShowInfo.value = { ...foundStock };
};

// ------------------------------------------------------------------------
// 定义点击事件处理函数，处理相似股票结果的点击事件
const handleRowClick1 = async (row) => {
  // 标记显示结果详情
  const code = row.code;
  const startDate = new Date('2024-09-24');
  const endDate = new Date('2024-11-13');
  store.commit("updateResultStockInfo", {
    code: code,
    name: row.name,
    startDate: startDate,
    endDate: endDate,
  });
  if(isChooseStock.value === true)
    {
      isGetResult.value = true;
    }
    if(isHistorySearch.value === true)
    {
      isGetResult2.value = true;
    }
    resultType.value = true;
};

// -------------------------------------------------------------------------------
const activeName1 = ref("near");
const value1 = ref([store.state.modeInfo.startDate, store.state.modeInfo.endDate]); // 选择的日期范围
const value2 = ref([searchInfo.searchStartDate, searchInfo.searchEndDate]); // 选择的日期范围
const value3 = ref([]); // 选择的日期范围

// 监听基准股票日期范围的变化
watch(value1, () => {
  store.state.modeInfo.startDate = value1.value[0];
  store.state.modeInfo.endDate = value1.value[1];
  value3.value = value1.value;
  value2.value = value1.value;
  // tableDataRecent.value = [{
  //   code: store.state.modeInfo.index,
  //   name: store.state.modeInfo.name,
  // }];
  
});

// 监听带查找股票池日期范围的变化
watch(searchInfo, () => {
    value2.value = [searchInfo.searchStartDate, searchInfo.searchEndDate];
    if(baseInfo.isHistory === false)
    {
      tableDataRecent.value = searchInfo.stockList;
    }
});

watch(() => store.state.baseInfo.isMode,(newValue) => {
    if (newValue === true && store.state.modeInfo.index === "BA2") {
      resultType.value = false;
      resultMode.value = true;
      resultStock.value = false;
    }
    if(newValue === false){
      resultType.value = true;
      resultMode.value = false;
      resultStock.value = false;
    }
  }
);

watch(() => baseInfo.isChoose,(newValue) => {
    if (newValue === true) {
      resultType.value = false;
      resultMode.value = false;
      resultStock.value = true;
    }
    else
    {
      resultType.value = true;
      resultMode.value = false;
      resultStock.value = false;
    }
  }
);

const newStartDate = ref(new Date("2016-01-02"));
const newEndDate = ref(new Date("2016-06-20"));

function formatDateToLocal(date) {
  const year = date.getFullYear();
  // 月份从 0 开始，需要 +1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 时间选择触发刷选+缩放
function handleDateChange(val) {
  if (!val || val.length !== 2) return;
  let [startDate, endDate] = val;

  // 【1】保证 startDate endDate 都转成 'yyyy-MM-dd' 字符串
  if (startDate instanceof Date) {
    startDate = formatDateToLocal(startDate);
    newStartDate.value = startDate;
    modeInfo.startDate = startDate; // 更新模式信息中的开始日期
  }
  if (endDate instanceof Date) {
    endDate = formatDateToLocal(endDate);
    newEndDate.value = endDate;
    modeInfo.endDate = endDate; // 更新模式信息中的结束日期
  }
}

// 侧边栏宽度状态
const sidebarWidth = ref(290);
const minWidth = 330;
const maxWidth = 570;

// 拖动相关方法
const startResize = (e) => {
  e.preventDefault();
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;

  const handleResize = (e) => {
    const newWidth = startWidth + (e.clientX - startX);
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      sidebarWidth.value = newWidth;
    } else if (newWidth < minWidth) {
      sidebarWidth.value = minWidth;
    } else if (newWidth > maxWidth) {
      sidebarWidth.value = maxWidth;
    }
  };
  const stopResize = () => {
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
};

// 计算表格列宽
const getColumnWidth = (percentage) => {
  return (sidebarWidth.value - 30) * percentage;
};

// 监听侧边栏宽度变化，强制更新表格
watch(sidebarWidth, () => {
  nextTick(() => {
    // 触发表格重新渲染
    const currentPage = document.getElementById("current-page");
    if (currentPage) {
      const tables = currentPage.querySelectorAll(".el-table__header-wrapper");
      tables.forEach((table) => {
        const event = new Event("resize");
        window.dispatchEvent(event);
      });
    }
  });
});


// const handleTourChange = async (current, prev) => {
//   // STEP 1: 自动点击"设置基准股票"按钮
//   if (current === 1) {
//     handleAnalyze();

//     // 等待 DOM 更新完毕
//     await nextTick();

//     // 再延迟进入 Step 2
//     setTimeout(() => {
//       tourStep.value = 2;
//     }, 3000); // 建议 2~3 秒最合适
//   }

//   // STEP 4.1: 自动点击"自定义模式评价"按钮，并延迟跳转到下一个step
//   if (current === 11) {
//     const customEvaluationButton = document.querySelector('.custom-evaluation-button');
//     if (customEvaluationButton) {
//       customEvaluationButton.click();
//       await nextTick();
//       setTimeout(() => {
//         tourStep.value = 12; // 跳转到下一个step
//       }, 800);
//     }
//   }

//   // STEP 4.2.1: 自动点击"本股票历史行情"按钮，并延迟跳转到下一个step
//   if (current === 13) {
//     const customEvaluationButton = document.querySelector('.custom-evaluation-button-4-2-2');
//     if (customEvaluationButton) {
//       customEvaluationButton.click();
//       await nextTick();
//     }
//   }

//   if (current === 15) {
//     const customEvaluationButton = document.querySelector('.btn-search-range');
//     if (customEvaluationButton) {
//       customEvaluationButton.click();
//       await nextTick();
//     }
//   }

//   // STEP 4.3: 自动点击相似模式选股按钮，并延迟点击"请选择待查找股票集合"按钮
//   if (current === 16) {
//     const similarModeBtn = document.querySelector('.custom-evaluation-button-4-3');
//     if (similarModeBtn) {
//       similarModeBtn.click();
//       await nextTick();
//       setTimeout(() => {
//         const searchRangeBtn = document.querySelector('.btn-search-range');
//         if (searchRangeBtn) {
//           searchRangeBtn.click();
//           tourStep.value = 17; // 跳转到下一个step
//         }
//       }, 800); // 可根据需要调整延迟
//     }
//   }
// };

function handleDateChange2(val) {
  if (!val || val.length !== 2) return;
  let [startDate, endDate] = val;
  if (startDate instanceof Date) {
    startDate = formatDateToLocal(startDate);
    newStartDate.value = startDate;
    searchInfo.searchStartDate = startDate; // 更新模式信息中的开始日期
  }
  if (endDate instanceof Date) {
    endDate = formatDateToLocal(endDate);
    newEndDate.value = endDate;
    searchInfo.searchEndDate = endDate; // 更新模式信息中的结束日期
  }
}

const handleModeTourChange = async (current, prev) => {
  // STEP 1: 自动点击推荐模式卡片标题，弹出弹窗
  if (current === 1) {
    const card = document.querySelector('.mode-card-title');
    if (card) {
      card.click();
    }
    setTimeout(() => {
      modeTourStep.value = 1; // 保证 el-tour 继续在第二步
    }, 9999);
  }
  // STEP 2: 自动点击应用推荐模式按钮，并延迟跳转到下一个step
  if (current === 2) {
    const applyModeBtn = document.querySelector('.apply-mode-btn-step2');
    if (applyModeBtn) {
      applyModeBtn.click();
      await nextTick();
      setTimeout(() => {
        modeTourStep.value = 3; // 跳转到下一个step
      }, 800); // 可根据需要调整延迟
    }
  }
  // 自定义模式评价
  if (current === 11) {
    const customEvaluationButton = document.querySelector('.custom-evaluation-button');
    if (customEvaluationButton) {
      customEvaluationButton.click();
      await nextTick();
    }
  }
  // 多股票横向查找
  if (current === 12) {
    const customEvaluationButton = document.querySelector('.btn-search-range');
    if (customEvaluationButton) {
      customEvaluationButton.click();
      await nextTick();
    }
  }

  // STEP 4.3: 自动点击相似模式选股按钮，并延迟点击"请选择待查找股票集合"按钮
  if (current === 15) {
    const similarModeBtn = document.querySelector('.custom-evaluation-button-4-3');
    if (similarModeBtn) {
      similarModeBtn.click();
      await nextTick();
      setTimeout(() => {
        const searchRangeBtn = document.querySelector('.btn-search-range');
        if (searchRangeBtn) {
          searchRangeBtn.click();
          tourStep.value = 17; // 跳转到下一个step
        }
      }, 800); // 可根据需要调整延迟
    }
  }
};

// 计算涨跌颜色和样式
const upColor = '#ec0000'; // 红色
const downColor = '#00da3c'; // 绿色
const isUp = computed(() => {
  // 只要value或ratio有+号或为正数就认为是涨
  const v = stockShowInfo.value?.value || stockShowInfo.value?.ratio || '';
  return (typeof v === 'string' && v.includes('+')) || (parseFloat(v) > 0);
});
const valueColor = computed(() => {
  const v = stockShowInfo.value?.value || '';
  if (typeof v === 'string' && v.includes('-')) return downColor;
  if (typeof v === 'string' && v.includes('+')) return upColor;
  return parseFloat(v) >= 0 ? upColor : downColor;
});
const ratioColor = computed(() => {
  const v = stockShowInfo.value?.ratio || '';
  if (typeof v === 'string' && v.includes('-')) return downColor;
  if (typeof v === 'string' && v.includes('+')) return upColor;
  return parseFloat(v) >= 0 ? upColor : downColor;
});

</script>

<style src="@/styles/basic.css">
</style>   
