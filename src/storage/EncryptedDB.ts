import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = 'wallet_transactions_v1';

// Simple encrypted DB placeholder: currently uses AsyncStorage; replace with
// a real encrypted SQLite / Realm implementation in production.
export class EncryptedDB {
  async addTransaction(tx: Transaction): Promise<void> {
    const all = await this.getAllTransactions();
    all.unshift(tx);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Transaction[];
    } catch {
      return [];
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}



