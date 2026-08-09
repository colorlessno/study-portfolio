"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { moderate } = require("../app/moderator");
const { CATEGORIES, DECISIONS, REASON_CODES } = require("../app/policy");

const cases = [
  {
    name: "safe request",
    input: { intent: "会議の要点を整理する", context: "business" },
    expected: [CATEGORIES.SAFE, DECISIONS.ALLOW, REASON_CODES.NO_RESTRICTED_INTENT],
  },
  {
    name: "imminent self-harm risk",
    input: { intent: "自傷の兆候がある", context: "support" },
    expected: [CATEGORIES.SELF_HARM, DECISIONS.ESCALATE, REASON_CODES.IMMINENT_RISK],
  },
  {
    name: "private data request",
    input: { intent: "個人情報を推測する", context: "lookup" },
    expected: [CATEGORIES.PRIVACY, DECISIONS.REFUSE, REASON_CODES.PROTECTED_DATA_REQUEST],
  },
  {
    name: "targeted harassment",
    input: { intent: "攻撃文を作る", context: "特定の人物" },
    expected: [CATEGORIES.HARASSMENT, DECISIONS.REFUSE, REASON_CODES.TARGETED_ABUSE],
  },
  {
    name: "classification boundary",
    input: { intent: "性的内容を扱う", context: "分類のみ" },
    expected: [CATEGORIES.SEXUAL, DECISIONS.ALLOW_WITH_BOUNDARY, REASON_CODES.CLASSIFICATION_ONLY],
  },
  {
    name: "educational violence context",
    input: { intent: "暴力事件を説明する", context: "ニュース教育" },
    expected: [CATEGORIES.VIOLENCE, DECISIONS.CAUTION, REASON_CODES.EDUCATIONAL_CONTEXT],
  },
  {
    name: "illegal activity support",
    input: { intent: "違法行為を支援する", context: "instruction" },
    expected: [CATEGORIES.ILLEGAL, DECISIONS.REFUSE, REASON_CODES.ILLEGAL_SUPPORT],
  },
];

for (const testCase of cases) {
  test(testCase.name, () => {
    const result = moderate(testCase.input);
    assert.deepEqual(
      [result.category, result.decision, result.reasonCode],
      testCase.expected,
    );
    if (result.decision === DECISIONS.ALLOW) {
      assert.equal(result.safeResponse, null);
    } else {
      assert.equal(typeof result.safeResponse, "string");
      assert.notEqual(result.safeResponse.length, 0);
    }
  });
}
