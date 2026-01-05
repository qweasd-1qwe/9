import {Transaction} from '../services/notificationParser';

export const defaultCategories = [
  '餐饮',
  '购物',
  '交通',
  '娱乐',
  '住房',
  '红包',
  '转账',
  '其他',
];

// Very small rule-based classifier based on keywords.
export function classifyTransaction(tx: Transaction | {desc: string; amount: number}) {
  const desc = tx.desc || '';
  const lower = desc.toLowerCase();
  if (/(餐|饭|午餐|晚餐|夜宵|食)/.test(desc)) return '餐饮';
  if (/(地铁|公交|滴滴|出行|车票|交通|加油)/.test(desc)) return '交通';
  if (/(淘宝|京东|拼多多|购物|买|下单)/.test(desc)) return '购物';
  if (/(电影|影院|游戏|娱乐|KTV)/.test(desc)) return '娱乐';
  if (/(房租|房屋|住宿|酒店)/.test(desc)) return '住房';
  if (/(红包|发出红包|领取红包)/.test(desc)) return '红包';
  if (/(转账|转入|转出|代付)/.test(desc)) return '转账';
  // fallback by amount heuristics
  if (tx.amount > 1000) return '其他';
  return '其他';
}



