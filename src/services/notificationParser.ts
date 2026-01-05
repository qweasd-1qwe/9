export type Transaction = {
  id: string;
  date: string;
  desc: string;
  amount: number;
  vendor?: string;
  raw?: string;
  category?: string;
  isExpense?: boolean;
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// Very small heuristic parser for common Chinese notification patterns.
export function parseNotification(text: string): Transaction | null {
  const raw = text;
  // Examples: "微信支付 支出 ¥45.20 商户：某某餐厅"
  // "收到转账 ¥100.00 来自 张三"
  const payRegex = /(?:支付|支出)\s*[¥￥]?\s*([0-9]+(?:\.[0-9]{1,2})?)/;
  const receiveRegex = /收到(?:转账|红包)\s*[¥￥]?\s*([0-9]+(?:\.[0-9]{1,2})?)/;
  const vendorRegex = /商户[:：\s]*([^\s,，]+)/;

  let amount = 0;
  let isExpense = true;

  const payMatch = text.match(payRegex);
  const receiveMatch = text.match(receiveRegex);

  if (payMatch) {
    amount = parseFloat(payMatch[1]);
    isExpense = true;
  } else if (receiveMatch) {
    amount = parseFloat(receiveMatch[1]);
    isExpense = false;
  } else {
    // try to find any currency-like number
    const generic = text.match(/([¥￥]?\s*[0-9]+(?:\.[0-9]{1,2})?)/);
    if (generic) {
      amount = parseFloat(generic[1].replace(/[¥￥\s]/g, ''));
    } else {
      return null;
    }
  }

  const vendorMatch = text.match(vendorRegex);
  const vendor = vendorMatch ? vendorMatch[1] : undefined;

  const tx = {
    id: genId(),
    date: new Date().toISOString().slice(0, 10),
    desc: vendor ? vendor : text.slice(0, 40),
    amount,
    vendor,
    raw,
    category: undefined,
    isExpense,
  };
  return tx;
}



