<!--
  页面说明：
  本页面用于绘制股票K线图和多条均线（MA）图表，支持区间选择、缩放、动态指标展示等，是主页面的核心图表展示组件。
-->
<template>
  <div
    ref="chartRef111"
    :style="`width: ${width ? width + 'px' : '980px'}; height: ${height ? height + 'px' : '550px'}; margin-left: 0px`"
  ></div>
</template>
  
<script setup>
import { ref, nextTick, onMounted, watch } from "vue";
import * as echarts from "echarts";
import axios from "axios";

const props = defineProps({
  code: {
    type: String,
    default: false,
  },
  startDate: {
    type: Date,
    default: () => new Date("2016-06-02"),
  },
  endDate: {
    type: Date,
    default: () => new Date("2016-06-20"),
  },
  checkListMAOption: {
    type: Array,
    default: () => ["", "MA4", "MA8", "MA12", "MA16", "MA20", "MA47"],
  },
  width: {
    type: [Number, String],
    default: 980
  },
  height: {
    type: [Number, String],
    default: 550
  },
  // 支持自定义图例
  legendData: {
    type: Array,
    default: () => ["SZSE component index", "MA4", "MA8", "MA12", "MA16", "MA20", "MA47"]
  }
});

// 颜色常量，涨跌颜色
const upColor = "#00da3c";
const downColor = "#ec0000";

/**
 * 拆分原始K线数据为ECharts需要的格式
 * @param {Array} rawData - 原始K线数据
 * @returns {Object} categoryData: 日期数组, values: K线数据, volumes: 成交量数据
 */
function splitData(rawData) {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(item);
    const isUp = item[1] > item[0]; // 收盘价 > 开盘价
    volumes.push({
      value: [i, item[4]],
      itemStyle: {
        color: isUp ? upColor : downColor,
      },
    });
  }
  return {
    categoryData,
    values,
    volumes,
  };
}

/**
 * 计算均线（MA）数据
 * @param {number} dayCount - 均线天数
 * @param {Object} data - splitData返回的数据对象
 * @returns {Array} 均线数据数组
 */
function calculateMA(dayCount, data) {
  let result = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

// 图表DOM引用
const chartRef111 = ref(null);
// ECharts实例
let myChart = null;
// 全局原始数据缓存
let rawDataGlobal = null;


function formatDateToLocal(date) {
  const year = date.getFullYear();
  // 月份从 0 开始，需要 +1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 监听日期区间变化，自动刷新图表区间显示
 */
watch(
  [() => props.startDate, () => props.endDate],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
    if (newStartDate !== oldStartDate || newEndDate !== oldEndDate) {
      console.log("日期发生变化，开始刷新筛选子图");
      console.log("新的开始日期:", newStartDate);
      console.log("新的结束日期:", newEndDate);

      // 整合 handleDateChange 方法的逻辑
      if (!myChart || !rawDataGlobal) return;
      // 【1】保证 startDate endDate 都转成 'yyyy-MM-dd' 字符串
      if (newStartDate instanceof Date) {
        newStartDate = formatDateToLocal(newStartDate);
      }
      if (newEndDate instanceof Date) {
        newEndDate = formatDateToLocal(newEndDate);
      }
      // 【2】找索引
      const startIndex = rawDataGlobal.categoryData.findIndex((d) => d >= newStartDate);
      let endIndex = rawDataGlobal.categoryData.findIndex((d) => d >= newEndDate);

      if (startIndex === -1) return;
      if (endIndex === -1) endIndex = rawDataGlobal.categoryData.length - 1;
      // 【3】刷选主图
      myChart.dispatchAction({
        type: "brush",
        areas: [
          {
            brushType: "lineX",
            coordRange: [newStartDate, newEndDate],
            xAxisIndex: 0,
          },
        ],
      });
      // 【4】同步缩放小图
      myChart.dispatchAction({
        type: "dataZoom",
        start: (startIndex / rawDataGlobal.categoryData.length) * 100,
        end: (endIndex / rawDataGlobal.categoryData.length) * 100 + 0.1,
      });
    }
  },
  {
    deep: true,
    immediate: true, // 立即执行一次回调函数
  }
);

/**
 * 拉取数据并渲染图表
 * 1. 获取数据 2. 处理数据 3. 设置option 4. 刷新图表
 */
const fetchDataAndUpdateChart = async () => {
  if (chartRef111.value) {
    if (!myChart) {
      myChart = echarts.init(chartRef111.value);
    }
    try {
      /*
        从json文件获取数据
      */
      const response = await axios.get(`/data/${props.code}.json`);
      const rawData = response.data;
      rawDataGlobal = splitData(rawData);
      setChartOption();
      myChart.dispatchAction({
      type: "brush",
      areas: [
        {
          brushType: "lineX",
          coordRange: ["2020-01-01", "2020-12-31"],
          xAxisIndex: 0,
        },
      ],
    });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }
};

/**
 * 设置ECharts图表option并渲染
 * 包含K线、均线、成交量、图例、工具箱等配置
 */
function setChartOption() {
  console.log("setChartOption----", props.checkListMAOption);
  const option = {
    color: ['#cd1f0e ', '#edbf09', '#62c613', '#1286ff', '#9f12ff', '#000000'], // 定义全局调色盘颜色
    animation: true,
    legend: {
      top: 35, // 图例距离顶部的距离
      left: "center", // 图例居中
      data: props.checkListMAOption, // 图例显示的系列名称
      selected:{'个股':false, '深证指数':false, '行业指数':false},
      itemWidth: 13, // 图例标记的宽度（像素）
      itemHeight: 13, // 图例标记的高度（像素）
      textStyle: {
        fontSize: 11 // 图例文字的字体大小
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      textStyle: { color: "#000", align: "left" },
      position: function (pos) {
        return [pos[0] + 80, pos[1] + 80];
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
      label: { backgroundColor: "#777" },
    },
    toolbox: {
      right: 90,
      top: 425,
      feature: {
        dataZoom: { yAxisIndex: false },
        brush: { type: ["lineX", "clear"] },
      },
    },
    brush: {
      xAxisIndex: "all",
      brushLink: "all",
      outOfBrush: { colorAlpha: 0.1 },
    },
    grid: [
      {
        left: "10%",
        right: "8%",
        height: "50%",
      },
      {
        left: "10%",
        right: "8%",
        top: "59%",
        height: "16%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: rawDataGlobal.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          z: 100,
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: rawDataGlobal.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
        splitLine: { show: false },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        show: false,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 95,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "85%",
        height: 15,
        start: 95,
        end: 100,
      },
    ],
    series: [
      // k线图
      {
        name: props.checkListMAOption[0],
        type: "candlestick",
        data: rawDataGlobal.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
      },
      // 动态插入 MA线
       ...props.checkListMAOption.slice(1).map((ma) => ({
        name: ma,
        type: "line",
        data: calculateMA(parseInt(ma.replace("MA", "")), rawDataGlobal),
        smooth: true,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: { opacity: 1, width: 0.8 },
      })),
    ],
  };
  myChart.setOption(option, true);
}

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    fetchDataAndUpdateChart();
  });
});

// 监听均线勾选变化，实时更新图表
watch(() => props.checkListMAOption, () => {
  console.log(props.checkListMAOption)
    if (rawDataGlobal && myChart) {
      // 假设 myChart 有 setChartOption 方法
      console.log("均线勾选变化，开始刷新图表--------", props.startDate, props.endDate);
      setChartOption();
      // 重新刷选代码
      const newStartDate = props.startDate;
      const newEndDate = props.endDate;
      if (!myChart || !rawDataGlobal) return;
      if (newStartDate instanceof Date) {
        newStartDate = formatDateToLocal(newStartDate);
      }
      if (newEndDate instanceof Date) {
        newEndDate = formatDateToLocal(newEndDate);
      }
      const startIndex = rawDataGlobal.categoryData.findIndex((d) => d >= newStartDate);
      let endIndex = rawDataGlobal.categoryData.findIndex((d) => d >= newEndDate);
      if (startIndex === -1) return;
      if (endIndex === -1) endIndex = rawDataGlobal.categoryData.length - 1;
      myChart.dispatchAction({
        type: "brush",
        areas: [
          {
            brushType: "lineX",
            coordRange: [newStartDate, newEndDate],
            xAxisIndex: 0,
          },
        ],
      });
      myChart.dispatchAction({
        type: "dataZoom",
        start: (startIndex / rawDataGlobal.categoryData.length) * 100,
        end: (endIndex / rawDataGlobal.categoryData.length) * 100 + 0.1,
      });
    }
  },
  { deep: true }
);

// 监听股票code变化，切换数据时自动刷新图表
watch(() => props.code,() => {fetchDataAndUpdateChart();}
);
</script>    