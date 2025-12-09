// app/(admin)/dashboard.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back, Admin</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>1,284</Text>
          <Text style={styles.cardLabel}>Active Clients</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>8</Text>
          <Text style={styles.cardLabel}>Running Scrapers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>99.9%</Text>
          <Text style={styles.cardLabel}>Uptime</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>42.1 GB</Text>
          <Text style={styles.cardLabel}>Data Collected</Text>
        </View>
      </View>

      <View style={styles.recent}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.placeholder}>No recent logs...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32 },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 40 },
  card: {
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 16,
    width: 280,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#00d4ff' },
  cardLabel: { fontSize: 14, color: '#888', marginTop: 8 },
  recent: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  placeholder: { color: '#666', fontStyle: 'italic' },
});