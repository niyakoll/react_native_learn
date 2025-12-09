// app/_layout.tsx 
//first script to read when user browser
//define app structure, how to route
import { Stack } from 'expo-router';
import {
  Text,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-vector-icons';

export default function RootLayout() {
  return (
    <>
    {/*hide the header bar, full customer UI*/}
      <Stack screenOptions={{ headerShown: false }}>
      {/*first page*/}  
        <Stack.Screen name="(tabs)/index" />
      {/*second page(a group of pages call (admin))*/}
        <Stack.Screen name="(admin)" />
      {/*a pop up screen*/}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>

      {/* 放在最外層，讓 toast 可以蓋在所有畫面上 */}
      <Toast
        config={{
          // Customeise the toast message UI
          error: (props) => (
            <View
              style={{
                backgroundColor: '#1a1a2e',
                borderLeftColor: '#ff4444',
                borderLeftWidth: 6,
                padding: 16,
                borderRadius: 12,
                minHeight: 60,
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text style={{ color: '#ff6666', fontWeight: 'bold', fontSize: 16 }}>
                {props.text1}
              </Text>
              {props.text2 && <Text style={{ color: '#ccc', marginTop: 4 }}>{props.text2}</Text>}
            </View>
          ),
          success: (props) => (
            <View
              style={{
                backgroundColor: '#1a1a2e',
                borderLeftColor: '#00d4ff',
                borderLeftWidth: 6,
                padding: 16,
                borderRadius: 12,
                minHeight: 60,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: 16 }}>
                {props.text1}
              </Text>
              {props.text2 && <Text style={{ color: '#ccc', marginTop: 4 }}>{props.text2}</Text>}
            </View>
          ),
        }}
      />
    </>
  );
}