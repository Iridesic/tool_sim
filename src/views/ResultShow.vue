<!--
  页面说明：
  本页面用于展示【基准股票模式评价】的结果，包括结果表格和每条结果的均线图，支持保存配置和下载结果等操作。
-->
<template>
  <div id="app">

    <!--结果详情展示-->
    <div style="text-align: left; margin-top: 40px; background-color:#faf8e1; height: 40px; margin-top: 5px; display: inline-flex; width: 99%;border-radius: 10px; margin-left: -5px;">
      <span style="font-weight: bold; margin-top: 10px; margin-left: 20px; font-size: 14px;">模式相似性查找结果详情</span>
      <el-button
        plain
        @click="saveSelfMode"
        style="margin-top: 8px; margin-left: 20px; font-size: 12px; height: 25px;"
      >
        保存配置到自定义模式
      </el-button> 
    </div>

    <div v-if="isChooseStock" style="display: flex; height: 290px;">
      <el-table :data="tableData2" border style="width: 99%; margin-left: 5px; margin-top: 5px; " stripe class="result-table" 
        :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
          <el-table-column fixed label="股票名称" prop="stockName" width="100px"></el-table-column>
          <el-table-column fixed label="股票代码" prop="stockCode" width="90px"></el-table-column>
          <el-table-column label="股票来源" prop="stockFrom" width="100px"></el-table-column>
          <el-table-column label="起始时间" prop="startDate"  width="100px"></el-table-column>
          <el-table-column label="终止时间" prop="endDate"  width="100px"></el-table-column>
          <el-table-column label="基准区域（选区集中相似程度最高）" width="330px">
            <!--显示从后台获取的图片-->
            <template #default="{ row }">
              <img :src="row.imagePath" alt="基准图片" style="width: 300px; height: 240px; margin-top: 10px; margin-bottom: -50px;">
              <!-- <img 
                :src="img.url" 
                :alt="img.filename" 
                :title="img.filename"
                class="screenshot-img"
                style="width: 260px; height: 260px; object-fit: cover; border-radius: 3px; margin-top: 28px;"
                @error="handleImageError(img)"
              > -->
            </template>
          </el-table-column>

          <el-table-column label="相似性选股结果（近N日）" width="300px">
            <template #default="{ $index }">
              <div :ref="(el) => setChartRef(el, $index, 0)" style="width: 280px; height: 270px; margin-top: -30px; margin-bottom: -30px; margin-left: 0px;"></div>
            </template>
          </el-table-column>
           <el-table-column label="相似程度">
            <template #default="scope">
              <el-button 
                :type="getButtonType(scope.row.similarity)"
                size="small"
              >
                {{ getButtonText(scope.row.similarity) }}
              </el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, toRaw, computed  } from 'vue';
import { useStore } from "vuex";
import axios from "axios";
import * as echarts from 'echarts';

const store = useStore();
const isHistorySearch = computed(() => {
  return store.state.baseInfo.isHistorySearch === true;
});
const isChooseStock = computed(() => {
  return store.state.baseInfo.isChooseStock === true;
});
const graphCode = ref('000021');

watch(() => store.state.resultStockInfo.code,(newValue) => {
  console.log("----------------------------------");
  console.log(store.state.resultStockInfo.startDate);
  console.log(store.state.resultStockInfo.endDate);
  console.log("----------------------------------");
  graphCode.value = newValue;
  }
);
// -------------------------
function getDateRange(dateStr) {
    const date = new Date(`${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`);
    const range = [];
    for (let i = -2; i <= 2; i++) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        range.push(`${year}${month}${day}`);
    }
    return range;
}

// 确定按钮类型（颜色）
const getButtonType = (similarity) => {
  if (similarity > 0.7) {
    return 'danger'; // 红色
  } else if (similarity > 0.6) {
    return 'warning'; // 橙色
  } else if (similarity > 0.5) {
    return 'info'; // 黄色（Element UI的info类型接近黄色）
  } else if(similarity > 0.3){
    return 'success';
  }
  return 'default'; // 默认颜色（可选）
};

// 确定按钮文本
const getButtonText = (similarity) => {
  if (similarity > 0.7) {
    return '极强';
  } else if (similarity > 0.6) {
    return '强';
  } else if (similarity > 0.5) {
    return '中';
  } else if (similarity > 0.3) {
    return '弱';
  }
  return ''; // 数值不满足条件时显示空（或其他文字）
};


// -------------------------------------------------------------------
const dataObjects = ref([
  {
    stockIndex: 1,
    stockName: '博菲电器',
    stockCode: '001255',
    stockFrom: '基准股票',
    startDate: '2024-09-20',
    endDate: '2024-11-20',
    chartData: [
      [6.507500, 6.707500, 6.910000, 7.110000, 7.155000, 7.217500, 7.442500, 7.732500, 7.807500, 7.842500, 7.652500, 7.460000, 7.472500, 7.492500, 7.605000, 7.650000, 7.777500, 7.852500, 7.960000, 8.027500, 8.217500, 8.667500, 9.102500, 9.662500, 10.185000, 10.215000, 10.147500, 10.040000, 9.835000, 9.857500, 9.972500, 10.072500, 10.002500, 10.030000, 9.932500, 9.692500, 9.497500, 9.267500, 9.207500],
      [6.426250, 6.552500, 6.635000, 6.740000, 6.831250, 6.962500, 7.176250, 7.421250, 7.481250, 7.530000, 7.547500, 7.596250, 7.640000, 7.667500, 7.628750, 7.555000, 7.625000, 7.672500, 7.782500, 7.838750, 7.997500, 8.260000, 8.531250, 8.845000, 9.201250, 9.441250, 9.625000, 9.851250, 10.010000, 10.036250, 10.060000, 10.056250, 9.918750, 9.943750, 9.952500, 9.882500, 9.750000, 9.648750, 9.570000],
      [6.347500, 6.425833, 6.500000, 6.575833, 6.669167, 6.774167, 6.904167, 7.070833, 7.156667, 7.255833, 7.335000, 7.434167, 7.478333, 7.517500, 7.566667, 7.614167, 7.685833, 7.729167, 7.739167, 7.712500, 7.822500, 8.004167, 8.222500, 8.446667, 8.726667, 8.911667, 9.070000, 9.243333, 9.412500, 9.580000, 9.740833, 9.925000, 10.007500, 10.034167, 10.017500, 9.935000, 9.778333, 9.718333, 9.704167],
      [6.301250, 6.367500, 6.421875, 6.480000, 6.549375, 6.623750, 6.735625, 6.865000, 6.953750, 7.041250, 7.091250, 7.168125, 7.235625, 7.315000, 7.402500, 7.488125, 7.553125, 7.601250, 7.665000, 7.717500, 7.818750, 7.963750, 8.080000, 8.200000, 8.413125, 8.556875, 8.703750, 8.845000, 9.003750, 9.148125, 9.295625, 9.450625, 9.560000, 9.692500, 9.788750, 9.866875, 9.880000, 9.842500, 9.815000],
      [6.387500, 6.409500, 6.410000, 6.429000, 6.472000, 6.537500, 6.626000, 6.730500, 6.801000, 6.867500, 6.919000, 6.984000, 7.057500, 7.131500, 7.194000, 7.264500, 7.344000, 7.422500, 7.514000, 7.596000, 7.686000, 7.814500, 7.952500, 8.106500, 8.292000, 8.414000, 8.493500, 8.568000, 8.697500, 8.817000, 8.957500, 9.090500, 9.203500, 9.324500, 9.423000, 9.499000, 9.547500, 9.607500, 9.672500], 
      [6.310851, 6.337872, 6.362128, 6.391702, 6.421489, 6.452979, 6.493404, 6.545319, 6.581489, 6.615532, 6.635957, 6.663191, 6.687447, 6.707872, 6.726809, 6.750426, 6.785745, 6.813830, 6.841489, 6.874468, 6.925745, 6.997660, 7.070851, 7.154894, 7.252553, 7.328511, 7.398511, 7.477447, 7.549787, 7.611277, 7.678936, 7.761702, 7.841277, 7.923404, 7.994468, 8.062128, 8.122553, 8.185532, 8.251064],
    ],
    chartData2: [],
    // 2024-09-20 到 2024-11-20 的每个股票交易日
    dates: [ '20240920', '20240921', '20240922', '20240923', '20240924', '20240925', '20240926', '20240927', '20240928', '20240929',
      '20240930', '20241001', '20241002', '20241003', '20241004', '20241005', '20241006', '20241007', '20241008', '20241009',
      '20241030', '20241031', '20241101', '20241102', '20241101', '20241102',
      '20241109', '20241110', '20241111', '20241112', '20241113', '20241114', '20241115', '20241116', '20241117', '20241118',
      '20241119', '20241120'
    ],
    dates2: getDateRange('20241120'),
    chartData3: [],
    similarity: 0.9232
  },
  {
    stockIndex: 2,
    stockName: '博菲电器',
    stockCode: '001255',
    stockFrom: '基准股票',
    startDate: '2023-02-02',
    endDate: '2023-03-20',
    chartData: [
      [10.602500, 10.647500, 10.687500, 10.675000, 10.672500, 10.707500, 10.727500, 10.815000, 10.887500, 10.992500, 11.025000, 10.950000, 10.937500, 10.867500, 10.892500, 10.927500, 10.985000, 10.980000, 10.985000, 11.067500, 11.172500, 11.342500, 11.552500, 11.577500, 11.705000, 11.752500, 11.662500, 11.752500, 11.667500, 11.575000, 11.437500, 11.327500, 11.185000], 
  [10.343750, 10.435000, 10.513750, 10.585000, 10.637500, 10.677500, 10.707500, 10.745000, 10.780000, 10.850000, 10.876250, 10.882500, 10.912500, 10.930000, 10.958750, 10.938750, 10.961250, 10.923750, 10.938750, 10.997500, 11.078750, 11.161250, 11.268750, 11.322500, 11.438750, 11.547500, 11.607500, 11.665000, 11.686250, 11.663750, 11.550000, 11.540000, 11.426250],
  [10.114167, 10.207500, 10.305833, 10.393333, 10.453333, 10.525833, 10.585000, 10.661667, 10.720833, 10.782500, 10.813333, 10.813333, 10.832500, 10.855833, 10.881667, 10.897500, 10.936667, 10.946667, 10.967500, 10.981667, 11.031667, 11.063333, 11.143333, 11.190833, 11.287500, 11.358333, 11.400000, 11.465833, 11.515000, 11.556667, 11.550833, 11.552500, 11.519167], 
  [10.016875, 10.075000, 10.136250, 10.194375, 10.253750, 10.332500, 10.411250, 10.498750, 10.561875, 10.642500, 10.695000, 10.733750, 10.775000, 10.803750, 10.833125, 10.841875, 10.870625, 10.886875, 10.907500, 10.940000, 10.995625, 11.045625, 11.113750, 11.130625, 11.200000, 11.235625, 11.273125, 11.331250, 11.382500, 11.412500, 11.409375, 11.431250, 11.432500],  
  [9.919500, 9.986500, 10.054500, 10.104500, 10.148000, 10.201500, 10.254500, 10.318500, 10.380500, 10.464500, 10.534000, 10.589000, 10.637000, 10.687500, 10.734500, 10.772500, 10.817000, 10.839000, 10.863500, 10.887000, 10.931000, 10.978000, 11.036500, 11.067500, 11.137500, 11.187000, 11.223500, 11.255000, 11.293500, 11.303500, 11.306000, 11.330500, 11.343000], 
  [10.035106, 10.035532, 10.041064, 10.047872, 10.054894, 10.068298, 10.079362, 10.095319, 10.105319, 10.123830, 10.131064, 10.134255, 10.140638, 10.152979, 10.168936, 10.180426, 10.199574, 10.217872, 10.238298, 10.265745, 10.303404, 10.343191, 10.391277, 10.429149, 10.482340, 10.527872, 10.567872, 10.614043, 10.663404, 10.706596, 10.734468, 10.767021, 10.795532],  

    ],
    chartData2: [],
    dates: [ '20230202', '20230203', '20230204', '20230205', '20230206', '20230207', '20230208', '20230209', '20230210', '20230211',
      '20230212', '20230213', '20230214', '20230215', '20230216', '20230217', '20230218', '20230219', '20230220', '20230221',
      '20230302', '20230303', '20230304', '20230305', '20230306', '20230307',
      '20230314', '20230315', '20230316', '20230317', '20230318', '20230319',
      '20230320'
    ],
    dates2: getDateRange('20250102'),
    chartData3: [],
    similarity: 0.8997
  },
  {
    stockIndex: 3,
    stockName: '博菲电器',
    stockCode: '001255',
    stockFrom: '基准股票',
    startDate: '2024-09-24',
    endDate: '2024-11-19',
    chartData: [
      [13.040000, 13.265000, 13.592500, 14.035000, 14.562500, 15.297500, 15.770000, 16.152500, 16.170000, 16.010000, 16.095000, 16.052500, 16.127500, 16.170000, 16.342500, 16.647500, 17.150000, 17.675000, 18.290000, 18.987500, 19.280000, 19.350000, 19.475000, 19.332500, 19.895000, 20.690000, 20.950000, 21.870000, 22.002500, 22.130000, 22.182500, 21.685000, 21.285000, 20.512500, 20.052500, 19.760000], 
  [12.965000, 13.055000, 13.192500, 13.426250, 13.801250, 14.281250, 14.681250, 15.093750, 15.366250, 15.653750, 15.932500, 16.102500, 16.148750, 16.090000, 16.218750, 16.350000, 16.638750, 16.922500, 17.316250, 17.817500, 18.215000, 18.512500, 18.882500, 19.160000, 19.587500, 20.020000, 20.212500, 20.601250, 20.948750, 21.410000, 21.566250, 21.777500, 21.643750, 21.321250, 21.117500, 20.722500],  
  [13.050000, 13.075833, 13.156667, 13.292500, 13.497500, 13.802500, 14.051667, 14.335000, 14.590833, 14.857500, 15.152500, 15.413333, 15.620000, 15.825833, 16.069167, 16.284167, 16.482500, 16.618333, 16.909167, 17.229167, 17.519167, 17.731667, 18.035833, 18.322500, 18.775000, 19.238333, 19.571667, 20.063333, 20.392500, 20.723333, 20.869167, 20.962500, 21.060833, 21.110833, 21.061667, 21.105000],  
  [13.140625, 13.163125, 13.221875, 13.295625, 13.428125, 13.631250, 13.810000, 14.007500, 14.165625, 14.354375, 14.562500, 14.764375, 14.975000, 15.185625, 15.450000, 15.721875, 16.002500, 16.288125, 16.624375, 16.960000, 17.181875, 17.301250, 17.550625, 17.755000, 18.113125, 18.471250, 18.764375, 19.209375, 19.581875, 19.961250, 20.224375, 20.468750, 20.615625, 20.670625, 20.665000, 20.661875], 
  [13.165500, 13.195500, 13.229000, 13.311000, 13.425000, 13.590000, 13.731500, 13.867000, 13.976500, 14.107000, 14.267000, 14.416500, 14.558000, 14.717500, 14.918500, 15.141000, 15.410000, 15.683500, 16.018000, 16.375000, 16.658000, 16.900500, 17.194500, 17.434500, 17.724500, 17.979000, 18.230500, 18.578000, 18.891000, 19.203000, 19.448000, 19.704500, 19.922500, 20.071500, 20.190000, 20.327000], 
  [13.386809, 13.380851, 13.384043, 13.393191, 13.428298, 13.497234, 13.552340, 13.609149, 13.648936, 13.704681, 13.762553, 13.802128, 13.842766, 13.897234, 13.975532, 14.054043, 14.147234, 14.251702, 14.380851, 14.522340, 14.642979, 14.756596, 14.898723, 15.030638, 15.205532, 15.396596, 15.571277, 15.789787, 15.974468, 16.164894, 16.340000, 16.506383, 16.651915, 16.782340, 16.908511, 17.046596],  
    ],
    chartData2: [],
    dates: [
      '20240924', '20240925', '20240926', '20240927', '20240928', '20240929',
      '20240930', '20241001', '20241002', '20241003', '20241004', '20241005',
      '20241006', '20241007', '20241008', '20241009', '20241010', '20241011',
      '20241101', '20241102', '20241103', '20241104', '20241105', '20241106',
      '20241101', '20241102', '20241103', '20241104', '20241105', '20241106',
      '20241113', '20241114', '20241115', '20241116', '20241117', '20241118',
      '20241119'
    ],
    dates2: getDateRange('20250102'),
    chartData3: [],
    similarity: 0.8740
  },
  {
    stockIndex: 4,
    stockName: '博菲电器',
    stockCode: '001255',
    stockFrom: '基准股票',
    startDate: '2022-06-23',
    endDate: '2022-08-08',
    chartData: [
      [9.687500, 9.625000, 9.750000, 10.050000, 10.272500, 10.707500, 10.967500, 11.132500, 11.335000, 11.182500, 11.085000, 10.932500, 10.680000, 10.512500, 10.630000, 10.902500, 11.342500, 11.900000, 12.282500, 12.750000, 13.247500, 13.515000, 13.632500, 13.600000, 13.700000, 13.835000, 14.010000, 14.110000, 13.722500, 13.320000, 12.950000, 12.590000, 12.500000], 
  [9.676250, 9.681250, 9.786250, 9.915000, 9.980000, 10.166250, 10.358750, 10.591250, 10.803750, 10.945000, 11.026250, 11.032500, 11.007500, 10.847500, 10.857500, 10.917500, 11.011250, 11.206250, 11.456250, 11.826250, 12.295000, 12.707500, 12.957500, 13.175000, 13.473750, 13.675000, 13.821250, 13.855000, 13.711250, 13.577500, 13.480000, 13.350000, 13.111250], 
  [9.633333, 9.666667, 9.725000, 9.807500, 9.875000, 10.023333, 10.180000, 10.320833, 10.431667, 10.505000, 10.600833, 10.705000, 10.762500, 10.800833, 10.894167, 10.989167, 11.119167, 11.198333, 11.332500, 11.528333, 11.756667, 11.975833, 12.181667, 12.417500, 12.763333, 13.083333, 13.308333, 13.486667, 13.556667, 13.556667, 13.530833, 13.433333, 13.307500], 
  [9.523750, 9.593125, 9.680000, 9.738125, 9.793125, 9.926875, 10.035625, 10.138750, 10.240000, 10.313125, 10.406250, 10.473750, 10.493750, 10.506875, 10.608125, 10.754375, 10.907500, 11.075625, 11.241250, 11.429375, 11.651250, 11.777500, 11.907500, 12.046250, 12.242500, 12.440625, 12.638750, 12.840625, 13.003125, 13.142500, 13.218750, 13.262500, 13.292500], 
  [9.320500, 9.389500, 9.480500, 9.579000, 9.673500, 9.816000, 9.937500, 10.017000, 10.101500, 10.178000, 10.245500, 10.297500, 10.328000, 10.353000, 10.451000, 10.559500, 10.663500, 10.785500, 10.943000, 11.153500, 11.375500, 11.563500, 11.719500, 11.863500, 12.061000, 12.189000, 12.328000, 12.459000, 12.538500, 12.616500, 12.701000, 12.790500, 12.902500],  
  [8.573404, 8.598723, 8.630426, 8.673191, 8.709149, 8.767660, 8.831915, 8.897447, 8.981489, 9.063830, 9.133404, 9.202979, 9.259787, 9.312979, 9.392766, 9.478723, 9.569574, 9.669574, 9.776383, 9.900000, 10.035319, 10.159149, 10.271915, 10.382553, 10.510000, 10.628298, 10.749362, 10.866170, 10.961277, 11.049362, 11.132128, 11.213617, 11.295319], 
    ],
    chartData2: [],
    dates: [
      '20220623', '20220624', '20220625', '20220626', '20220627', '20220628',
      '20220629', '20220630', '20220701', '20220702', '20220703', '20220704',
      '20220705', '20220706', '20220707', '20220708', '20220709', '20220710',
      '20220705', '20220706', '20220707', '20220708', '20220709', '20220710',
      '20220801', '20220802', '20220803', '20220804', '20220805', '20220806',
      '20220807', '20220808'
    ],
    dates2: getDateRange('20250102'),
    chartData3: [],
    similarity: 0.7521
  }
]);
const dataObjects2 = ref([
  {
    searchType: '历史查找',
    searchCount: 0,
    futureTime: '5',
    showCustomInput: false,
    customDays: '',
    futureIncome: 0,
    maxRange: 0,
    maxRate: 0,
    stockIncrease: 0,
    stockDecrease: 0,
    score: 0,
    riseFallRatio: [65, 35] // 上涨65%，下跌35%
  }
]);
const dataObjects3 = ref([]);

const curImg = ref();
const imageList = ref([]);
const loading = ref(true);
const fetchImages = async () => {
  const timestamp = new Date().getTime();
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const folderName = store.state.newSearchInfo.baseFolder;
  try {
    loading.value = true;
    const params = new URLSearchParams();
    params.append('timestamp', timestamp);
    params.append('folder', folderName);
    // const response = await axios.get(`${API_BASE_URL}/get_all_screenshots?timestamp=${timestamp}`);
    const response = await axios.get(`${API_BASE_URL}/get_all_screenshots`,{params});
    if (response.data.success) {
      // 处理图片列表，修正URL并编码特殊字符
      imageList.value = response.data.images.map(image => ({
        ...image,
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
  curImg.value = imageList.value.length > 0 ? imageList.value[0].url : '';
}; 


// 监听vuex中的sim_stock_list,更新dataObjects3的数据
watch(() => store.state.sim_stock_list, async(newList) => {
  console.log("-------watch sim_stock_list-------");
  await fetchImages();

  if (newList && newList.length > 0) {
    dataObjects3.value = newList.map(item => ({
      stockCode: item.stock_code,
      stockName: item.stock_name,
      stockFrom: '系统匹配',
      startDate: '2025-03-01',
      endDate: '2025-03-25',
      chartData: item.recent_data || [], // 确保有默认空数组
      similarity: item.similarity,
      dates: item.dates || [], // 确保dates属性存在
      dates2: [],
      chartData3: [],
      imagePath: curImg.value
    }));

    // 数据更新后初始化图表
    nextTick(() => {
      dataObjects3.value.forEach((item, rowIndex) => {
        // 检查图表容器是否存在且数据有效
        if (item.chartData && item.chartData.length > 0 && item.dates.length > 0) {
          // 初始化第0列的图表
          const index = rowIndex * 3 + 0;
          if (chartRefs.value[index]) {
            initChart3(index, rowIndex, 0);
          }
        }
      });
    });
  }
}, { deep: true }); // 深度监听确保数组内部变化也能被捕获

function transposeArray(array) {
    // 检查输入是否为有效的二维数组
    if (!Array.isArray(array) || array.length === 0 || !Array.isArray(array[0])) {
        throw new Error('输入必须是一个非空的二维数组');
    }
    // 获取原数组的行数和列数
    const rows = array.length;
    const cols = array[0].length;
    // 创建一个新的二维数组，行数为原数组的列数，列数为原数组的行数
    const transposed = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    // 填充转置后的数组
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transposed[j][i] = array[i][j];
        }
    }
    return transposed;
}

// 创建计算属性而不是直接引用
const tableData = computed(() => dataObjects.value);
const tableData2 = computed(() => dataObjects3.value);
const resultData = computed(() => dataObjects2.value);

// 传入的是股票基准模式的数据
watch(() => store.state.resultList2, (newValue) => {
    console.log("接收结果数据-------------------", toRaw(newValue));
    const rawData = toRaw(newValue);
    const newDataObjects = [];
    let totalSearchCount = 0;

    for (const stockCode in rawData) {
      if (rawData.hasOwnProperty(stockCode)) {
        console.log("股票代码:", stockCode);
        // 获取该股票的所有相似区间数据
        const intervals = rawData[stockCode];
        totalSearchCount += intervals.length;

        // 遍历每个相似区间
        intervals.forEach((interval) => {
          const stock = store.state.stockList.find(stock => stock.code === stockCode.slice(0, 6));
          const ma_values1 = transposeArray(interval.ma_values);
          const index_values = transposeArray(interval.index_ma_values);
          const dates = interval.x_axis_dates;
          const digits = dates.map(date => date.slice(-4));
          const future_value = transposeArray(interval.post_ma_values.slice(0, 10));

          const newData = {
            stockName: stock ? stock.name : '未知股票',
            stockCode: stockCode.slice(0, 6),
            stockFrom: '基准股票',
            startDate: interval.start_date,
            endDate: interval.end_date,
            chartData: ma_values1,
            chartData2: index_values,
            dates: digits,
            dates2: interval.post_dates.slice(0, 10),
            chartData3: future_value,
            similarity: interval.similarity.toFixed(6)
          };
          newDataObjects.push(newData);
        });
      }
    }

    const newResultData = [{
      searchType: '基准股票模式查找',
      searchCount: totalSearchCount,
      futureTime: '5',
      showCustomInput: false,
      customDays: '',
      futureIncome: store.state.resultInfo.futureIncome * 100,
      maxRange: 0,
      maxRate: 0,
      stockIncrease: 0,
      stockDecrease: 0,
      score: 0,
      riseFallRatio: [65, 35]
    }];

    // 直接更新数据对象
    dataObjects.value = newDataObjects;
    dataObjects2.value = newResultData;
    console.log('表格数据已更新');
  },
  { deep: true } // 若 resultList 是对象或数组，需要深度监听
);

// 传入的是推荐模式【金叉】的结果数据
watch(() => store.state.resultList, (newValue) => {
    console.log("接收结果数据-------------------", toRaw(newValue));
    const rawData = toRaw(newValue);
    const newDataObjects = [];
    let totalSearchCount = 0;

    for (const stockCode in rawData) {
      if (rawData.hasOwnProperty(stockCode)) {
        console.log("股票代码:", stockCode);
        // 获取该股票的所有相似区间数据
        const intervals = rawData[stockCode];
        totalSearchCount += intervals.length;

        // 遍历每个相似区间
        intervals.forEach((interval) => {
          const stock = store.state.stockList.find(stock => stock.code === stockCode.slice(0, 6));
          const ma_values1 = transposeArray(interval.ma_data.map(subArray => subArray.slice(1)));
          const index_values = transposeArray(interval.index_ma_values);
          const dates = interval.ma_data.map(item => item[0]);
          const digits = dates.map(date => date.slice(-4));
          const future_value = transposeArray(interval.post_stock_ma_data.slice(0, 10).map(subArray => subArray.slice(1)));

          const newData = {
            stockName: stock ? stock.name : '未知股票',
            stockCode: stockCode.slice(0, 6),
            stockFrom: '基准股票',
            startDate: interval.interval[0],
            endDate: interval.interval[1],
            chartData: ma_values1,
            chartData2: index_values,
            dates: digits,
            dates2: interval.post_stock_dates.slice(0, 10),
            chartData3: future_value,
            similarity: 1
          };
          newDataObjects.push(newData);
        });
      }
    }

    const newResultData = [{
      searchType: '基准股票模式查找',
      searchCount: totalSearchCount,
      futureTime: '5',
      showCustomInput: false,
      customDays: '',
      futureIncome: store.state.resultInfo.futureIncome * 100,
      maxRange: 0,
      maxRate: 0,
      stockIncrease: 0,
      stockDecrease: 0,
      score: 0,
      riseFallRatio: [65, 35]
    }];

    // 直接更新数据对象
    dataObjects.value = newDataObjects;
    dataObjects2.value = newResultData;
    console.log('表格数据已更新');
  },
  { deep: true } // 若 resultList 是对象或数组，需要深度监听
);

// 页面加载时检查是否已有数据
onMounted(() => {
  if (store.state.resultList && Object.keys(store.state.resultList).length > 0) {
    const rawData = toRaw(store.state.resultList);
    const newDataObjects = [];
    let totalSearchCount = 0;

    for (const stockCode in rawData) {
      if (rawData.hasOwnProperty(stockCode)) {
        const intervals = rawData[stockCode];
        totalSearchCount += intervals.length;

        intervals.forEach((interval) => {
          const stock = store.state.stockList.find(stock => stock.code === stockCode.slice(0, 6));
          const ma_values1 = transposeArray(interval.ma_data);
          const index_values = transposeArray(interval.index_ma_values);
          const dates = interval.ma_data.map(item => item[0]);
          const digits = dates.map(date => date.slice(-4));
          const future_value = transposeArray(interval.post_stock_ma_data.slice(0, 10));

          const newData = {
            stockName: stock ? stock.name : '未知股票',
            stockCode: stockCode.slice(0, 6),
            stockFrom: '基准股票',
            startDate: interval.interval[0],
            endDate: interval.interval[1],
            chartData: ma_values1,
            chartData2: index_values,
            dates: digits,
            dates2: interval.post_stock_dates.slice(0, 10),
            chartData3: future_value,
            similarity: 1
          };
          newDataObjects.push(newData);
        });
      }
    }

    const newResultData = [{
      searchType: '基准股票模式查找',
      searchCount: totalSearchCount,
      futureTime: '5',
      showCustomInput: false,
      customDays: '',
      futureIncome: store.state.resultInfo.futureIncome * 100,
      maxRange: 0,
      maxRate: 0,
      stockIncrease: 0,
      stockDecrease: 0,
      score: 0,
      riseFallRatio: [65, 35]
    }];

    // 直接更新数据对象
    dataObjects.value = newDataObjects;
    dataObjects2.value = newResultData;
    console.log('表格数据已更新');
    
    // 强制更新表格
    nextTick(() => {
      console.log('表格数据长度:', tableData.value.length);
    });
  }
});

const chartRefs = ref(Array(dataObjects.value.length * 3).fill(null));

const setChartRef = (el, rowIndex, colIndex) => {
  const index = rowIndex * 3 + colIndex;
  chartRefs.value[index] = el;
  if(isHistorySearch.value === true)
  {
    initChart(index, rowIndex, colIndex);
  }
  if(isChooseStock.value === true)
  {
    initChart3(index, rowIndex, colIndex);
  }
};

const initChart = (index, rowIndex, colIndex, retryCount = 0) => {
  if (chartRefs.value[index]) {
    try {
      const myChart = echarts.init(chartRefs.value[index]);
      let chartData;
      if (colIndex === 0) {
        chartData = dataObjects.value[rowIndex].chartData;
      } else if (colIndex === 1) {
        chartData = dataObjects.value[rowIndex].chartData2;
      }
      // 计算所有数据中的最小值和最大值
      const allValues = [].concat(...chartData);
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      // 添加一些边距，使图表更美观
      const padding = (maxValue - minValue) * 0.1;
      
      const option = {
        xAxis: {
          type: 'category',
          data: dataObjects.value[rowIndex].dates,
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false }, // 隐藏 y 轴刻度
          axisLabel: { show: false }, // 隐藏 y 轴坐标值
          min: minValue - padding,    // 设置纵轴最小值
          max: maxValue + padding     // 设置纵轴最大值
        },
        series: [
          {
            name: 'MA4',
            data: chartData[0],
            type: 'line',
            lineStyle: { width: 1, color:'#cd1f0e' },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA8',
            data: chartData[1],
            type: 'line',
            lineStyle: { width: 1 , color:'#edbf09'},// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA12',
            data: chartData[2],
            type: 'line',
            lineStyle: { width: 1 ,color:'#62c613'},// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA16',
            data: chartData[3],
            type: 'line',
            lineStyle: { width: 1, color:'#1286ff' },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA20',
            data: chartData[4],
            type: 'line',
            lineStyle: { width: 1 ,color:'#9f12ff'},// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA47',
            data: chartData[5],
            type: 'line',
            lineStyle: { width: 1,color:'#000000' },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
        ]
      };
      myChart.setOption(option);
    } catch (error) {
      console.error('ECharts 初始化出错:', error);
    }
  } else if (retryCount < 5) {
    setTimeout(() => {
      initChart(index, rowIndex, colIndex, retryCount + 1);
    }, 500);
  } else {
    console.log(`chartRef 未获取到元素: ${index}，重试次数达到上限`);
  }
};

const initChart3 = (index, rowIndex, colIndex, retryCount = 0) => {
  if (chartRefs.value[index]) {
    try {
      const myChart = echarts.init(chartRefs.value[index]);
      let chartData;
      let dates = [];
      
      // 增加数据校验
      if (!dataObjects3.value[rowIndex]) {
        console.error(`dataObjects3[${rowIndex}] 不存在`);
        return;
      }
      if (colIndex === 0) {
        chartData = dataObjects3.value[rowIndex].chartData;
      } else if (colIndex === 1) {
        chartData = dataObjects3.value[rowIndex].chartData2;
      }
      // 校验图表数据和日期数据
      if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
        console.error(`chartData 数据无效: ${JSON.stringify(chartData)}`);
        return;
      }
      
      // 计算所有数据中的最小值和最大值，增加空数据处理
      const allValues = [].concat(...chartData.filter(series => series && Array.isArray(series)));
      if (allValues.length === 0) {
        console.warn("没有有效数据可显示");
        return;
      }
      
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const padding = (maxValue - minValue) * 0.1;
      
      const option = {
        xAxis: {
          type: 'category',
          data: dates,
          show: false,
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false },
          axisLabel: { show: false },
          min: minValue - padding,
          max: maxValue + padding
        },
        series: [
          {
            name: 'MA4',
            data: chartData[0] || [],
            type: 'line',
            lineStyle: { width: 1, color:'#cd1f0e' },
            showSymbol: false
          },
          {
            name: 'MA8',
            data: chartData[1] || [],
            type: 'line',
            lineStyle: { width: 1 , color:'#edbf09'},
            showSymbol: false
          },
          {
            name: 'MA12',
            data: chartData[2] || [],
            type: 'line',
            lineStyle: { width: 1 ,color:'#62c613'},
            showSymbol: false
          },
          // 只添加存在的均线数据
          ...(chartData[3] ? [{
            name: 'MA16',
            data: chartData[3],
            type: 'line',
            lineStyle: { width: 1, color:'#1286ff' },
            showSymbol: false
          }] : []),
          ...(chartData[4] ? [{
            name: 'MA20',
            data: chartData[4],
            type: 'line',
            lineStyle: { width: 1 ,color:'#9f12ff'},
            showSymbol: false
          }] : []),
          ...(chartData[5] ? [{
            name: 'MA47',
            data: chartData[5],
            type: 'line',
            lineStyle: { width: 1,color:'#000000' },
            showSymbol: false
          }] : [])
        ]
      };
      
      myChart.setOption(option);
      
      // 添加窗口大小变化时重绘图表
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      
    } catch (error) {
      console.error('ECharts 初始化出错:', error);
    }
  } else if (retryCount < 5) {
    setTimeout(() => {
      initChart3(index, rowIndex, colIndex, retryCount + 1);
    }, 500);
  } else {
    console.log(`chartRef 未获取到元素: ${index}，重试次数达到上限`);
  }
};

const initChart2 = (index, rowIndex, colIndex, retryCount = 0) => {
  if (chartRefs.value[index]) {
    try {
      const myChart = echarts.init(chartRefs.value[index]);
      let chartData;
      chartData = dataObjects.value[rowIndex].chartData3;

      // 计算所有数据中的最小值和最大值
      const allValues = [].concat(...chartData);
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      // 添加一些边距，使图表更美观
      const padding = (maxValue - minValue) * 0.1;
      
      const option = {
        xAxis: {
          type: 'category',
          data: dataObjects.value[rowIndex].dates2,
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false }, // 隐藏 y 轴刻度
          axisLabel: { show: false }, // 隐藏 y 轴坐标值
          min: minValue - padding,    // 设置纵轴最小值
          max: maxValue + padding     // 设置纵轴最大值
        },
        legend: {
          data: ['MA4', 'MA12', 'MA20'],
          top: '20%' ,
          left: 'left',
          orient: 'vertical',
          itemWidth: 8,
          itemHeight: 8,
          iconSize: 8,
          textStyle: {
            color: '#000',
            fontSize: 9
          }
        },
        series: [
          {
            name: 'MA4',
            data: chartData[0],
            type: 'line',
            lineStyle: { width: 1 },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA12',
            data: chartData[1],
            type: 'line',
            lineStyle: { width: 1 },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          },
          {
            name: 'MA20',
            data: chartData[2],
            type: 'line',
            lineStyle: { width: 1 },// 减小曲线粗细
            showSymbol: false // 新增配置，去掉数据圆点
          }
        ]
      };
      myChart.setOption(option);
    } catch (error) {
      console.error('ECharts 初始化出错:', error);
    }
  } else if (retryCount < 5) {
    setTimeout(() => {
      initChart2(index, rowIndex, colIndex, retryCount + 1);
    }, 500);
  } else {
    console.log(`chartRef 未获取到元素: ${index}，重试次数达到上限`);
  }
};


// 响应式变量
const newMode = ref({
  index: '',
  name: '',
  lines: [],
  modeFolder: '',
  selectedFactor: null,
  savedBrushTimeRanges: [],
  recentNDaysValue: "近30天"
})

const saveSelfMode = async () => {
  console.log("保存自定义模式");
  // 弹出一个提示窗口，用户可以输入保存模式的名称
  const modeName = prompt("请输入保存模式的名称");
  if (modeName) {
    // 弹出信息保存成功
    try {
      // 自动设置modeFolder与index一致
      newMode.value.modeFolder = modeName;
      newMode.value.name = modeName;
      newMode.value.index = modeName;
      const oriLines = store.state.modeInfo.lines;
      const maNumbers = oriLines.filter(item => item.startsWith('MA'));

      // 将提取的数字数组赋值给新模式
      newMode.value.lines = maNumbers;
      newMode.value.savedBrushTimeRanges = store.state.newSearchInfo.savedBrushTimeRanges;
      newMode.value.recentNDaysValue = store.state.newSearchInfo.recentNDaysValue;
      // 调用Vuex action新增模式
      await store.dispatch('addNewModeToSelfList', newMode.value)
      
      // 显示成功提示
      alert('新增成功')
      
      // 重置表单
      newMode.value = {
        index: '',
        name: '',
        lines: [],
        modeFolder: '',
        selectedFactor: null,
        savedBrushTimeRanges: [],
        recentNDaysValue: "近30天"
      }
    } catch (error) {
      alert('新增失败：' + error.message)
    }
  } else {
    alert("未输入模式名称，保存操作取消");
  }
}

</script>

<style scoped>
/* 可根据需要添加样式 */
.result-table {
  margin-left: 30px;
  margin-top: 20px;
}
</style>