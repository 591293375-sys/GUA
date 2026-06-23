import { useMemo, useState } from "react";
import { CoinTossPanel } from "./components/CoinTossPanel";
import { HexagramLines } from "./components/HexagramLines";
import { ReadingPanel } from "./components/ReadingPanel";
import {
  buildReading,
  lineFromCoins,
  tossCoins,
  type CoinFace,
  type Reading,
  type YaoLine,
} from "./lib/iching";
import {
  createAspectReadings,
  hexagramPairTitle,
} from "./lib/readingDetails";

function App() {
  const [question, setQuestion] = useState("");
  const [lines, setLines] = useState<YaoLine[]>([]);
  const [currentCoins, setCurrentCoins] = useState<CoinFace[]>([]);
  const [copyStatus, setCopyStatus] = useState("复制");

  const reading = useMemo<Reading | null>(() => {
    if (lines.length !== 6) {
      return null;
    }

    return buildReading(lines);
  }, [lines]);

  function handleToss() {
    if (lines.length >= 6) {
      return;
    }

    const coins = tossCoins();
    const nextLine = lineFromCoins(coins);

    setCurrentCoins(coins);
    setLines((current) => [...current, nextLine]);
    setCopyStatus("复制");
  }

  function handleReset() {
    setLines([]);
    setCurrentCoins([]);
    setCopyStatus("复制");
  }

  async function handleCopy() {
    if (!reading) {
      return;
    }

    const text = createSummary(question, reading);

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("已复制");
    } catch {
      setCopyStatus("复制失败");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          易
        </div>
        <div>
          <h1>六爻金钱卦</h1>
          <p>三钱六掷，自下成卦，观其本变</p>
        </div>
        <span className="topbar-note">文化体验 · 谨慎参考</span>
      </header>

      <main className="workspace">
        <CoinTossPanel
          question={question}
          lines={lines}
          currentCoins={currentCoins}
          copyStatus={copyStatus}
          onQuestionChange={setQuestion}
          onToss={handleToss}
          onReset={handleReset}
          onCopy={handleCopy}
        />
        <div className="right-column">
          <HexagramLines lines={lines} reading={reading} />
          <ReadingPanel question={question} reading={reading} />
        </div>
      </main>
    </div>
  );
}

function createSummary(question: string, reading: Reading): string {
  const moving =
    reading.movingLines.length > 0 ? reading.movingLines.join("、") : "无";

  return [
    "六爻金钱卦结果",
    `所问：${question.trim() || "未填写具体问题"}`,
    `卦象：${hexagramPairTitle(reading)}`,
    `本卦：${reading.original.name}`,
    `变卦：${reading.changed.name}`,
    `动爻：${moving}`,
    `卦辞：${reading.original.judgment}`,
    `象意：${reading.original.image}`,
    `白话参考：${reading.original.advice}`,
    ...createAspectReadings(reading).map(
      (aspect) => `${aspect.title}：${aspect.detail}`,
    ),
  ].join("\n");
}

export default App;
