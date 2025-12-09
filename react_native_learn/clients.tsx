import { StyleSheet, Text, View } from 'react-native';

export default function ClientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clients</Text>
      <Text style={styles.subtitle}>Manage registered clients and their access</Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Client list coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#0f0f1e' },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
  placeholder: {
    backgroundColor: '#1a1a2e',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  placeholderText: { color: '#00d4ff', fontSize: 18, fontWeight: '600' },
});