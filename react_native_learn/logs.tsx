import { Platform, StyleSheet, Text, View } from 'react-native';

export default function LogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Console Logs</Text>
      <Text style={styles.subtitle}>Real-time system and scraper logs</Text>

      <View style={styles.logBox}>
        <Text style={styles.logText}>[14:32:11] System started</Text>
        <Text style={styles.logText}>[14:32:15] Scraper #1 → amazon.com → Success</Text>
        <Text style={styles.logText}>[14:32:18] Client #42 connected</Text>
        <Text style={styles.logText}>[14:32:20] Database sync complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#0f0f1e' },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
  logBox: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
  },
  logText: {
    color: '#4ade80',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    fontSize: 14,
    marginBottom: 8,
  },
});