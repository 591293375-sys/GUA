import type { Reading } from "./iching";

export interface AspectReading {
  title: "事业" | "财运" | "家庭" | "姻缘" | "行动建议";
  focus: string;
  detail: string;
}

const lineNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

export function hexagramPairTitle(reading: Reading): string {
  if (reading.original.key === reading.changed.key) {
    return `${reading.original.name}（无变卦）`;
  }

  return `${reading.original.name} 之 ${reading.changed.name}`;
}

export function createAspectReadings(reading: Reading): AspectReading[] {
  const moving = movingLinePhrase(reading);
  const transition =
    reading.original.key === reading.changed.key
      ? `此卦无动爻，后势仍以${reading.original.name}的本象为主，宜守中见机。`
      : `动爻发动后转入${reading.changed.name}，后续要参考“${reading.changed.advice}”这条线索。`;

  return [
    {
      title: "事业",
      focus: "推进节奏与合作边界",
      detail: `${reading.original.name}在事业上先看局势是否通畅：${reading.original.judgment}。当前上下卦为${reading.upperTrigram.name}上${reading.lowerTrigram.name}下，说明外部环境与内部执行之间要先校准。${moving}。${transition} 若问项目、职位或合作，宜先把责任、流程、资源和关键人态度理顺，再决定是否扩张或强推。`,
    },
    {
      title: "财运",
      focus: "现金流、投入与风险",
      detail: `${reading.original.name}看财运，不宜只看收益高低，而要看资金流动是否顺。${reading.original.image} 因此近期更适合审视成本、合同、回款和承诺兑现。${moving}。${transition} 若有投资、借贷或大额支出，应保留余地，先求稳健现金流，再谈增长。`,
    },
    {
      title: "家庭",
      focus: "沟通、责任与内部秩序",
      detail: `${reading.original.name}落在家庭关系中，重点是家中气机是否相通。${reading.original.advice} 家庭事务不宜只争对错，应先分清谁在承担、谁在回避、哪些旧问题反复出现。${moving}。若能把话说清、把责任落地，变卦${reading.changed.name}所示的后续才有转圜空间。`,
    },
    {
      title: "姻缘",
      focus: "情感互动与长期契合",
      detail: `${reading.original.name}问姻缘，先看双方是否同频、是否愿意真实沟通。卦象提示“${reading.original.judgment}”，感情中不可只凭一时情绪判断。${moving}。${transition} 单身者宜慢看人品与稳定性；已有关系者宜减少冷处理，把误会、期待和边界摊开谈。`,
    },
    {
      title: "行动建议",
      focus: "下一步怎么做",
      detail: `${reading.original.name}给出的行动要点是：${reading.original.advice} ${transition} 近期可先做三件事：确认事实，减少不必要承诺，选择一个最能改变局势的小动作。若动爻较多，说明变化正在发生，行动要分阶段验证，不宜一次押上全部资源。`,
    },
  ];
}

function movingLinePhrase(reading: Reading): string {
  if (reading.movingLines.length === 0) {
    return "本卦无动爻，表示局势暂时较稳，宜重视本卦本身的处境与提醒";
  }

  const names = reading.movingLines.map((line) => lineNames[line - 1]).join("、");

  if (reading.movingLines.length === 1) {
    return `${names}发动，表示关键变化集中在这一处，宜抓住主要矛盾`;
  }

  return `${names}发动，表示局势牵动多处，宜同时看当前处境与后续变卦`;
}

