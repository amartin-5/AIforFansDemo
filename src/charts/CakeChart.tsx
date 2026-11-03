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
  ariaLabel?: string;
  empty?: boolean;
  emptyLabel?: string;
};

/** Shared Cake& dark echarts mount — theme + resize + dispose. */
export function CakeChart({
  option,
  height = 220,
  className,
  ariaLabel = 'Chart',
  empty = false,
  emptyLabel = 'Chart data unavailable',
}: CakeChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (empty) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empty]);

  useEffect(() => {
    if (empty) return;
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option, empty]);

  if (empty) {
    return (
      <Empty role="status" style={{ height }} className={className}>
        {emptyLabel}
      </Empty>
    );
  }

  return (
    <Host
      ref={hostRef}
      className={className}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}

const Host = styled.div`
  width: 100%;
  min-width: 0;
`;

const Empty = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
