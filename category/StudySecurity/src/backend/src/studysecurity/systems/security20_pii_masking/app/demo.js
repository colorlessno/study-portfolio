const assert = require("assert");
const { maskPii } = require("./masker");

const sample = "連絡先は demo@example.com、電話は03-1234-5678、顧客IDはCUST-12345です。";
const masked = maskPii(sample);
assert.strictEqual(masked, "連絡先は [email]、電話は[phone]、顧客IDは[customer-id]です。");
assert.strictEqual(maskPii("個人情報を含まない説明です。"), "個人情報を含まない説明です。");
console.log(masked);
