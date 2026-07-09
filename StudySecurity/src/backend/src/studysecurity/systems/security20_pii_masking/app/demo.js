const { maskPii } = require("./masker");

const sample = "連絡先は demo@example.com、電話は03-1234-5678、顧客IDはCUST-12345です。";
console.log(maskPii(sample));
