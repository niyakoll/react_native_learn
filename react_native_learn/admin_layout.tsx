// app/(admin)/_layout.tsx
import { createSupabaseClient } from '@/lib/initSupabase';
import { Redirect, Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const menuItems = [
  { name: 'Dashboard', href: '/(admin)/dashboard', icon: '📊' },
  { name: 'Clients', href: '/(admin)/clients', icon: '👥' },
  { name: 'Scraper', href: '/(admin)/scraper', icon: '🕷️' },
  { name: 'Database', href: '/(admin)/database', icon: '🗄️' },
  { name: 'Account', href: '/(admin)/account', icon: '👤' },
  { name: 'Logs', href: '/(admin)/logs', icon: '📜' },
] as const;

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const supabase = createSupabaseClient();
    // @ts-ignore
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    // @ts-ignore
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading Admin Panel...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(tabs)/index" />;
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>Listening Tools</Text>
          <Text style={styles.logoSub}>Admin Panel</Text>
        </View>

        {/* Menu */}
        <ScrollView style={styles.menu}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => {
                  // Direct navigation — 100% safe on Web
                  window.location.href = item.href;
                }}
                style={[styles.menuButton, isActive && styles.menuButtonActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.menuIcon, isActive && styles.menuIconActive]}>
                  {item.icon}
                </Text>
                <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

// 100% Web-safe, no transparent, no cursor, no asChild, no Pressable arrays
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0f0f1e',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#1a1a2e',
    borderRightWidth: 1,
    borderRightColor: '#333',
    paddingVertical: 32,
  },
  logo: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  logoSub: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
  },
  menu: {
    flex: 1,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  menuButtonActive: {
    backgroundColor: '#00d4ff22',
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
    color: '#888',
  },
  menuIconActive: {
    color: '#00d4ff',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  logoutIcon: {
    fontSize: 22,
    marginRight: 16,
    color: '#ff4444',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  loading: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
});