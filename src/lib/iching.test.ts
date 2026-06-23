import { describe, expect, it } from "vitest";
import {
  buildReading,
  changingLines,
  hexagramKeyFromLines,
  lineFromCoins,
  tossCoins,
  trigramFromLines,
} from "./iching";
import { HEXAGRAMS } from "../data/hexagrams";

describe("六爻金钱卦计算", () => {
  it("creates a deterministic three-coin toss when a random source is supplied", () => {
    const values = [0.1, 0.7, 0.2];

    expect(tossCoins(() => values.shift() ?? 0)).toEqual([
      "front",
      "back",
      "front",
    ]);
  });

  it("maps three coin faces to the traditional yao value", () => {
    expect(lineFromCoins(["back", "back", "back"])).toMatchObject({
      value: 9,
      kind: "old-yang",
      isYang: true,
      changing: true,
    });

    expect(lineFromCoins(["back", "back", "front"])).toMatchObject({
      value: 8,
      kind: "young-yin",
      isYang: false,
      changing: false,
    });

    expect(lineFromCoins(["front", "front", "back"])).toMatchObject({
      value: 7,
      kind: "young-yang",
      isYang: true,
      changing: false,
    });

    expect(lineFromCoins(["front", "front", "front"])).toMatchObject({
      value: 6,
      kind: "old-yin",
      isYang: false,
      changing: true,
    });
  });

  it("keeps hexagram keys in bottom-to-top line order", () => {
    const lines = [
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
    ];

    expect(hexagramKeyFromLines(lines)).toBe("101010");
  });

  it("resolves trigrams from three bottom-to-top lines", () => {
    expect(trigramFromLines([true, true, true])).toMatchObject({
      key: "111",
      name: "乾",
      nature: "天",
    });
    expect(trigramFromLines([false, false, false])).toMatchObject({
      key: "000",
      name: "坤",
      nature: "地",
    });
    expect(trigramFromLines([true, false, false])).toMatchObject({
      key: "100",
      name: "震",
      nature: "雷",
    });
  });

  it("identifies changing lines by one-based position from the bottom", () => {
    const lines = [
      lineFromCoins(["front", "front", "front"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
      lineFromCoins(["back", "back", "back"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
    ];

    expect(changingLines(lines)).toEqual([1, 4]);
  });

  it("builds original and changed hexagram summaries", () => {
    const lines = [
      lineFromCoins(["back", "back", "back"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["front", "front", "back"]),
      lineFromCoins(["back", "back", "front"]),
      lineFromCoins(["back", "back", "front"]),
      lineFromCoins(["back", "back", "front"]),
    ];

    const reading = buildReading(lines);

    expect(reading.original.key).toBe("111000");
    expect(reading.original.name).toBe("地天泰");
    expect(reading.changed.key).toBe("011000");
    expect(reading.changed.name).toBe("地风升");
    expect(reading.movingLines).toEqual([1]);
    expect(reading.lowerTrigram.name).toBe("乾");
    expect(reading.upperTrigram.name).toBe("坤");
  });

  it("covers all 64 hexagram combinations with reading copy", () => {
    const allKeys = Array.from({ length: 64 }, (_, index) =>
      index.toString(2).padStart(6, "0"),
    );

    expect(Object.keys(HEXAGRAMS).sort()).toEqual(allKeys);

    for (const key of allKeys) {
      expect(HEXAGRAMS[key]).toMatchObject({
        key,
        name: expect.any(String),
        judgment: expect.any(String),
        image: expect.any(String),
        advice: expect.any(String),
      });
    }
  });
});
