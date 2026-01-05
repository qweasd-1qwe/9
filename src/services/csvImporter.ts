import Papa from 'papaparse';
import {Transaction} from './notificationParser';

// Attempt to parse a CSV string exported by banks/Alipay/WeChat.
export async function parseCsvString(csvText: string): Promise<Transaction[]> {
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const rows = results.data;
        const out: Transaction[] = rows.map((r: Record<string, string>) => {
          // try common column names
          const date = r['date'] || r['交易时间'] || r['时间'] || r['日期'] || new Date().toISOString().slice(0,10);
          const desc = r['desc'] || r['摘要'] || r['交易描述'] || r['对方'] || JSON.stringify(r);
          const amountStr = r['amount'] || r['金额'] || r['交易金额'] || '0';
          const normalized = amountStr.replace(/[¥￥,]/g, '').trim();
          const amount = parseFloat(normalized) || 0;
          return {
            id: Math.random().toString(36).slice(2, 10),
            date,
            desc,
            amount,
            raw: JSON.stringify(r),
            category: undefined,
            isExpense: amount < 0 ? true : true, // default assume expense unless user changes
          } as Transaction;
        });
        resolve(out);
      },
    });
  });
}



