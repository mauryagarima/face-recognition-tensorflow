"use client"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';
import { Skeleton } from 'antd';

// #region Sample data

// #endregion
const AreaChartExample = ({ isAnimationActive = true }) => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Array<{ date: string, count: number }>>([])

    const getAttandance = async () => {
        setLoading(true)
        const apiRes = await fetch("/api/attendence")
        const apiJson = await apiRes.json()
        setLoading(false)

        let x: any = {
        }

        apiJson.forEach(({ date }: { date: string }) => {
            if (x[date]) {
                x[date] = x[date] + 1
            } else {
                x[date] = 1
            }
        });

        let keys = Object.keys(x)
        console.log("x", x);
        console.log("keys", keys);

        let proper: Array<{ date: string, count: number }> = keys.map((e) => ({ date: e, count: x[e] }))
        console.log("proper", proper);



        setData(proper)
    }

    useEffect(() => {
        getAttandance()
    }, [])

    return loading ? <Skeleton active /> : <AreaChart
        style={{ width: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
        responsive
        data={data}
    // margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis width="auto" />
        <Tooltip />
        <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorPv)"
            isAnimationActive={isAnimationActive}
            animationBegin={200}
            animationDuration={1300}
        />
        {/* <Area
      type="monotone"
      dataKey="pv"
      stroke="#82ca9d"
      fillOpacity={1}
      fill="url(#colorPv)"
      isAnimationActive={isAnimationActive}
    /> */}
        <RechartsDevtools />
    </AreaChart>
}

export default AreaChartExample;