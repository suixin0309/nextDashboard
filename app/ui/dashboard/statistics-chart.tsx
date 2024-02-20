'use client';

import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
// import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';
import { Pie } from '@antv/g2plot';
import { useRef,useEffect } from 'react'

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function StatisticsChart() {
  // const revenue = await fetchRevenue();
  const chartHeight = 250;
  // NOTE: comment in this code when you get to this point in the course

  // const { yAxisLabels, topLabel } = generateYAxis(revenue);

  const data = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他', value: 5 },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  let piePlot:any;
  useEffect(()=>{
    if(containerRef.current&&!piePlot){
      piePlot = new Pie(containerRef.current, {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 14,
          },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            content: 'AntV',
          },
        },
      });
      piePlot.render();
    }
    // piePlot.render();
  },[])
  useEffect(()=>{
    if(containerRef.current){
      // piePlot.render();
    }
  },[])

  // if (!revenue || revenue.length === 0) {
  //   return <p className="mt-4 text-gray-400">No data available.</p>;
  // }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        项目统计
      </h2>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className=" mt-0  items-end gap-2 rounded-md bg-white p-4 ">
          <div style={{ height: chartHeight }} ref={containerRef}></div>
        </div>
        {/* <div className="flex items-center pb-2 pt-6"> */}
          {/* <CalendarIcon className="h-5 w-5 text-gray-500" /> */}
          {/* <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3> */}
        {/* </div> */}
      </div>
    </div>
  );
}
