import React, { useState, useEffect, useCallback } from 'react';

interface GuideStep {
  selector: string;
  title: string;
  desc: string;
  position: 'top' | 'bottom';
  padding?: number;
}

const STEPS: GuideStep[] = [
  {
    selector: '[data-guide="agent-zone"]',
    title: '智能体广场',
    desc: '这里汇集了所有AI助手，按分类浏览或左右滑动卡片，点击即可开始对话，获取专属旅行服务。',
    position: 'top',
    padding: 6,
  },
  {
    selector: '[data-guide="input"]',
    title: '任务入口',
    desc: '点击后可在任务广场选择给黄小西的任务，或直接输入问题，开始智能对话。',
    position: 'top',
    padding: 6,
  },
  {
    selector: '[data-guide="nav-mine"]',
    title: '我的',
    desc: '在这里可以申领龙虾🦞、创建自己的智能体，管理你的专属AI助手。',
    position: 'top',
    padding: 6,
  },
];

export default function OnboardingGuide({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pad = current.padding ?? 4;

  const measure = useCallback(() => {
    const el = document.querySelector(current.selector);
    const container = document.querySelector('[data-guide-container]');
    if (el && container) {
      setRect(el.getBoundingClientRect());
      setContainerRect(container.getBoundingClientRect());
    }
  }, [current.selector]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLast) onFinish();
    else setStep(step + 1);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFinish();
  };

  if (!rect || !containerRect) return null;

  const spotTop = rect.top - containerRect.top - pad;
  const spotLeft = rect.left - containerRect.left - pad;
  const spotWidth = rect.width + pad * 2;
  const spotHeight = rect.height + pad * 2;

  const textBelow = current.position === 'bottom';
  let textStyle: React.CSSProperties;

  if (textBelow) {
    textStyle = { top: spotTop + spotHeight + 32, left: 16, right: 16 };
  } else {
    textStyle = { bottom: containerRect.height - spotTop + 32, left: 16, right: 16 };
  }

  const spotCenterX = spotLeft + spotWidth / 2;
  const containerW = containerRect.width;
  const textCenterX = containerW / 2;

  let arrowSvg: React.ReactNode;
  let arrowContainerStyle: React.CSSProperties;

  if (textBelow) {
    const startY = spotTop + spotHeight + 30;
    const endY = spotTop + spotHeight + 4;
    const h = startY - endY;
    const w = Math.abs(textCenterX - spotCenterX) + 40;
    const left = Math.min(textCenterX, spotCenterX) - 20;
    const sx = textCenterX - left;
    const ey = 6;
    const sy = h;
    const ex = spotCenterX - left;
    const cp1x = sx;
    const cp1y = sy - h * 0.55;
    const cp2x = ex;
    const cp2y = ey + h * 0.35;

    arrowContainerStyle = { position: 'absolute', left, top: endY, width: w, height: h + 8, zIndex: 10002, pointerEvents: 'none' as const };
    arrowSvg = (
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} fill="none">
        <path d={`M${sx},${sy} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
        <polygon points={`${ex},0 ${ex - 5},${ey + 4} ${ex + 5},${ey + 4}`} fill="white" />
      </svg>
    );
  } else {
    const startY = containerRect.height - (containerRect.height - spotTop + 30);
    const endY = spotTop - 4;
    const h = endY - startY;
    const w = Math.abs(textCenterX - spotCenterX) + 40;
    const left = Math.min(textCenterX, spotCenterX) - 20;
    const sx = textCenterX - left;
    const sy = 0;
    const ex = spotCenterX - left;
    const ey = h;
    const cp1x = sx;
    const cp1y = h * 0.45;
    const cp2x = ex;
    const cp2y = h * 0.55;

    arrowContainerStyle = { position: 'absolute', left, top: startY, width: w, height: h + 8, zIndex: 10002, pointerEvents: 'none' as const };
    arrowSvg = (
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} fill="none">
        <path d={`M${sx},${sy} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
        <polygon points={`${ex},${ey + 8} ${ex - 5},${ey - 1} ${ex + 5},${ey - 1}`} fill="white" />
      </svg>
    );
  }

  return (
    <div
      className="absolute inset-0 z-[10000]"
      onClick={handleNext}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: spotTop,
          left: spotLeft,
          width: spotWidth,
          height: spotHeight,
          borderRadius: 16,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.72)',
          border: '2px solid rgba(255,255,255,0.55)',
          zIndex: 10001,
        }}
      />

      {/* 趣味弯曲箭头 */}
      <div style={arrowContainerStyle}>{arrowSvg}</div>

      {/* 文字说明 */}
      <div className="absolute" style={{ ...textStyle, zIndex: 10002 }}>
        <div className="max-w-[320px] mx-auto text-center">
          <p className="text-white text-[15px] font-bold leading-7" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{current.desc}</p>
          <div className="flex items-center justify-center gap-5 mt-4">
            <span className="text-white/55 text-[13px]">{step + 1}/{STEPS.length}</span>
            <button
              onClick={handleNext}
              className="text-white text-[13px] font-bold border border-white/60 px-5 py-2 rounded-full backdrop-blur-sm"
            >
              {isLast ? '开始体验' : '下一步'}
            </button>
            <button onClick={handleSkip} className="text-white/55 text-[13px]">跳过</button>
          </div>
        </div>
      </div>
    </div>
  );
}
