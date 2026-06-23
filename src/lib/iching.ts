import { HEXAGRAMS, type HexagramInfo } from "../data/hexagrams";

export type CoinFace = "front" | "back";

export type YaoKind = "old-yin" | "young-yang" | "young-yin" | "old-yang";

export interface YaoLine {
  coins: [CoinFace, CoinFace, CoinFace];
  value: 6 | 7 | 8 | 9;
  kind: YaoKind;
  isYang: boolean;
  changing: boolean;
}

export interface Trigram {
  key: string;
  name: string;
  nature: string;
}

export interface HexagramSummary extends HexagramInfo {}

export interface Reading {
  lines: YaoLine[];
  original: HexagramSummary;
  changed: HexagramSummary;
  lowerTrigram: Trigram;
  upperTrigram: Trigram;
  changedLowerTrigram: Trigram;
  changedUpperTrigram: Trigram;
  movingLines: number[];
}

export function tossCoins(random: () => number = Math.random): [
  CoinFace,
  CoinFace,
  CoinFace,
] {
  return [0, 1, 2].map(() => (random() >= 0.5 ? "back" : "front")) as [
    CoinFace,
    CoinFace,
    CoinFace,
  ];
}

const TRIGRAMS: Record<string, Trigram> = {
  "111": { key: "111", name: "乾", nature: "天" },
  "110": { key: "110", name: "兑", nature: "泽" },
  "101": { key: "101", name: "离", nature: "火" },
  "100": { key: "100", name: "震", nature: "雷" },
  "011": { key: "011", name: "巽", nature: "风" },
  "010": { key: "010", name: "坎", nature: "水" },
  "001": { key: "001", name: "艮", nature: "山" },
  "000": { key: "000", name: "坤", nature: "地" },
};

export function lineFromCoins(coins: CoinFace[]): YaoLine {
  if (coins.length !== 3) {
    throw new Error("起卦必须使用三枚铜钱。");
  }

  const value = coins.reduce((sum, face) => sum + (face === "back" ? 3 : 2), 0);

  if (value === 9) {
    return {
      coins: coins as [CoinFace, CoinFace, CoinFace],
      value,
      kind: "old-yang",
      isYang: true,
      changing: true,
    };
  }

  if (value === 8) {
    return {
      coins: coins as [CoinFace, CoinFace, CoinFace],
      value,
      kind: "young-yin",
      isYang: false,
      changing: false,
    };
  }

  if (value === 7) {
    return {
      coins: coins as [CoinFace, CoinFace, CoinFace],
      value,
      kind: "young-yang",
      isYang: true,
      changing: false,
    };
  }

  return {
    coins: coins as [CoinFace, CoinFace, CoinFace],
    value: 6,
    kind: "old-yin",
    isYang: false,
    changing: true,
  };
}

export function hexagramKeyFromLines(lines: Pick<YaoLine, "isYang">[]): string {
  requireSixLines(lines);
  return lines.map((line) => (line.isYang ? "1" : "0")).join("");
}

export function trigramFromLines(lines: boolean[]): Trigram {
  if (lines.length !== 3) {
    throw new Error("三爻才能组成一卦。");
  }

  const key = lines.map((isYang) => (isYang ? "1" : "0")).join("");
  const trigram = TRIGRAMS[key];

  if (!trigram) {
    throw new Error(`未知三爻组合：${key}`);
  }

  return trigram;
}

export function changingLines(lines: Pick<YaoLine, "changing">[]): number[] {
  return lines
    .map((line, index) => (line.changing ? index + 1 : null))
    .filter((lineNumber): lineNumber is number => lineNumber !== null);
}

export function buildReading(lines: YaoLine[]): Reading {
  requireSixLines(lines);

  const changedLines = lines.map((line) => ({
    ...line,
    isYang: line.changing ? !line.isYang : line.isYang,
  }));

  return {
    lines,
    original: hexagramFromKey(hexagramKeyFromLines(lines)),
    changed: hexagramFromKey(hexagramKeyFromLines(changedLines)),
    lowerTrigram: trigramFromLines(lines.slice(0, 3).map((line) => line.isYang)),
    upperTrigram: trigramFromLines(lines.slice(3, 6).map((line) => line.isYang)),
    changedLowerTrigram: trigramFromLines(
      changedLines.slice(0, 3).map((line) => line.isYang),
    ),
    changedUpperTrigram: trigramFromLines(
      changedLines.slice(3, 6).map((line) => line.isYang),
    ),
    movingLines: changingLines(lines),
  };
}

function hexagramFromKey(key: string): HexagramInfo {
  const hexagram = HEXAGRAMS[key];

  if (!hexagram) {
    throw new Error(`未知六爻组合：${key}`);
  }

  return hexagram;
}

function requireSixLines(lines: unknown[]): void {
  if (lines.length !== 6) {
    throw new Error("完整六爻卦必须包含六条爻。");
  }
}
