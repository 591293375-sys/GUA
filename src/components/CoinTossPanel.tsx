import { Coins, Copy, Play, RotateCcw } from "lucide-react";
import type { CoinFace, YaoLine } from "../lib/iching";

const lineNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

const lineKindLabels: Record<YaoLine["kind"], string> = {
  "old-yin": "老阴变爻",
  "young-yang": "少阳静爻",
  "young-yin": "少阴静爻",
  "old-yang": "老阳变爻",
};

interface CoinTossPanelProps {
  question: string;
  lines: YaoLine[];
  currentCoins: CoinFace[];
  copyStatus: string;
  onQuestionChange: (value: string) => void;
  onToss: () => void;
  onReset: () => void;
  onCopy: () => void;
}

export function CoinTossPanel({
  question,
  lines,
  currentCoins,
  copyStatus,
  onQuestionChange,
  onToss,
  onReset,
  onCopy,
}: CoinTossPanelProps) {
  const complete = lines.length === 6;
  const nextLineName = complete ? "已成卦" : lineNames[lines.length];

  return (
    <section className="ritual-panel" aria-label="六次金钱起卦">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">三枚铜钱 · 六次成卦</p>
          <h2>静心问事，逐爻而成</h2>
        </div>
        <span className="seal-mark" aria-hidden="true">
          卦
        </span>
      </div>

      <label className="question-field">
        <span>所问之事</span>
        <textarea
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="例如：此项目是否宜在本月推进？"
          rows={4}
        />
      </label>

      <div className="coins-stage" aria-live="polite">
        <div className="stage-caption">
          <Coins size={18} aria-hidden="true" />
          <span>{nextLineName}</span>
        </div>
        <div className="coins-row">
          {[0, 1, 2].map((slot) => {
            const face = currentCoins[slot];
            return (
              <span
                className={`coin ${face ? `coin-${face}` : ""}`}
                key={slot}
                aria-label={face === "back" ? "背" : face === "front" ? "字" : "铜钱"}
              >
                <span className="coin-inscription" aria-hidden="true">
                  {face === "back" ? (
                    <>
                      <b className="coin-top">宝</b>
                      <b className="coin-right">泉</b>
                      <b className="coin-bottom">局</b>
                      <b className="coin-left">背</b>
                    </>
                  ) : (
                    <>
                      <b className="coin-top">乾</b>
                      <b className="coin-right">隆</b>
                      <b className="coin-bottom">通</b>
                      <b className="coin-left">宝</b>
                    </>
                  )}
                </span>
                <span className="coin-hole" aria-hidden="true" />
              </span>
            );
          })}
        </div>
        <p>
          {complete
            ? "六爻已齐，可在右侧查看本卦、变卦与动爻。"
            : `请掷出${nextLineName}，六爻自下而上排列。`}
        </p>
      </div>

      <div className="action-row">
        <button className="primary-button" onClick={onToss} disabled={complete}>
          <Play size={18} aria-hidden="true" />
          {complete ? "已完成" : `掷${nextLineName}`}
        </button>
        <button className="icon-button" onClick={onReset} title="重新起卦">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <button
          className="secondary-button"
          onClick={onCopy}
          disabled={!complete}
          title="复制结果摘要"
        >
          <Copy size={18} aria-hidden="true" />
          {copyStatus}
        </button>
      </div>

      <div className="progress-rail" aria-label="起卦进度">
        {lineNames.map((name, index) => {
          const line = lines[index];
          return (
            <div
              className={`progress-step ${line ? "is-done" : ""} ${
                index === lines.length && !complete ? "is-current" : ""
              }`}
              key={name}
            >
              <span>{name}</span>
              <strong>{line ? lineKindLabels[line.kind] : "待掷"}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
