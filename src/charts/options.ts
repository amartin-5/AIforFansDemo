import type { EChartsOption } from 'echarts';
import { CAKE_CATEGORICAL_COLORS } from './theme/cake-dark-categorical';

const FONT = "'Rookery New','Rookery','Noto Sans',system-ui,sans-serif";

const TOOLTIP_BASE = {
  backgroundColor: '#f9f9f9',
  borderColor: '#322f30',
  borderWidth: 1,
  padding: [8, 12] as [number, number],
  textStyle: {
    color: '#25262d',
    fontFamily: FONT,
    fontSize: 12,
  },
  extraCssText:
    'border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2);',
};

const AXIS_LABEL = {
  show: true,
  color: '#c6c6cf',
  fontFamily: FONT,
  fontSize: 12,
};

type NamedValue = { name: string; value: number };

/** Horizontal-friendly vertical bar chart (Cake& dark bar snippet pattern). */
export function createBarOption(categories: string[], values: number[]): EChartsOption {
  return {
    textStyle: { fontFamily: FONT },
    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    animationDelay: (idx: number) => idx * 40,
    grid: { left: 8, right: 8, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      ...TOOLTIP_BASE,
      show: true,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: { show: false },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { show: true, lineStyle: { color: '#5e5e5e' } },
      axisTick: { show: false },
      axisLabel: {
        ...AXIS_LABEL,
        interval: 0,
        rotate: categories.some((c) => c.length > 8) ? 30 : 0,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: AXIS_LABEL,
      splitLine: { show: true, lineStyle: { color: '#322f30' } },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 36,
        data: values.map((value, i) => ({
          value,
          itemStyle: {
            color: CAKE_CATEGORICAL_COLORS[i % CAKE_CATEGORICAL_COLORS.length],
            borderRadius: [12, 12, 0, 0],
          },
        })),
      },
    ],
  };
}

/** Donut pie (Cake& dark pie snippet pattern). */
export function createPieOption(items: NamedValue[]): EChartsOption {
  return {
    textStyle: { fontFamily: FONT },
    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    tooltip: {
      ...TOOLTIP_BASE,
      show: true,
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      show: true,
      type: 'scroll',
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
      textStyle: { color: '#c6c6cf', fontFamily: FONT, fontSize: 11 },
      bottom: 4,
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '42%'],
        radius: ['40%', '68%'],
        avoidLabelOverlap: true,
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: '#25262d',
          borderWidth: 2,
          borderRadius: 12,
        },
        data: items.map((item, i) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: CAKE_CATEGORICAL_COLORS[i % CAKE_CATEGORICAL_COLORS.length],
          },
        })),
      },
    ],
  };
}

/** Single smooth line (Cake& dark line snippet pattern). */
export function createLineOption(
  categories: string[],
  seriesName: string,
  values: number[],
): EChartsOption {
  const color = CAKE_CATEGORICAL_COLORS[0];
  return {
    textStyle: { fontFamily: FONT },
    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    grid: { left: 8, right: 12, top: 16, bottom: 36, containLabel: true },
    tooltip: {
      ...TOOLTIP_BASE,
      show: true,
      trigger: 'axis',
    },
    legend: {
      show: true,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#c6c6cf', fontFamily: FONT, fontSize: 12 },
      bottom: 0,
      left: 'center',
      data: [seriesName],
    },
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap: false,
      axisLine: { show: true, lineStyle: { color: '#5e5e5e' } },
      axisTick: { show: false },
      axisLabel: AXIS_LABEL,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: AXIS_LABEL,
      splitLine: { show: true, lineStyle: { color: '#322f30' } },
    },
    series: [
      {
        type: 'line',
        name: seriesName,
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        showSymbol: true,
        lineStyle: { width: 2, color },
        itemStyle: {
          color,
          borderColor: '#25262d',
          borderWidth: 1.5,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(117, 134, 255, 0.35)' },
              { offset: 1, color: 'rgba(117, 134, 255, 0.02)' },
            ],
          },
        },
      },
    ],
  };
}

/** Semi gauge for a single percentage metric. */
export function createGaugeOption(name: string, value: number, color: string): EChartsOption {
  return {
    textStyle: { fontFamily: FONT },
    animation: true,
    animationDuration: 600,
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: '100%',
        center: ['50%', '55%'],
        progress: {
          show: true,
          roundCap: true,
          width: 12,
          itemStyle: { color },
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, '#322f30']],
          },
        },
        pointer: { show: false },
        anchor: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: false,
          formatter: (v: number) => `${Math.round(v)}%`,
          color: '#ffffff',
          fontSize: 20,
          fontFamily: FONT,
          fontWeight: 700,
          offsetCenter: [0, '0%'],
        },
        title: {
          show: true,
          offsetCenter: [0, '28%'],
          color: '#c6c6cf',
          fontSize: 11,
          fontFamily: FONT,
        },
        data: [{ value, name }],
      },
    ],
  };
}
