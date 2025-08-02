<template>
  <div id="current-page">
    <div style="margin: -8px">
      <el-container class="container">
        <div class="logo">MA均线分析平台</div>
      </el-container>
      <el-container style="height: 94vh;">
        <el-aside>
          <div style="height: 440px; background-color: #f3f3f3; border-radius: 10px; margin-top: 5px; margin-left: 5px;">
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
                  max-height="335"
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
                    height: 335px;
                    font-size: 12px;
                    margin-top: 5px;
                    border-radius: 8px;
                  "
                  max-height="335"
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

          <div class="scrollable-div" style="height: 240px; background-color: #f3f3f3; margin-top: 5px; border-radius: 10px;margin-left: 5px; overflow-y: auto;">
            <div style="height: auto;">
              <div class="div5 tour-ma-config">
                <div
                  style="
                    font-size: 13px;
                    font-weight: bold;
                    margin-left: -160px;
                    margin-top: 5px;
                  "
                >
                  基础 MA 指标设置:
                </div>
                <el-checkbox-group
                  v-model="store.state.modeInfo.lines"
                  class="custom-checkbox-group"
                  style="margin-top: 5px; margin-left: 15px;"
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

              <div v-if="isChooseStock" style="display: flex; margin-left: -25px; margin-top: -5px;">
                <div class="div2">选股考察区间：</div>
                <el-select
                  v-model="recentNDaysValue"
                  placeholder="请选择查找区间"
                  size="small"
                  style="width: 168px; margin-left: -35px; margin-top: 17px;"
                  @change="handleRecentNDaysChange"
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


              <div style="margin-left: -8px; margin-top: 15px; margin-bottom: 10px;">
                <el-button @click="getShowDialog" type="primary" plain style="font-size: 13px; height: 24px; width: 132px;" >配置确认</el-button>
                <el-button type="primary" plain style="margin-left: 5px; font-size: 13px; height: 24px; width: 132px;" @click="getResult">开始查找</el-button>
              </div>
              <DialogBullish
                :visible ="showDialog"
                @close="showDialog = false"
              />

              <div v-if="isGetResult">
                <div style="font-size: 13px; font-weight: 700; color:#8c8c8c; background-color: #ededed; padding: 1px; width: 275px; margin-left: 10px; margin-top: 10px;">|    相似股票筛选结果 ————————————</div>
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
        <el-main
          style="background-color: white; padding: 0; position: relative; height: 100%; min-height: 0;"
          class="hide-scrollbar"
        >
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
            "
          >
            <div style="display: flex; flex-direction: column; justify-content: flex-start; min-width: 900px;">
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
                </div>

              <div style="display: flex; align-items: left; padding-top: 5px; font-size: 12px; margin-left: 7px;">
                <span style="min-width: 90px; margin-left: 7px; display: inline-block;">日期：2025-05-23</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA4：19.560</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA8：19.959</span>
                <span style="min-width: 90px; margin-left: 14px; display: inline-block;">MA12：19.935</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA16：20.054</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA20：20.179</span>
                <span style="min-width: 90px; margin-left: 10px; display: inline-block;">MA47：19.899</span>
              </div>
              <div style="display: flex; align-items: left; padding-top: 2px; font-size: 12px; margin-left: 15px;">
                <span style="min-width: 90px; margin-left: -15px; display: inline-block;">板块：主板</span>
                <span style="min-width: 90px; margin-left: 6px; display: inline-block;">行业：计算机、通信和其他电子设备制造业</span>
              </div>
            </div>
          </div>
          <div style="display: flex; margin-top: 20px; width: 100%; justify-content: center; align-items: flex-start;">
            <div style="width: 1000px; gap: 0px; margin-top: 0px; margin-left: -60px;">
                <Graph
                  ref="graphRef"
                  style="position: relative; z-index: 10;"
                  :code="graphCode1"
                  :startDate="modeInfo.startDate"
                  :endDate="modeInfo.endDate"
                  :checkListMAOption="store.state.modeInfo.lines"
                  :width="1050"
                  :height="600"
                  :legendData="store.state.modeInfo.lines"
                  :selectedDatePreset="selectedDatePreset"
                  :isZoomLocked="isZoomLocked"
                  @brush-updated="handleBrushUpdated" 
                  :savedBrushes="savedBrushAreas"
                /> 
              <div style="border: 1px solid #cbcbcb; height: 140px; width: 90%; margin-top: -160px; margin-left: 80px; border-radius: 5px; overflow: hidden;">
                <!-- 为图片列表添加容器并应用Flex布局 -->
                <div style="display: flex; height: 100%; align-items: center; padding: 0 15px; overflow-x: auto; scrollbar-width: thin;">
                  <div v-for="img in imageList" :key="img.filename" class="image-gallery" style="margin-right: 15px; flex-shrink: 0;">
                    <img 
                      :src="img.url" 
                      :alt="img.filename" 
                      :title="img.filename"
                      class="screenshot-img"
                      style="width: 200px; height: 200px; object-fit: cover; border-radius: 3px; margin-top: 10px;"
                      @error="handleImageError(img)"
                    >
                  </div>
                </div>
                
                <!-- 空状态和加载状态保持不变，但添加居中样式 -->
                <div v-if="imageList.length === 0 && !loading" class="empty-state" style="height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">
                  暂无图片数据
                </div>
                <div v-if="loading" class="loading-state" style="height: 100%; display: flex; align-items: center; justify-content: center; color: #666;">
                  加载中...
                </div>
              </div>     
              </div>
            <div style="margin-left: 10px;"><ModeCards /></div>
          </div>
          <div style="position: absolute; top: 100px; right: 300px; z-index: 101;">
            <el-button size="small" @click="setDateRange('daily')">日线</el-button>
            <el-button size="small" @click="setDateRange('weekly')">周线</el-button>
            <el-button size="small" @click="setDateRange('monthly')">月线</el-button>
            <el-button size="small" @click="toggleZoomLock">
              {{ isZoomLocked ? '取消锁定' : '锁定缩放比' }}
            </el-button>
            <el-button size="small" @click="saveCurrentBrush" :disabled="!activeBrushData"> 保存当前标记
            </el-button>
            <el-button size="small" @click="getAllImages()">刷新选取结果</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="deleteServerFiles"
            >
              清空选取结果
            </el-button>
          </div>
          <hr style="margin-top:10px; margin-bottom: 0px;"/>
          <ResultShow v-if="resultType"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { nextTick, ref, watch, computed, reactive, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { StarFilled, Star } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
// 在 <script setup> 部分添加导入
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus'; // 同时导入消息提示组件（如果用到）


import ModeCards from "@/views/ModeCards.vue";
import ResultShow from "@/views/ResultShow.vue";
import Graph from "@/views/Graph.vue";
import DialogBullish from "@/views/DialogBullish.vue";
import DialogChoose2 from "@/views/DialogChoose2.vue";

const recentNDaysValue = ref('') 
const isGetResult = ref(false);
const isGetResult2 = ref(false);
const isZoomLocked = ref(false);
const savedBrushAreas = ref([]);

const activeBrushData = ref(null); 

const graphRef = ref(null);

const options = [
  { value: '近20天', label: '近20天' },
  { value: '近30天', label: '近30天' },
  { value: '近40天', label: '近40天' },
]

// 处理查找区间选择变化
const handleRecentNDaysChange = (value) => {
    console.log('通过v-model获取的选中值:', recentNDaysValue.value);
};

const showDialog = ref(false);

const store = useStore();
const resultType = ref(false);
const resultMode = ref(false);
const resultStock = ref(false);
const dialogVisible = ref(false);
const graphCode1 = ref("000021");
const maList = ref(["MA4", "MA8", "MA12", "MA16", "MA20", "MA47"]);
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

const baseInfo = reactive({
  isHistory: false,
  isCross: false,
  isSection: false,
  isChoose: false,
});
const resetBaseInfo = () => {
  baseInfo.isHistory = false;
  baseInfo.isCross = false;
  baseInfo.isSection = false;
  baseInfo.isChoose = false;
};


// 调用后端接口删除
const deleteServerFiles = () => {
  ElMessageBox.confirm(
    '确定要删除服务器上的指定文件夹数据吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const API_BASE_URL = 'http://127.0.0.1:5000';
      // const timestamp = new Date().getTime();
      const response = await axios.post(`${API_BASE_URL}/delete-files`, {
        folderPath: '/public/savepng' // 后端需要处理的文件夹路径
      });
      
      if (response.data.success) {
        ElMessage.success('服务器文件夹数据已成功删除');
        // 可选：刷新数据列表
        fetchImages(); // 例如重新获取图片列表，刷新视图
      } else {
        ElMessage.error('删除失败：' + response.data.msg);
      }
    } catch (err) {
      console.error('删除请求失败：', err);
      ElMessage.error('删除操作失败，请重试');
    }
  }).catch(() => {
    ElMessage.info('已取消删除操作');
  });
};


const imageList = ref([]);
const loading = ref(true);
const handleImageError = (img) => {
  img.url = 'https://picsum.photos/300/200?grayscale&blur=2';
};

// 获取图片列表函数（修改版）
const fetchImages = async () => {
  const timestamp = new Date().getTime();
  const API_BASE_URL = 'http://127.0.0.1:5000';
  try {
    loading.value = true;
    const response = await axios.get(`${API_BASE_URL}/get_all_screenshots?timestamp=${timestamp}`);
    
    if (response.data.success) {
      // 处理图片列表，修正URL并编码特殊字符
      imageList.value = response.data.images.map(image => ({
        ...image,
        // 1. 使用完整URL避免相对路径问题
        // 2. 对文件名名进行URL编码，处理空格、中文等特殊字符
        url: `${API_BASE_URL}/get_screenshot/${encodeURIComponent(image.filename)}`
      }));
    }
  } catch (err) {
    console.error('获取图片失败:', err);
    // 更详细的错误信息输出
    if (err.response) {
      console.error('错误状态码:', err.response.status);
      console.error('错误内容:', err.response.data);
    }
  } finally {
    loading.value = false;
  }
};
    

// 组件挂载时获取数据
onMounted(() => {
  fetchImages();
});

const getAllImages = () =>{
  fetchImages();
}

const toggleFavorite = () => {
  const code = stockShowInfo.value?.code;
  if (!code) {
    return;
  }
  const idx = store.state.stockList.findIndex(item => item.code === code);
  if (idx !== -1) {
    if (!store.state.stockList[idx].isSelected) {
      store.state.stockList[idx].isSelected = true;
    } else {
      store.state.stockList[idx].isSelected = false;
    }
  }
};

watch(() => baseInfo.isSection,(newValue) => {
    if (newValue === false) {
      baseInfo.isHistory = false;
      baseInfo.isCross = false;
    }
  }
);

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

const tableDataRecent = ref([
  { code: '002165', name: '红宝丽', weight: 3, sim: '极强' },
  { code: '002057', name: '中钢天源', weight: 2, sim: '强' },
  { code: '002455', name: '百川股份', weight: 2, sim: '强' },
  { code: '000830', name: '鲁西化工', weight: 1, sim: '中' },
  { code: '001207', name: '联科科技', weight: 0, sim: '弱' },
])

const tableDataRecent1 = ref([
  { code: '001255', name: '博菲电器', count: 21 },
  { code: '001333', name: '光华股份', count: 20 },
  { code: '000830', name: '鲁西化工', count: 10 },
  { code: '002913', name: '奥士康', count: 8 },
  { code: '002106', name: '莱宝高科', count: 6 },
  { code: '001207', name: '联科科技', count: 5 },
])

const stockShowInfo = ref();
stockShowInfo.value = store.state.stockShowInfo;

const modeInfo = store.state.modeInfo;
const searchInfo = store.state.searchInfo;

const selectedDatePreset = ref(null);

const getShowDialog = () => {
  showDialog.value = true;
};

const getResult = async() => {
  if(isChooseStock.value === true)
  {
    isGetResult.value = true;
  }
  if(isHistorySearch.value === true)
  {
    isGetResult2.value = true;
  }
  // 关键修改：只打印已保存的画框时间区间
  console.log('===== 开始查找 - 已保存的画框时间区间 =====');
  if (savedBrushTimeRanges.value.length > 0) {
    savedBrushTimeRanges.value.forEach((range, index) => {
      console.log(`保存的区间 ${index + 1}:`);
      console.log(`  股票代码: ${range.code}`);
      console.log(`  起始时间: ${range.startDate}`);
      console.log(`  终止时间: ${range.endDate}`);
      console.log(`  保存时间: ${new Date(range.saveTime).toLocaleString()}`);
    });
  } else {
    console.log('没有已保存的画框时间区间');
  }
  console.log('近N天:', recentNDaysValue.value);
  console.log('========================================');
};

const handleRowClick = async (row) => {
  const code = row.code;
  graphCode1.value = code;
  const foundStock = store.state.stockList.find((item) => item.code === code);
  if (foundStock) {
    stockShowInfo.value = { ...foundStock };
  } else {
  }
  selectedDatePreset.value = null;
};

const handleRowClick1 = async (row) => {
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

const activeName1 = ref("near");

// 确保初始值是 Date 对象或 null
const value1 = ref([
  store.state.modeInfo.startDate ? new Date(store.state.modeInfo.startDate) : null,
  store.state.modeInfo.endDate ? new Date(store.state.modeInfo.endDate) : null
]);

const value2 = ref([
  searchInfo.searchStartDate ? new Date(searchInfo.searchStartDate) : null,
  searchInfo.searchEndDate ? new Date(searchInfo.searchEndDate) : null
]);
const value3 = ref([]);

watch(value1, (newVal) => {
  console.log('[Main copy1.vue] WATCH(value1): Triggered with newVal:', newVal);
  if (newVal && newVal.length === 2 && newVal[0] instanceof Date && !isNaN(newVal[0].getTime()) && newVal[1] instanceof Date && !isNaN(newVal[1].getTime())) {
    const formattedStartDate = formatDateToLocal(newVal[0]);
    const formattedEndDate = formatDateToLocal(newVal[1]);
    
    store.state.modeInfo.startDate = formattedStartDate;
    store.state.modeInfo.endDate = formattedEndDate;
    value3.value = newVal; 
    value2.value = newVal; 
    console.log('[Main copy1.vue] WATCH(value1): Updated modeInfo.startDate/endDate and value2/value3:', { startDate: store.state.modeInfo.startDate, endDate: store.state.modeInfo.endDate });
  } else {
    console.warn('[Main copy1.vue] WATCH(value1): Invalid or incomplete date range received. Clearing dates. newVal:', newVal);
    store.state.modeInfo.startDate = null;
    store.state.modeInfo.endDate = null;
    value3.value = [];
    value2.value = [];
  }
});

watch(searchInfo, (newVal) => {
    console.log('[Main copy1.vue] WATCH(searchInfo): Triggered. New searchInfo:', newVal);
    value2.value = [
      newVal.searchStartDate ? new Date(newVal.searchStartDate) : null,
      newVal.searchEndDate ? new Date(newVal.searchEndDate) : null
    ];
    console.log('[Main copy1.vue] WATCH(searchInfo): Updated value2:', value2.value);
    if(baseInfo.isHistory === false)
    {
      tableDataRecent.value = newVal.stockList;
      console.log('[Main copy1.vue] WATCH(searchInfo): baseInfo.isHistory is false, tableDataRecent updated.');
    }
});

watch(() => store.state.baseInfo.isMode,(newValue) => {
    console.log('[Main copy1.vue] WATCH(store.state.baseInfo.isMode): Changed to', newValue);
    if (newValue === true && store.state.modeInfo.index === "BA2") {
      resultType.value = false;
      resultMode.value = true;
      resultStock.value = false;
      console.log('[Main copy1.vue] WATCH(store.state.baseInfo.isMode): Mode changed to BA2, updating result display flags.');
    }
    if(newValue === false){
      resultType.value = true;
      resultMode.value = false;
      resultStock.value = false;
      console.log('[Main copy1.vue] WATCH(store.state.baseInfo.isMode): Mode is false, updating result display flags.');
    }
  }
);

watch(() => baseInfo.isChoose,(newValue) => {
    console.log('[Main copy1.vue] WATCH(baseInfo.isChoose): Changed to', newValue);
    if (newValue === true) {
      resultType.value = false;
      resultMode.value = false;
      resultStock.value = true;
      console.log('[Main copy1.vue] WATCH(baseInfo.isChoose): isChoose is true, updating result display flags.');
    }
    else
    {
      resultType.value = true;
      resultMode.value = false;
      resultStock.value = false;
      console.log('[Main copy1.vue] WATCH(baseInfo.isChoose): isChoose is false, updating result display flags.');
    }
  }
);

const newStartDate = ref(new Date("2016-01-02"));
const newEndDate = ref(new Date("2016-06-20"));

function formatDateToLocal(date) {
  console.log('[formatDateToLocal]: Input date:', date, '(type:', typeof date, ')');
  if (!date) {
    console.warn('[formatDateToLocal] Input date is null or undefined. Returning null.');
    return null;
  }
  
  let processedDate = date;
  // 确保 processedDate 是 Date 对象且有效
  if (!(processedDate instanceof Date) || isNaN(processedDate.getTime())) {
    console.warn('[formatDateToLocal] Input is not a valid Date object or is an invalid Date. Attempting to parse:', date);
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        processedDate = parsedDate;
        console.log('[formatDateToLocal] Successfully parsed to Date:', processedDate);
      } else {
        console.error('[formatDateToLocal] Could not convert to valid Date object from string/invalid input:', date);
        return null;
      }
    } catch (e) {
      console.error('[formatDateToLocal] Error converting input to Date:', e, 'Returning null.');
      return null;
    }
  }

  const year = processedDate.getFullYear();
  const month = String(processedDate.getMonth() + 1).padStart(2, '0');
  const day = String(processedDate.getDate()).padStart(2, '0');
  const result = `${year}-${month}-${day}`;
  console.log('[formatDateToLocal] Formatted date result:', result);
  return result;
}

// Date selection triggers brush and zoom
function handleDateChange(val) {
  console.log('--- [Main copy1.vue] handleDateChange called with raw val:', val);
  if (!val || val.length !== 2) {
    console.warn('[Main copy1.vue] handleDateChange: Invalid date range selected (val is null or not an array of two elements). Clearing dates.');
    selectedDatePreset.value = null;
    modeInfo.startDate = null;
    modeInfo.endDate = null;
    newStartDate.value = null;
    newEndDate.value = null;
    console.log('[Main copy1.vue] handleDateChange: ModeInfo after clearing:', { startDate: modeInfo.startDate, endDate: modeInfo.endDate });
    return;
  }

  let [startDateRaw, endDateRaw] = val;
  const startDateFormatted = formatDateToLocal(startDateRaw);
  const endDateFormatted = formatDateToLocal(endDateRaw);
  selectedDatePreset.value = null;

  modeInfo.startDate = startDateFormatted;
  modeInfo.endDate = endDateFormatted;
  newStartDate.value = startDateFormatted; // 使用格式化后的字符串
  newEndDate.value = endDateFormatted;     // 使用格式化后的字符串
}

const setDateRange = (preset) => {
  console.log('--- [Main copy1.vue] setDateRange called with preset:', preset);
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (preset) {
    case 'daily':
      if(graphCode1.value.length > 6)
        graphCode1.value = graphCode1.value.slice(0, 6);
      startDate.setDate(today.getDate() - 200);
      break;
    case 'weekly':
      startDate.setMonth(today.getMonth() - 200);
      if(graphCode1.value.length > 6)
        graphCode1.value = graphCode1.value.slice(0, 6);
      graphCode1.value = graphCode1.value + "_week";
      break;
    case 'monthly':
      startDate.setFullYear(today.getFullYear() - 200);
      if(graphCode1.value.length > 6)
        graphCode1.value = graphCode1.value.slice(0, 6);
      graphCode1.value = graphCode1.value + "_month";
      break;
    default:
      console.warn('[Main copy1.vue] setDateRange: Unknown date preset:', preset);
      break;
  }
  value1.value = [startDate, endDate]; 
  selectedDatePreset.value = preset;
};

const toggleZoomLock = () => {
  isZoomLocked.value = !isZoomLocked.value;
  console.log("[Main copy1.vue] isZoomLocked toggled to:", isZoomLocked.value);
  if (!isZoomLocked.value) {
    if (graphRef.value) {
      graphRef.value.clearActiveBrush();
      console.log('[Main copy1.vue] Calling clearActiveBrush on graphRef.');
    }
    activeBrushData.value = null;
    console.log('[Main copy1.vue] activeBrushData cleared.');
  }
};

const handleBrushUpdated = (data) => {
  activeBrushData.value = data;
  console.log('Real-time brush data update (received in Main copy1.vue):', activeBrushData.value);
};



// 在现有ref定义区域添加
const savedBrushTimeRanges = ref([]); // 仅存储已保存的画框时间区间

const saveCurrentBrush = () => {
  console.log('[Main copy1.vue] saveCurrentBrush called.');
  // 确保使用最新的实时画框数据
  if (activeBrushData.value && graphRef.value) {
    console.log('[Main copy1.vue] 保存实时画框数据:', activeBrushData.value);
    
    // 获取图表DOM元素
    const chartDom = graphRef.value.$refs.chartRef111;
    if (!chartDom) {
      console.error('[Main copy1.vue] 未找到图表DOM元素');
      return;
    }

    // 从实时画框数据中获取最新位置信息
    const { pixelPosition, startDate, endDate, type } = activeBrushData.value;
    
    // 计算绝对位置（如果有像素位置信息）
    let absolutePosition = null;
    if (pixelPosition) {
      const chartRect = chartDom.getBoundingClientRect();
      absolutePosition = {
        x: chartRect.left + pixelPosition.x,
        y: chartRect.top + pixelPosition.y,
        width: pixelPosition.width,
        height: pixelPosition.height
      };
    }

    const timestamp = new Date().getTime();
    
    // 保存画框数据（使用实时更新的位置信息）
    savedBrushAreas.value.push({
      type: type || 'lineX',
      startDate: startDate,
      endDate: endDate,
      pixelPosition: pixelPosition,
      absolutePosition: absolutePosition,
      saveTime: timestamp, // 记录保存时间
      lastUpdatedTime: timestamp // 记录最后更新时间（与保存时间一致）
    });
    
    console.log('已保存的实时画框数据:', savedBrushAreas.value[savedBrushAreas.value.length - 1]);
    const cur = savedBrushAreas.value[savedBrushAreas.value.length - 1];
    savedBrushTimeRanges.value.push({
      code: graphCode1.value,
      startDate: cur.startDate,
      endDate: cur.endDate,
      saveTime: cur.saveTime
    });

    // 截图并保存（保留原有截图逻辑）
    html2canvas(chartDom, {
      useCORS: true,
      scale: 2,
      logging: false,
      timeout: 10000
    }).then(canvas => {
      if (!canvas) {
        console.error('[Main copy1.vue] 生成canvas失败');
        return;
      }
      
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('[Main copy1.vue] 转换为Blob失败');
          return;
        }
        
        const fileName = `${graphCode1.value}_brush_${timestamp}.png`;
        const formData = new FormData();
        formData.append('file', blob, fileName);
        
        axios.post(`http://127.0.0.1:5000/save_screenshot?timestamp=${timestamp}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 15000,
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`[Main copy1.vue] 上传进度: ${percentCompleted}%`);
          }
        }).then(response => {
          if (response.data && response.data.success) {
            console.log(`[Main copy1.vue] 截图已保存到服务器: public/savepng/${fileName}`);
          } else {
            console.error('[Main copy1.vue] 截图保存失败:', response.data?.msg || '未知错误');
          }
        }).catch(err => {
          console.error('[Main copy1.vue] 发送截图到服务器失败:', 
            err.response?.data?.msg || err.message || err);
        });
      }, 'image/png');
    }).catch(err => {
      console.error('[Main copy1.vue] 截图失败:', err.message || err);
    });

    // 清除当前激活的画框
    graphRef.value.clearActiveBrush();
    activeBrushData.value = null;
  } else {
    console.warn('[Main copy1.vue] 没有可保存的画框数据');
  }
};

const sidebarWidth = ref(290);

const getColumnWidth = (percentage) => {
  return (sidebarWidth.value - 30) * percentage;
};

watch(sidebarWidth, () => {
  console.log('[Main copy1.vue] Watch: sidebarWidth changed.');
  nextTick(() => {
    const currentPage = document.getElementById("current-page");
    if (currentPage) {
      const tables = currentPage.querySelectorAll(".el-table__header-wrapper");
      tables.forEach((table) => {
        const event = new Event("resize");
        window.dispatchEvent(event);
      });
      console.log('[Main copy1.vue] Dispatched resize events for tables.');
    }
  });
});

function handleDateChange2(val) {
  console.log('--- [Main copy1.vue] handleDateChange2 called with raw val:', val);
  if (!val || val.length !== 2) {
    console.warn('[Main copy1.vue] handleDateChange2: Invalid date range for search pool selected. Clearing dates.');
    searchInfo.searchStartDate = null;
    searchInfo.searchEndDate = null;
    newStartDate.value = null;
    newEndDate.value = null;
    console.log('[Main copy1.vue] handleDateChange2: SearchInfo after clearing:', { startDate: searchInfo.searchStartDate, endDate: searchInfo.searchEndDate });
    return;
  }
  let [startDateRaw, endDateRaw] = val;

  console.log(`[Main copy1.vue] handleDateChange2 - startDateRaw:`, startDateRaw, `(type: ${typeof startDateRaw}, instanceof Date: ${startDateRaw instanceof Date}, isNaN(getTime()): ${startDateRaw instanceof Date ? isNaN(startDateRaw.getTime()) : 'N/A'})`);
  console.log(`[Main copy1.vue] handleDateChange2 - endDateRaw:`, endDateRaw, `(type: ${typeof endDateRaw}, instanceof Date: ${endDateRaw instanceof Date}, isNaN(getTime()): ${endDateRaw instanceof Date ? isNaN(endDateRaw.getTime()) : 'N/A'})`);

  const startDateFormatted = formatDateToLocal(startDateRaw);
  const endDateFormatted = formatDateToLocal(endDateRaw);

  console.log(`[Main copy1.vue] handleDateChange2 - After formatDateToLocal - startDateFormatted:`, startDateFormatted);
  console.log(`[Main copy1.vue] handleDateChange2 - After formatDateToLocal - endDateFormatted:`, endDateFormatted);

  searchInfo.searchStartDate = startDateFormatted;
  searchInfo.searchEndDate = endDateFormatted;
  newStartDate.value = startDateFormatted; // 使用格式化后的字符串
  newEndDate.value = endDateFormatted;     // 使用格式化后的字符串

  console.log('[Main copy1.vue] handleDateChange2: FINAL SearchInfo dates updated:', { startDate: searchInfo.searchStartDate, endDate: searchInfo.searchEndDate });
  console.log('--- [Main copy1.vue] handleDateChange2 END ---');
}

const upColor = '#ec0000';
const downColor = '#00da3c';
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

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
}

.screenshot-img {
  max-width: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.screenshot-img:hover {
  transform: scale(1.02);
}

.image-name {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #666;
}

.empty-state {
  width: 100%;
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading-state {
  width: 100%;
  text-align: center;
  padding: 40px;
  color: #666;
}

</style>