// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddGiangVienScreen from './src/screens/AddGiangVienScreen';
import EditGiangVienScreen from './src/screens/EditGiangVienScreen';
import DetailGiangVienScreen from './src/screens/DetailGiangVienScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Danh Sách Giảng Viên', headerLeft: () => null }}
        />
        <Stack.Screen
          name="AddGiangVien"
          component={AddGiangVienScreen}
          options={{ title: 'Thêm Giảng Viên Mới' }}
        />
        <Stack.Screen
          name="EditGiangVien"
          component={EditGiangVienScreen}
          options={{ title: 'Cập Nhật Giảng Viên' }}
        />
        <Stack.Screen
          name="DetailGiangVien"
          component={DetailGiangVienScreen}
          options={{ title: 'Chi Tiết Giảng Viên' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}