import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import {
  deleteGiangVien,
  getGiangVienById,
} from '../services/giangVienService';

export default function DetailGiangVienScreen({ route, navigation }: any) {
  const { item } = route.params;

  const [giangVien, setGiangVien] = useState(item);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Tự động tải lại thông tin khi quay lại màn hình Detail
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setLoading(true);

        const result = await getGiangVienById(item.id);

        if (isActive && result.success) {
          setGiangVien(result.data);
        }

        if (isActive) setLoading(false);
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [item.id]),
  );

  // Thực hiện xóa giảng viên
  const performDelete = async () => {
    if (!giangVien?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID giảng viên cần xóa.');
      return;
    }

    setDeleting(true);

    try {
      const result = await deleteGiangVien(giangVien.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      navigation.goBack();

      if (Platform.OS === 'web') {
        window.alert('Đã xóa giảng viên thành công!');
      } else {
        Alert.alert('Thành công', 'Đã xóa giảng viên!');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể xóa giảng viên.');
    } finally {
      setDeleting(false);
    }
  };

  // Xác nhận trước khi xóa
  const handleDelete = () => {
    if (deleting) return;

    const message = `Bạn có chắc chắn muốn xóa giảng viên ${giangVien.Fullname} không?`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) performDelete();
      return;
    }

    Alert.alert('Xác nhận xóa', message, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: performDelete },
    ]);
  };

  // Phần return xem bên dưới

  return (
    <View style={styles.container}>
      {/* Ảnh đại diện Base64 hoặc URL */}
      {item.Image ? (
        <Image source={{ uri: item.Image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.defaultAvatar]}>
          <Text style={styles.defaultAvatarText}>GV</Text>
        </View>
      )}

      {/* Thông tin giảng viên */}
      <View style={styles.card}>
        <Text style={styles.label}>Mã Giảng Viên (IDGV):</Text>
        <Text style={styles.value}>{item.IDGV}</Text>

        <Text style={styles.label}>Họ và Tên (Fullname):</Text>
        <Text style={styles.value}>{item.Fullname}</Text>

        <Text style={styles.label}>Tổng Số Lớp (SumClass):</Text>
        <Text style={styles.valuePrimary}>{item.SumClass} lớp</Text>
      </View>

      {/* Các nút chức năng */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editBtn}
          disabled={deleting}
          onPress={() => navigation.navigate('EditGiangVien', { item })}
        >
          <Text style={styles.btnText}>Chỉnh Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, deleting && styles.disabledBtn]}
          disabled={deleting}
          onPress={handleDelete}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Xóa Giảng Viên</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
  },
  defaultAvatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 2,
  },
  valuePrimary: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledBtn: { opacity: 0.6 },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});