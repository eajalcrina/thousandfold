"use client";

import {
  Radar, RadarChart as RC, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { LAYERS, LAYER_META, type Layer } from "@/lib/rizoma-data";

interface Props {
  layerScores: Record<Layer, number>;
}

export default function RadarChart({ layerScores }: Props) {
  const data = LAYERS.map((l) => ({
    layer: LAYER_META[l].label,
    score: layerScores[l],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RC data={data} outerRadius="75%">
          <PolarGrid stroke="rgba(245,240,232,0.15)" />
          <PolarAngleAxis
            dataKey="layer"
            tick={{ fill: "rgba(245,240,232,0.7)", fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(245,240,232,0.3)", fontSize: 10 }}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#EF4129"
            fill="#EF4129"
            fillOpacity={0.18}
            strokeWidth={1.5}
            isAnimationActive
          />
        </RC>
      </ResponsiveContainer>
    </div>
  );
}
