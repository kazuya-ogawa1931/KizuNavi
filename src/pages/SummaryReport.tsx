import React, { useState } from "react";
import { THEME_COLORS } from "../types";

const SummaryReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-04-01");

  // Mock data for summary report
  const summaryData = {
    "2024-04-01": {
      kizunaScore: { score: 5.1, positiveRate: 74.2 },
      engagementScore: { score: 4.3, positiveRate: 68.5 },
      satisfactionScore: { score: 5.5, positiveRate: 81.3 },
      humanCapitalScore: { score: 4.8, positiveRate: 72.9 },
    },
    "2024-03-01": {
      kizunaScore: { score: 4.9, positiveRate: 71.8 },
      engagementScore: { score: 4.2, positiveRate: 66.2 },
      satisfactionScore: { score: 5.1, positiveRate: 78.5 },
      humanCapitalScore: { score: 4.6, positiveRate: 70.1 },
    },
    "2024-02-01": {
      kizunaScore: { score: 4.8, positiveRate: 69.3 },
      engagementScore: { score: 4.0, positiveRate: 64.7 },
      satisfactionScore: { score: 4.9, positiveRate: 75.2 },
      humanCapitalScore: { score: 4.4, positiveRate: 67.8 },
    },
  };

  const currentData = summaryData[selectedPeriod as keyof typeof summaryData];

  const metricsData = [
    {
      name: "キズナ度",
      score: currentData.kizunaScore.score,
      positiveRate: currentData.kizunaScore.positiveRate,
    },
    {
      name: "エンゲージメントスコア",
      score: currentData.engagementScore.score,
      positiveRate: currentData.engagementScore.positiveRate,
    },
    {
      name: "従業員満足度スコア",
      score: currentData.satisfactionScore.score,
      positiveRate: currentData.satisfactionScore.positiveRate,
    },
    {
      name: "人的資本スコア",
      score: currentData.humanCapitalScore.score,
      positiveRate: currentData.humanCapitalScore.positiveRate,
    },
  ];

  const BarChart = ({
    data,
    title,
  }: {
    data: typeof metricsData;
    title: string;
  }) => {
    const width = 500;
    const height = 400;
    const padding = 60;
    const maxValue = 6;
    const chartHeight = height - 2 * padding;

    return (
      <div
        className="bg-white rounded-lg shadow-sm border p-6"
        style={{ borderColor: THEME_COLORS.border }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-lg">
            <svg
              width="100%"
              height="400"
              viewBox="0 0 500 400"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4, 5, 6].map((level) => {
                const y = height - padding - (level / maxValue) * chartHeight;
                return (
                  <g key={level}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke={THEME_COLORS.border}
                      strokeWidth="0.5"
                    />
                    <text
                      x={padding - 25}
                      y={y + 4}
                      textAnchor="end"
                      className="text-sm fill-gray-500"
                    >
                      {level}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {data.map((item, index) => {
                const barWidth = (width - padding - 20) / data.length - 20;
                const x =
                  padding + (index * (width - padding - 20)) / data.length + 10;
                const barHeight = (item.score / maxValue) * chartHeight;
                const y = chartHeight - barHeight + padding;

                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="#2C9AEF"
                      rx="2"
                      className="hover:opacity-80 cursor-pointer"
                    >
                      <title>{`${item.name}: ${item.score.toFixed(1)}`}</title>
                    </rect>
                    {/* Value label on top of bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700"
                    >
                      {item.score.toFixed(1)}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={height - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      style={{ fontSize: "10px" }}
                    >
                      {item.name.length > 8
                        ? item.name.substring(0, 7) + "..."
                        : item.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const RadarChart = ({
    data,
    title,
  }: {
    data: typeof metricsData;
    title: string;
  }) => {
    const size = 350;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 120;
    const maxValue = 100; // ポジティブ割合なので100%まで

    const angleStep = (2 * Math.PI) / data.length;

    const points = data.map((item, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = item.positiveRate / maxValue;
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      return { x, y, angle, label: item.name, value: item.positiveRate };
    });

    const pathData =
      points
        .map(
          (point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ") + " Z";

    return (
      <div
        className="bg-white rounded-lg shadow-sm border p-6"
        style={{ borderColor: THEME_COLORS.border }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-sm">
            <svg
              width="100%"
              height="350"
              viewBox="0 0 350 350"
              preserveAspectRatio="xMidYMid meet"
              className="overflow-visible w-full h-auto"
            >
              {/* Background grid circles */}
              {[20, 40, 60, 80, 100].map((percentage) => (
                <circle
                  key={percentage}
                  cx={centerX}
                  cy={centerY}
                  r={(radius * percentage) / 100}
                  fill="none"
                  stroke={THEME_COLORS.border}
                  strokeWidth="1"
                />
              ))}

              {/* Grid lines */}
              {data.map((_, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const x2 = centerX + Math.cos(angle) * radius;
                const y2 = centerY + Math.sin(angle) * radius;
                return (
                  <line
                    key={index}
                    x1={centerX}
                    y1={centerY}
                    x2={x2}
                    y2={y2}
                    stroke={THEME_COLORS.border}
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data area */}
              <path
                d={pathData}
                fill="#71D3D8"
                fillOpacity="0.3"
                stroke="#71D3D8"
                strokeWidth="2"
              />

              {/* Data points */}
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#71D3D8"
                />
              ))}

              {/* Labels */}
              {points.map((point, index) => {
                const labelRadius = radius + 50;
                const angle = index * angleStep - Math.PI / 2;
                const labelX = centerX + Math.cos(angle) * labelRadius;
                const labelY = centerY + Math.sin(angle) * labelRadius;

                return (
                  <text
                    key={index}
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-gray-600"
                    style={{ fontSize: "10px" }}
                  >
                    <tspan x={labelX} dy="-0.7em" style={{ fontSize: "11px" }}>
                      {point.label.length > 8
                        ? point.label.substring(0, 7) + "..."
                        : point.label}
                    </tspan>
                    <tspan
                      x={labelX}
                      dy="1.4em"
                      className="font-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      {point.value.toFixed(1)}%
                    </tspan>
                  </text>
                );
              })}

              {/* Percentage labels on grid */}
              {[20, 40, 60, 80, 100].map((percentage) => (
                <text
                  key={percentage}
                  x={centerX + 5}
                  y={centerY - (radius * percentage) / 100}
                  className="text-xs fill-gray-400"
                  style={{ fontSize: "9px" }}
                >
                  {percentage}%
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const DataTable = ({ data }: { data: typeof metricsData }) => (
    <div
      className="bg-white rounded-lg shadow-sm border overflow-x-auto"
      style={{ borderColor: THEME_COLORS.border }}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
            指標別データ
          </h2>
          <div className="text-sm text-gray-600">
            実施日:{" "}
            {selectedPeriod === "2024-04-01"
              ? "2024年4月1日"
              : selectedPeriod === "2024-03-01"
              ? "2024年3月1日"
              : "2024年2月1日"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: THEME_COLORS.border }}
              >
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  指標
                </th>
                {data.map((metric) => (
                  <th
                    key={metric.name}
                    className="text-center py-3 px-2 font-medium text-gray-900 min-w-[120px]"
                  >
                    <div className="text-xs whitespace-nowrap">
                      <span className="hidden lg:inline">{metric.name}</span>
                      <span className="lg:hidden">
                        {metric.name.length > 8
                          ? metric.name.substring(0, 7) + "..."
                          : metric.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr
                className="border-b"
                style={{ borderColor: THEME_COLORS.border }}
              >
                <td className="py-3 px-4 font-medium text-gray-700">スコア</td>
                {data.map((metric) => (
                  <td key={metric.name} className="text-center py-3 px-2">
                    <span className="font-semibold text-blue-600">
                      {metric.score.toFixed(1)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  ポジティブ割合
                </td>
                {data.map((metric) => (
                  <td key={metric.name} className="text-center py-3 px-2">
                    <span
                      className="font-semibold"
                      style={{ color: "#71D3D8" }}
                    >
                      {metric.positiveRate.toFixed(1)}%
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">サマリレポート</h1>
        </div>
        <div className="mt-3 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderColor: THEME_COLORS.border }}
          >
            <option value="2024-04-01">2024年4月1日</option>
            <option value="2024-03-01">2024年3月1日</option>
            <option value="2024-02-01">2024年2月1日</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={metricsData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart data={metricsData} title="スコア" />
        <RadarChart data={metricsData} title="ポジティブ割合" />
      </div>
    </div>
  );
};

export default SummaryReport;
