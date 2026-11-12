import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { updateGiangVien } from '../services/giangVienService';

// Chọn hình ảnh giảng viên
const pickImage = async (setImageUri: (uri: string) => void) => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Thông báo', 'Bạn cần cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });

    if (result.canceled || !result.assets.length) return;

    const asset = result.assets[0];

    if (!asset.base64) {
      Alert.alert('Lỗi', 'Không thể chuyển ảnh sang Base64.');
      return;
    }

    setImageUri(
      `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`,
    );

    Alert.alert('Thành công', 'Đã chọn ảnh giảng viên!');
  } catch (error) {
    console.error('Lỗi chọn ảnh:', error);
    Alert.alert('Lỗi', 'Không thể chọn ảnh.');
  }
};

import * as ImagePicker from 'expo-image-picker';

export default function EditGiangVienScreen({ route, navigation }: any) {
  const { item } = route.params;

  const [IDGV, setIDGV] = useState(item.IDGV || '');
  const [Fullname, setFullname] = useState(item.Fullname || '');
  const [SumClass, setSumClass] = useState(String(item.SumClass ?? ''));
  const [ImageUri, setImageUri] = useState(item.Image || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!IDGV.trim() || !Fullname.trim() || !SumClass.trim()) {
      Alert.alert('Thông báo', 'Vui lòng không để trống các trường bắt buộc!');
      return;
    }

    if (!Number.isInteger(Number(SumClass)) || Number(SumClass) < 0) {
      Alert.alert('Thông báo', 'Tổng số lớp phải là số nguyên không âm!');
      return;
    }

    setLoading(true);

    try {
      const result = await updateGiangVien(item.id, {
        IDGV,
        Fullname,
        Image: ImageUri,
        SumClass: Number(SumClass),
      });

      if (!result.success) {
        Alert.alert('Lỗi', result.error || 'Cập nhật thất bại.');
        return;
      }

      Alert.alert('Thành công', 'Đã cập nhật thông tin giảng viên!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={() => pickImage(setImageUri)}
      >
        {ImageUri ? (
          <Image source={{ uri: ImageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>+ Đổi Hình Ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Mã Giảng Viên (IDGV) *</Text>
      <TextInput style={styles.input} value={IDGV} onChangeText={setIDGV} />

      <Text style={styles.label}>Họ và Tên (Fullname) *</Text>
      <TextInput
        style={styles.input}
        value={Fullname}
        onChangeText={setFullname}
      />

      <Text style={styles.label}>Tổng Số Lớp (SumClass) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={SumClass}
        onChangeText={setSumClass}
      />

      <TouchableOpacity
        style={[styles.updateBtn, loading && styles.disabledBtn]}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateBtnText}>Cập Nhật Thay Đổi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  imagePicker: { alignSelf: 'center', marginBottom: 20 },
  previewImage: { width: 120, height: 120, borderRadius: 60 },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderStyle: 'dashed',
  },
  placeholderText: { color: '#495057', fontWeight: '600', fontSize: 13 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  updateBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: '#80bdff' },
  updateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});