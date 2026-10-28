import * as echarts from 'echarts';

/** Cake& dark categorical theme — vendored from cake datavis playground. */
export const CAKE_DARK_CATEGORICAL = 'cake-dark-categorical';

export const CAKE_CATEGORICAL_COLORS = [
  '#7586ff',
  '#00bbdf',
  '#e2c600',
  '#f65396',
  '#2cc27e',
  '#fb911c',
  '#9db600',
  '#dd8aff',
  '#fcbb42',
  '#75adfd',
  '#ff8886',
  '#ababab',
] as const;

const FONT = "'Rookery New','Rookery','Noto Sans',system-ui,sans-serif";

let registered = false;

export function registerCakeDarkCategoricalTheme() {
  if (registered) return;
  echarts.registerTheme(CAKE_DARK_CATEGORICAL, {
    color: [...CAKE_CATEGORICAL_COLORS],
    backgroundColor: 'transparent',
    textStyle: {
      color: '#ffffff',
      fontFamily: FONT,
    },
    title: {
      textStyle: {
        color: '#ffffff',
        fontFamily: FONT,
        fontWeight: 600,
      },
      subtextStyle: {
        color: '#c6c6cf',
        fontFamily: FONT,
      },
    },
    legend: {
      textStyle: {
        color: '#c6c6cf',
        fontFamily: FONT,
      },
      pageTextStyle: {
        color: '#aaaab4',
        fontFamily: FONT,
      },
    },
    tooltip: {
      backgroundColor: '#f9f9f9',
      borderColor: '#322f30',
      borderWidth: 1,
      textStyle: {
        color: '#25262d',
        fontFamily: FONT,
      },
      extraCssText:
        'border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2);',
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: '#5e5e5e' } },
      axisTick: { lineStyle: { color: '#5e5e5e' } },
      axisLabel: { color: '#c6c6cf', fontFamily: FONT },
      splitLine: { lineStyle: { color: '#322f30' } },
      nameTextStyle: { color: '#c6c6cf', fontFamily: FONT },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: '#5e5e5e' } },
      axisTick: { lineStyle: { color: '#5e5e5e' } },
      axisLabel: { color: '#c6c6cf', fontFamily: FONT },
      splitLine: { lineStyle: { color: '#322f30' } },
      nameTextStyle: { color: '#c6c6cf', fontFamily: FONT },
    },
    logAxis: {
      axisLine: { lineStyle: { color: '#5e5e5e' } },
      axisTick: { lineStyle: { color: '#5e5e5e' } },
      axisLabel: { color: '#c6c6cf', fontFamily: FONT },
      splitLine: { lineStyle: { color: '#322f30' } },
      nameTextStyle: { color: '#c6c6cf', fontFamily: FONT },
    },
    timeAxis: {
      axisLine: { lineStyle: { color: '#5e5e5e' } },
      axisTick: { lineStyle: { color: '#5e5e5e' } },
      axisLabel: { color: '#c6c6cf', fontFamily: FONT },
      splitLine: { lineStyle: { color: '#322f30' } },
      nameTextStyle: { color: '#c6c6cf', fontFamily: FONT },
    },
    line: {
      itemStyle: { borderWidth: 1 },
      lineStyle: { width: 2 },
      symbolSize: 10,
      symbol: 'circle',
      smooth: false,
    },
    bar: {
      itemStyle: { borderRadius: [12, 12, 0, 0] },
    },
    pie: {
      itemStyle: {
        borderColor: '#25262d',
        borderWidth: 2,
        borderRadius: 12,
      },
    },
    scatter: {
      itemStyle: {},
      symbolSize: 10,
    },
    radar: {
      axisName: { color: '#c6c6cf', fontFamily: FONT },
      splitLine: { lineStyle: { color: '#322f30' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: '#5e5e5e' } },
    },
    gauge: {
      axisLine: {
        lineStyle: {
          color: [[1, '#322f30']],
        },
      },
      axisLabel: { color: '#c6c6cf', fontFamily: FONT },
      detail: { color: '#ffffff', fontFamily: FONT },
    },
  });
  registered = true;
}
