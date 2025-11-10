'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const description = 'An interactive area chart';

const chartData = [
    { date: '2024-04-01', Accepted: 222, Refuse: 150 },
    { date: '2024-04-02', Accepted: 97, Refuse: 180 },
    { date: '2024-04-03', Accepted: 167, Refuse: 120 },
    { date: '2024-04-04', Accepted: 242, Refuse: 260 },
    { date: '2024-04-05', Accepted: 373, Refuse: 290 },
    { date: '2024-04-06', Accepted: 301, Refuse: 340 },
    { date: '2024-04-07', Accepted: 245, Refuse: 180 },
    { date: '2024-04-08', Accepted: 409, Refuse: 320 },
    { date: '2024-04-09', Accepted: 59, Refuse: 110 },
    { date: '2024-04-10', Accepted: 261, Refuse: 190 },
    { date: '2024-04-11', Accepted: 327, Refuse: 350 },
    { date: '2024-04-12', Accepted: 292, Refuse: 210 },
    { date: '2024-04-13', Accepted: 342, Refuse: 380 },
    { date: '2024-04-14', Accepted: 137, Refuse: 220 },
    { date: '2024-04-15', Accepted: 120, Refuse: 170 },
    { date: '2024-04-16', Accepted: 138, Refuse: 190 },
    { date: '2024-04-17', Accepted: 446, Refuse: 360 },
    { date: '2024-04-18', Accepted: 364, Refuse: 410 },
    { date: '2024-04-19', Accepted: 243, Refuse: 180 },
    { date: '2024-04-20', Accepted: 89, Refuse: 150 },
    { date: '2024-04-21', Accepted: 137, Refuse: 200 },
    { date: '2024-04-22', Accepted: 224, Refuse: 170 },
    { date: '2024-04-23', Accepted: 138, Refuse: 230 },
    { date: '2024-04-24', Accepted: 387, Refuse: 290 },
    { date: '2024-04-25', Accepted: 215, Refuse: 250 },
    { date: '2024-04-26', Accepted: 75, Refuse: 130 },
    { date: '2024-04-27', Accepted: 383, Refuse: 420 },
    { date: '2024-04-28', Accepted: 122, Refuse: 180 },
    { date: '2024-04-29', Accepted: 315, Refuse: 240 },
    { date: '2024-04-30', Accepted: 454, Refuse: 380 },
    { date: '2024-05-01', Accepted: 165, Refuse: 220 },
    { date: '2024-05-02', Accepted: 293, Refuse: 310 },
    { date: '2024-05-03', Accepted: 247, Refuse: 190 },
    { date: '2024-05-04', Accepted: 385, Refuse: 420 },
    { date: '2024-05-05', Accepted: 481, Refuse: 390 },
    { date: '2024-05-06', Accepted: 498, Refuse: 520 },
    { date: '2024-05-07', Accepted: 388, Refuse: 300 },
    { date: '2024-05-08', Accepted: 149, Refuse: 210 },
    { date: '2024-05-09', Accepted: 227, Refuse: 180 },
    { date: '2024-05-10', Accepted: 293, Refuse: 330 },
    { date: '2024-05-11', Accepted: 335, Refuse: 270 },
    { date: '2024-05-12', Accepted: 197, Refuse: 240 },
    { date: '2024-05-13', Accepted: 197, Refuse: 160 },
    { date: '2024-05-14', Accepted: 448, Refuse: 490 },
    { date: '2024-05-15', Accepted: 473, Refuse: 380 },
    { date: '2024-05-16', Accepted: 338, Refuse: 400 },
    { date: '2024-05-17', Accepted: 499, Refuse: 420 },
    { date: '2024-05-18', Accepted: 315, Refuse: 350 },
    { date: '2024-05-19', Accepted: 235, Refuse: 180 },
    { date: '2024-05-20', Accepted: 177, Refuse: 230 },
    { date: '2024-05-21', Accepted: 82, Refuse: 140 },
    { date: '2024-05-22', Accepted: 81, Refuse: 120 },
    { date: '2024-05-23', Accepted: 252, Refuse: 290 },
    { date: '2024-05-24', Accepted: 294, Refuse: 220 },
    { date: '2024-05-25', Accepted: 201, Refuse: 250 },
    { date: '2024-05-26', Accepted: 213, Refuse: 170 },
    { date: '2024-05-27', Accepted: 420, Refuse: 460 },
    { date: '2024-05-28', Accepted: 233, Refuse: 190 },
    { date: '2024-05-29', Accepted: 78, Refuse: 130 },
    { date: '2024-05-30', Accepted: 340, Refuse: 280 },
    { date: '2024-05-31', Accepted: 178, Refuse: 230 },
    { date: '2024-06-01', Accepted: 178, Refuse: 200 },
    { date: '2024-06-02', Accepted: 470, Refuse: 410 },
    { date: '2024-06-03', Accepted: 103, Refuse: 160 },
    { date: '2024-06-04', Accepted: 439, Refuse: 380 },
    { date: '2024-06-05', Accepted: 88, Refuse: 140 },
    { date: '2024-06-06', Accepted: 294, Refuse: 250 },
    { date: '2024-06-07', Accepted: 323, Refuse: 370 },
    { date: '2024-06-08', Accepted: 385, Refuse: 320 },
    { date: '2024-06-09', Accepted: 438, Refuse: 480 },
    { date: '2024-06-10', Accepted: 155, Refuse: 200 },
    { date: '2024-06-11', Accepted: 92, Refuse: 150 },
    { date: '2024-06-12', Accepted: 492, Refuse: 420 },
    { date: '2024-06-13', Accepted: 81, Refuse: 130 },
    { date: '2024-06-14', Accepted: 426, Refuse: 380 },
    { date: '2024-06-15', Accepted: 307, Refuse: 350 },
    { date: '2024-06-16', Accepted: 371, Refuse: 310 },
    { date: '2024-06-17', Accepted: 475, Refuse: 520 },
    { date: '2024-06-18', Accepted: 107, Refuse: 170 },
    { date: '2024-06-19', Accepted: 341, Refuse: 290 },
    { date: '2024-06-20', Accepted: 408, Refuse: 450 },
    { date: '2024-06-21', Accepted: 169, Refuse: 210 },
    { date: '2024-06-22', Accepted: 317, Refuse: 270 },
    { date: '2024-06-23', Accepted: 480, Refuse: 530 },
    { date: '2024-06-24', Accepted: 132, Refuse: 180 },
    { date: '2024-06-25', Accepted: 141, Refuse: 190 },
    { date: '2024-06-26', Accepted: 434, Refuse: 380 },
    { date: '2024-06-27', Accepted: 448, Refuse: 490 },
    { date: '2024-06-28', Accepted: 149, Refuse: 200 },
    { date: '2024-06-29', Accepted: 103, Refuse: 160 },
    { date: '2024-06-30', Accepted: 446, Refuse: 400 },
];

const chartConfig = {
    Person: {
        label: 'Person',
    },

    desktop: {
        label: 'Accepted',
        color: 'var(--primary)',
    },

    mobile: {
        label: 'Refuse',
        color: 'var(--primary)',
    },
};

export function ChartAreaInteractive() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date('2024-06-30');
        let daysToSubtract = 90;
        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className='@container/card'>
            <CardHeader>
                <CardTitle>Total Task Complete</CardTitle>
                <CardDescription>
                    <span className='hidden @[540px]/card:block'>Total for the last 3 months</span>
                    <span className='@[540px]/card:hidden'>Last 3 months</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type='single'
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant='outline'
                        className='hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex'
                    >
                        <ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
                            size='sm'
                            aria-label='Select a value'
                        >
                            <SelectValue placeholder='Last 3 months' />
                        </SelectTrigger>
                        <SelectContent className='rounded-xl'>
                            <SelectItem value='90d' className='rounded-lg'>
                                Last 3 months
                            </SelectItem>
                            <SelectItem value='30d' className='rounded-lg'>
                                Last 30 days
                            </SelectItem>
                            <SelectItem value='7d' className='rounded-lg'>
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
                <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor='var(--color-desktop)'
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='var(--color-desktop)'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor='var(--color-mobile)'
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='var(--color-mobile)'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='date'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        });
                                    }}
                                    indicator='dot'
                                />
                            }
                        />
                        <Area
                            dataKey='Refuse'
                            type='natural'
                            fill='url(#fillMobile)'
                            stroke='var(--color-mobile)'
                            stackId='a'
                        />
                        <Area
                            dataKey='Accepted'
                            type='natural'
                            fill='url(#fillDesktop)'
                            stroke='var(--color-desktop)'
                            stackId='a'
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
