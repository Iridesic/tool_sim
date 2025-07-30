<!--
  页面说明：
  本页面用于展示【基准股票模式评价】的结果，包括结果表格和每条结果的均线图，支持保存配置和下载结果等操作。
-->
<template>
  <div id="app">
    <!--展示模式分析结果的表格-->
    <div style="text-align: left; margin-top: 20px; background-color:#faf8e1; height: 60px; margin-top: 10px; width: 99%; margin-left: 5px; border-radius: 10px;">
      <div style="text-align: left; display: inline-flex; ">
        <span style="font-weight: bold; margin-top: 10px; margin-left: 20px; font-size: 14px;">自定义模式评价结果</span>
        <el-button
          type="info"
          plain
          style="margin-left: 740px; height: 25px; margin-top: 10px; font-size: 13px;"
        >保存配置到自定义模式
        </el-button>
        <el-button
          type="info"
          plain
          style="margin-left: 10px; height: 25px; margin-top: 10px; font-size: 13px;"
        >下载查找结果
        </el-button>
      </div>
      <div style="text-align: left;  margin-top: 0px; margin-left: 20px; font-size: 12px;">使用选定模式进行相似性查找，对结果的【后续N日内行情趋势】进行统计分析</div>
    </div>

    <el-table :data="resultData" border style="width: 99%; margin-left: 5px; margin-top: 5px;" stripe class="result-table" 
    :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="查找类型" prop="searchType" width="100px"></el-table-column>
      <el-table-column label="相似结果数" prop="searchCount" width="95px"></el-table-column>
      <el-table-column label="趋势考察区间" width="150">
          <template #default="{ row }">
            <el-select v-model="row.futureTime" placeholder="请选择考察区间" @change="handleSelectChange(row)" style="width: 120px; margin-left: 5px;">
              <el-option label="未来三天" value="3" />
              <el-option label="未来五天" value="5" />
              <el-option label="未来十天" value="10" />
              <el-option label="未来一个月" value="30" />
              <el-option label="自定义时间/天" value="custom" />
            </el-select>
            <!-- 自定义时间输入框 -->
            <el-input v-if="row.showCustomInput" v-model="row.customDays" placeholder="请输入天数" 
              type="number" @blur="handleCustomInput(row)" class="mt-2 w-48" />
          </template>
        </el-table-column>
      <el-table-column label="平均收益率(N日)" prop="futureIncome" width="95px"></el-table-column>
      <el-table-column label="最大回撤幅度(N日)" prop="maxRange" width="115px"></el-table-column>
      <el-table-column label="最大波动率(N日)" prop="maxRate" width="100px"></el-table-column>
        <!--上升幅度最大的区间-->
        <el-table-column label="最大涨幅(N日)" prop="stockIncrease" width="90"></el-table-column>
        <!--下降幅度最大的区间-->
        <el-table-column label="最大跌幅(N日)" prop="stockDecrease" width="90"></el-table-column>
        <!-- 未来表现比例 - 饼状图 -->
        <el-table-column label="后续N日胜率比例" width="200px">
          <template #default="{ $index }">
            <div :ref="(el) => setChartRef1(el, $index, 0)" style="width: 100px; height: 100px; margin-top: -5px; margin-bottom: -5px; margin-left:40px;"></div>
          </template>
        </el-table-column>
        <el-table-column label="综合评分" prop="score"></el-table-column>
      </el-table>

    <!--结果详情展示-->
    <div style="text-align: left; margin-top: 40px; background-color:#faf8e1; height: 30px; margin-top: 5px; display: inline-flex; width: 99%;border-radius: 10px; margin-left: -5px;">
      <span style="font-weight: bold; margin-top: 5px; margin-left: 20px; font-size: 14px;">模式相似性查找结果详情</span>
    </div>

    <el-table :data="tableData" border style="width: 99%; margin-left: 5px; margin-top: 5px;" stripe class="result-table" 
    :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column fixed label="股票名称" prop="stockName" width="80px"></el-table-column>
      <el-table-column fixed label="股票代码" prop="stockCode" width="80px"></el-table-column>
      <el-table-column label="股票来源" prop="stockFrom" width="100px"></el-table-column>
      <el-table-column label="起始时间" prop="startDate"  width="100px"></el-table-column>
      <el-table-column label="终止时间" prop="endDate"  width="100px"></el-table-column>
      <el-table-column label="基础MA指标图" width="200px">
        <template #default="{ $index }">
          <div :ref="(el) => setChartRef(el, $index, 0)" style="width: 180px; height: 200px; margin-top: -20px; margin-bottom: -30px;"></div>
        </template>
      </el-table-column>
      <el-table-column label="上证/深证指数MA" width="200px">
        <template #default="{ $index }">
          <div :ref="(el) => setChartRef(el, $index, 1)" style="width: 180px; height: 200px; margin-top: -20px; margin-bottom: -30px;"></div>
        </template>
      </el-table-column>
      <el-table-column label="未来均线表现变化" width="200px">
        <template #default="{ $index }">
          <div :ref="(el) => setChartRef(el, $index, 2)" style="width: 180px; height: 200px; margin-top: -20px; margin-bottom: -30px;"></div>
        </template>
      </el-table-column>
      <el-table-column label="相似度" prop="similarity"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, toRaw, computed  } from 'vue';
import { useStore } from "vuex";
import * as echarts from 'echarts';

const store = useStore();

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

// 根据涨幅正负设置标签样式
const getTagType = (value) => {
  return value < 0 ? 'success' : value > 0 ? 'danger' : 'info'
}

// 根据涨幅正负设置标签样式
const getTagType1 = (value) => {
  return value > 0 ? 'success' : value < 0 ? 'danger' : 'info'
}

const setChartRef1 = (el, rowIndex, colIndex) => {
  if (el) {
    nextTick(() => {
      initChart1(el, rowIndex)
    })
  }
}

const initChart1 = (el, rowIndex) => {
  const chart = echarts.init(el)
  const data = resultData.value[rowIndex].riseFallRatio
  const option = {
    series: [
      {
        name: '涨跌比例',
        type: 'pie',
        radius: ['30%', '80%'],
        avoidLabelOverlap: true, // 开启标签重叠避免
        label: {
          show: true,
          position: 'inside', // 标签放在饼图内部
          formatter: '{b}\n{c}%', // 名称和百分比分行显示
          fontSize: 11,
          color: '#fff', // 白色文字，确保在深色区域可见
          backgroundColor: 'transparent', // 透明背景
          fontWeight: 'bold'
        },
        labelLine: {
          show: false // 不显示指示线
        },
        data: [
          { value: data[0], name: '跌', itemStyle: { color: '#10b981' } }, // 绿色
          { value: data[1], name: '涨', itemStyle: { color: '#ef4444' } }  // 红色
        ]
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const dataObjects = ref([]);
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

// 处理选择器变化
const handleSelectChange = (row) => {
  row.showCustomInput = false
  row.customDays = ''
  if (row.futureTime === 'custom') {
    row.showCustomInput = true
  }
  console.log(`用户选择了: ${row.futureTime}`)
}

// 处理自定义时间输入
const handleCustomInput = (row) => {
  if (row.customDays && !isNaN(Number(row.customDays))) {
    row.futureTime = Number(row.customDays)
    console.log(`用户自定义时间: ${row.futureTime}天`)
  } else {
    row.futureTime = '3' // 默认恢复为3天
    row.customDays = ''
    console.log('输入无效，恢复默认值')
  }
}

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
  if (index % 3 === 0 || index % 3 === 1) {
    initChart(index, rowIndex, colIndex);
  }
  if (index % 3 === 2) {
    initChart2(index, rowIndex, colIndex);
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
      initChart(index, rowIndex, colIndex, retryCount + 1);
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

</script>

<style scoped>
/* 可根据需要添加样式 */
.result-table {
  margin-left: 30px;
  margin-top: 20px;
}
</style>