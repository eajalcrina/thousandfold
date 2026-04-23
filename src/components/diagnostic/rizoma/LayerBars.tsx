"use client";

import { motion } from "motion/react";
import { LAYERS, LAYER_META, type Layer } from "@/lib/rizoma-data";

interface Props {
  layerScores: Record<Layer, number>;
}

export default function LayerBars({ layerScores }: Props) {
  return (
    <div className="space-y-4">
      {LAYERS.map((layer, i) => {
        const meta = LAYER_META[layer];
        const score = layerScores[layer];
        return (
          <div key={layer}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-cream">{meta.label}</span>
              <span className="font-mono text-xs text-cream/45">{score}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-wire">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: meta.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
