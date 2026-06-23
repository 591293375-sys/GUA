import { describe, expect, it } from "vitest";
import {
  createAspectReadings,
  hexagramPairTitle,
} from "./readingDetails";
import { buildReading, lineFromCoins } from "./iching";

function sampleChangingReading() {
  return buildReading([
    lineFromCoins(["front", "front", "front"]),
    lineFromCoins(["back", "back", "front"]),
    lineFromCoins(["back", "back", "front"]),
    lineFromCoins(["front", "front", "back"]),
    lineFromCoins(["front", "front", "back"]),
    lineFromCoins(["back", "back", "back"]),
  ]);
}

describe("reading detail helpers", () => {
  it("formats original and changed hexagram names together", () => {
    const reading = sampleChangingReading();

    expect(hexagramPairTitle(reading)).toBe("天地否 之 泽雷随");
  });

  it("creates detailed aspect readings for practical life domains", () => {
    const reading = sampleChangingReading();
    const aspects = createAspectReadings(reading);

    expect(aspects.map((aspect) => aspect.title)).toEqual([
      "事业",
      "财运",
      "家庭",
      "姻缘",
      "行动建议",
    ]);

    for (const aspect of aspects) {
      expect(aspect.detail.length).toBeGreaterThan(55);
      expect(aspect.detail).toContain(reading.original.name);
    }
  });
});
