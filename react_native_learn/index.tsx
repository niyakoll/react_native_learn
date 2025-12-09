// app/index.tsx
import { createSupabaseClient } from '@/lib/initSupabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message'; // ← 正確！最新版 v2+ 這樣寫

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter();

  // 避免 SSR 時 window undefined
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseReady(true);
    }
  }, []);

  // 嚴格的前端驗證（防注入、防空值、防攻擊）
  const validateInputs = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailTrimmed = email.trim().toLowerCase();
    if (!emailTrimmed) {
      newErrors.email = '請輸入 Email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = '請輸入有效的 Email 地址';
    }

    if (!password) {
      newErrors.password = '請輸入密碼';
    } else if (password.length < 6) {
      newErrors.password = '密碼至少需要 6 個字元';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});

    if (!validateInputs()) {
      Toast.show({
        type: 'error',
        text1: '輸入錯誤',
        text2: '請檢查 Email 和密碼格式',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.user) {
        let message = '帳號或密碼錯誤';

        if (error?.message.includes('Invalid login credentials')) {
          message = '帳號或密碼錯誤';
        } else if (error?.message.includes('Email not confirmed')) {
          message = '請先驗證您的 Email';
        } else if (error?.message) {
          message = error.message;
        }

        Toast.show({
          type: 'error',
          text1: '登入失敗',
          text2: message,
          position: 'bottom',
          visibilityTime: 4000,
        });
        return;
      }

      // 嚴格檢查是否為 root_admin（安全關鍵！）
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'root_admin') {
        await supabase.auth.signOut();
        Toast.show({
          type: 'error',
          text1: '存取拒絕',
          text2: '您沒有管理員權限',
          position: 'bottom',
          visibilityTime: 4000,
        });
        return;
      }

      // 登入成功！
      Toast.show({
        type: 'success',
        text1: '歡迎回來！',
        text2: '正在進入管理後台...',
        position: 'bottom',
        visibilityTime: 2000,
      });

      router.replace('/(admin)/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      Toast.show({
        type: 'error',
        text1: '系統錯誤',
        text2: '無法連接到伺服器，請檢查網路後再試',
        position: 'bottom',
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 支援 Enter 鍵登入（桌面 Web 超好用）
  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  if (!supabaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0f1e' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Listening Tools</Text>
            <Text style={styles.tagline}>Admin Dashboard</Text>
          </View>

          {/* 登入表單 */}
          <View style={styles.form}>
            <Text style={styles.title}>管理員登入</Text>
            <Text style={styles.subtitle}>僅限 root admin 存取</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="admin@listeningtools.app"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!loading}
                onSubmitEditing={handleLogin}
                returnKeyType="next"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* 密碼 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="請輸入密碼"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
                onSubmitEditing={handleLogin}
                returnKeyType="done"
                onKeyPress={handleKeyPress}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* 登入按鈕 */}
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.buttonText}>登入管理後台</Text>
              )}
            </Pressable>

            <Text style={styles.securityNote}>
              本系統受保護，僅限授權管理員使用
            </Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © 2025 Listening Tools • 嚴禁未經授權存取
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 完全符合你設計風格的樣式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  header: { alignItems: 'center', marginTop: 80 },
  logo: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  tagline: { fontSize: 18, color: '#00d4ff', marginTop: 8, fontWeight: '700' },
  form: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 48 },
  inputContainer: { marginBottom: 16 },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ff6666',
    fontSize: 13,
    marginTop: 6,
    paddingLeft: 4,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  securityNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginTop: 24,
    fontStyle: 'italic',
  },
  footer: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 40,
  },
});