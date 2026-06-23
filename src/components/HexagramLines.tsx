import type { Reading, YaoLine } from "../lib/iching";
import { hexagramPairTitle } from "../lib/readingDetails";

const lineNames = ["初", "二", "三", "四", "五", "上"];

interface HexagramLinesProps {
  lines: YaoLine[];
  reading: Reading | null;
}

export function HexagramLines({ lines, reading }: HexagramLinesProps) {
  const changedLines =
    reading?.lines.map((line) => ({
      ...line,
      isYang: line.changing ? !line.isYang : line.isYang,
    })) ?? [];

  return (
    <section className="hexagram-panel" aria-label="卦象">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">本卦 · 变卦</p>
          <h2>{reading ? hexagramPairTitle(reading) : "卦象待成"}</h2>
        </div>
        <span className="gua-count">{lines.length}/6</span>
      </div>

      <div className="hexagram-grid">
        <HexagramStack
          title="本卦"
          subtitle={
            reading
              ? `${reading.upperTrigram.nature}上 ${reading.lowerTrigram.nature}下`
              : "自下而上起爻"
          }
          lines={lines}
          showChanging
        />
        <HexagramStack
          title="变卦"
          subtitle={
            reading
              ? `${reading.changedUpperTrigram.nature}上 ${reading.changedLowerTrigram.nature}下`
              : "动爻完成后显现"
          }
          lines={changedLines}
          muted={!reading}
        />
      </div>

      <div className="reading-glance">
        <div>
          <span>动爻</span>
          <strong>
            {reading
              ? reading.movingLines.length > 0
                ? reading.movingLines.map((line) => lineNames[line - 1]).join("、")
                : "无"
              : "待定"}
          </strong>
        </div>
        <div>
          <span>变卦</span>
          <strong>{reading ? reading.changed.name : "待成"}</strong>
        </div>
      </div>
    </section>
  );
}

interface HexagramStackProps {
  title: string;
  subtitle: string;
  lines: YaoLine[];
  showChanging?: boolean;
  muted?: boolean;
}

function HexagramStack({
  title,
  subtitle,
  lines,
  showChanging = false,
  muted = false,
}: HexagramStackProps) {
  const padded = Array.from({ length: 6 }, (_, index) => lines[index] ?? null);

  return (
    <div className={`hexagram-stack ${muted ? "is-muted" : ""}`}>
      <div className="stack-title">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="line-stack">
        {padded
          .map((line, index) => ({ line, index }))
          .reverse()
          .map(({ line, index }) => (
            <div className="yao-row" key={index}>
              <span className="yao-label">{lineNames[index]}</span>
              {line ? (
                <span
                  className={`yao-line ${line.isYang ? "is-yang" : "is-yin"}`}
                >
                  <i />
                  {!line.isYang && <i />}
                </span>
              ) : (
                <span className="yao-line is-empty">
                  <i />
                </span>
              )}
              {showChanging && line?.changing && (
                <span className="moving-dot" aria-label="动爻" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
