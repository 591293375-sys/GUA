import { BookOpen, ScrollText } from "lucide-react";
import type { Reading } from "../lib/iching";
import {
  createAspectReadings,
  hexagramPairTitle,
} from "../lib/readingDetails";

const lineNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

interface ReadingPanelProps {
  question: string;
  reading: Reading | null;
}

export function ReadingPanel({ question, reading }: ReadingPanelProps) {
  if (!reading) {
    return (
      <section className="reading-panel is-empty" aria-label="卦辞解析">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">卦辞解析</p>
            <h2>六爻齐备后启读</h2>
          </div>
          <ScrollText size={22} aria-hidden="true" />
        </div>
        <p>
          请先完成六次金钱起卦。完成后，这里会生成本卦、变卦、动爻重点和现代白话解析。
        </p>
      </section>
    );
  }

  const movingText =
    reading.movingLines.length > 0
      ? reading.movingLines.map((line) => lineNames[line - 1]).join("、")
      : "无动爻";
  const aspectReadings = createAspectReadings(reading);

  return (
    <section className="reading-panel" aria-label="卦辞解析">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">卦辞解析</p>
          <h2>
            {hexagramPairTitle(reading)}
          </h2>
        </div>
        <BookOpen size={22} aria-hidden="true" />
      </div>

      <div className="question-summary">
        <span>所问</span>
        <p>{question.trim() || "未填写具体问题，以当前所念之事为问。"}</p>
      </div>

      <div className="interpretation-grid">
        <article>
          <span>本卦卦辞</span>
          <h3>{reading.original.name}</h3>
          <p>{reading.original.judgment}</p>
        </article>
        <article>
          <span>象意</span>
          <h3>
            {reading.upperTrigram.name}上 {reading.lowerTrigram.name}下
          </h3>
          <p>{reading.original.image}</p>
        </article>
        <article>
          <span>变卦</span>
          <h3>{reading.changed.name}</h3>
          <p>{reading.changed.advice}</p>
        </article>
        <article>
          <span>动爻重点</span>
          <h3>{movingText}</h3>
          <p>
            {reading.movingLines.length === 0
              ? "此卦无动爻，以本卦卦辞与整体象意为主，表示局势较稳，宜守中正。"
              : reading.movingLines.length === 1
                ? `重点观察${movingText}所处的位置：其变化是此事的关键转折。`
                : `共有${movingText}发动，表示局势变化较多，应同时看本卦的根本处境与变卦的后续走向。`}
          </p>
        </article>
      </div>

      <div className="aspect-reading-list">
        {aspectReadings.map((aspect) => (
          <article className="aspect-reading" key={aspect.title}>
            <span>{aspect.title}</span>
            <h3>{aspect.focus}</h3>
            <p>{aspect.detail}</p>
          </article>
        ))}
      </div>

      <div className="modern-reading">
        <span>参考边界</span>
        <p>
          此结果用于传统文化体验和自我反思，不替代现实中的法律、医疗、投资或重大人生决策。
        </p>
      </div>
    </section>
  );
}
