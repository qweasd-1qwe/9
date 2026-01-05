import React from 'react';
import {SafeAreaView, Text, View, Button, StyleSheet, FlatList, NativeEventEmitter, NativeModules} from 'react-native';
import {parseNotification} from './services/notificationParser';
import {parseCsvString} from './services/csvImporter';
import {EncryptedDB, Transaction} from './storage/EncryptedDB';
import {classifyTransaction} from './utils/categories';

const db = new EncryptedDB();
const { NotificationReceiver } = NativeModules;
const notificationEmitter = NotificationReceiver ? new NativeEventEmitter(NotificationReceiver) : null;

export default function App() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [nativeNotifications, setNativeNotifications] = React.useState<string[]>([]);

  const handleSampleNotification = () => {
    const sample = '微信支付 支出 ¥45.20 商户：某某餐厅';
    const tx = parseNotification(sample);
    if (tx) {
      tx.category = classifyTransaction(tx);
      db.addTransaction(tx);
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const handleSampleCsv = async () => {
    const csv = 'date,desc,amount\n2025-08-29,支付宝-购买,89.50';
    const parsed = await parseCsvString(csv);
    for (const p of parsed) {
      p.category = classifyTransaction(p);
      await db.addTransaction(p);
    }
    setTransactions(await db.getAllTransactions());
  };

  React.useEffect(() => {
    if (!notificationEmitter) return;
    const subscription = notificationEmitter.addListener('NotificationReceived', async (payload: string) => {
      try {
        setNativeNotifications(prev => [payload, ...prev].slice(0, 50));
        const tx = parseNotification(payload);
        if (tx) {
          tx.category = classifyTransaction(tx);
          await db.addTransaction(tx);
          setTransactions(prev => [tx, ...prev]);
        }
      } catch (e) {
        console.warn('Error handling notification payload', e);
      }
    });
    return () => {
      try {
        subscription.remove();
      } catch {}
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>钱包账单（Android）- 开发雏形</Text>
      <View style={styles.controls}>
        <Button title="解析示例通知" onPress={handleSampleNotification} />
        <Button title="导入示例 CSV" onPress={handleSampleCsv} />
      </View>
      {nativeNotifications.length > 0 && (
        <View style={{marginBottom: 12}}>
          <Text style={{fontWeight: '600'}}>最近接收的通知（原始文本）</Text>
          <FlatList
            data={nativeNotifications}
            keyExtractor={(item, index) => `n-${index}`}
            renderItem={({item}) => <Text style={{fontSize: 12, color: '#333'}}>{item}</Text>}
          />
        </View>
      )}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text>{item.date} • {item.desc}</Text>
            <Text>{item.amount.toFixed(2)} ¥ • {item.category}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 18, fontWeight: '600', marginBottom: 12},
  controls: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},
  row: {paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee'},
});



