import { StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Account</Text>
      <Text style={styles.subtitle}>Manage your profile and security</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>admin@listeningtools.app</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Root Admin</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Last Login</Text>
        <Text style={styles.value}>Today at 14:32</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#0f0f1e' },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
  card: {
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  label: { color: '#888', fontSize: 14 },
  value: { color: '#fff', fontSize: 18, marginTop: 4, fontWeight: '600' },
});