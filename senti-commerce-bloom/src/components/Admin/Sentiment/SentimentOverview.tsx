
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useAppSelector } from '@/app/hooks';

const SentimentOverview = () => {
  const { overview } = useAppSelector((state) => state.adminSentiment);

  const chartData = [
    { name: 'Positive', value: overview.sentimentDistribution.positive, fill: 'hsl(var(--chart-1))' },
    { name: 'Neutral', value: overview.sentimentDistribution.neutral, fill: 'hsl(var(--chart-2))' },
    { name: 'Negative', value: overview.sentimentDistribution.negative, fill: 'hsl(var(--chart-3))' },
  ];
  
  const chartConfig = {
    positive: { label: "Positive", color: "hsl(var(--chart-1))" },
    neutral: { label: "Neutral", color: "hsl(var(--chart-2))" },
    negative: { label: "Negative", color: "hsl(var(--chart-3))" },
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.totalReviews.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.averageSentiment.toFixed(1)} / 5</div>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentOverview;
