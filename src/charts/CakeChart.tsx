import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import styled from 'styled-components';
import {
  CAKE_DARK_CATEGORICAL,
  registerCakeDarkCategoricalTheme,
} from './theme/cake-dark-categorical';

type CakeChartProps = {
  option: EChartsOption;
  height?: number;
  className?: string;
};

/** Shared Cake& dark echarts mount — theme + resize + dispose. */
export function CakeChart({ option, height = 220, className }: CakeChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    registerCakeDarkCategoricalTheme();
    const el = hostRef.current;
    if (!el) return;

    const chart = echarts.init(el, CAKE_DARK_CATEGORICAL, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(option);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // Init once per mount; option updates handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option]);

  return <Host ref={hostRef} className={className} style={{ height }} />;
}

const Host = styled.div`
  width: 100%;
  min-width: 0;
`;
