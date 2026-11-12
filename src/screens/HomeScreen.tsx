import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { getGiangViens, GiangVien } from '../services/giangVienService';

export default function HomeScreen({ navigation }: any) {
  const [list, setList] = useState<GiangVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<'name_asc' | 'class_desc'>(
    'name_asc',
  );

  // Lấy danh sách giảng viên khi màn hình được hiển thị
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setLoading(true);

        try {
          const data = await getGiangViens();

          if (isActive) setList(data);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Lọc và sắp xếp danh sách giảng viên
  const filteredList = useMemo(() => {
    let result = list.filter((item) => {
      const query = searchQuery.toLowerCase().trim();

      return (
        item.Fullname?.toLowerCase().includes(query) ||
        item.IDGV?.toLowerCase().includes(query)
      );
    });

    if (sortType === 'name_asc') {
      result.sort((a, b) =>
        a.Fullname.localeCompare(b.Fullname, 'vi'),
      );
    } else {
      result.sort(
        (a, b) => Number(b.SumClass) - Number(a.SumClass),
      );
    }

    return result;
  }, [list, searchQuery, sortType]);

  // Thay đổi kiểu sắp xếp
  const toggleSort = () => {
    setSortType((current) =>
      current === 'name_asc' ? 'class_desc' : 'name_asc',
    );
  };

  // Hiển thị từng giảng viên
  const renderItem = ({ item }: { item: GiangVien }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailGiangVien', { item })}
    >
      {item.Image ? (
        <Image
          source={{ uri: item.Image }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.defaultAvatar]}>
          <Text style={styles.defaultAvatarText}>GV</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.textId}>Mã: {item.IDGV}</Text>
        <Text style={styles.textName}>{item.Fullname}</Text>
        <Text style={styles.textClass}>Số lớp: {item.SumClass}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header & Nút Thêm */}
      <View style={styles.header}>
        <Text style={styles.title}>Quản Lý Giảng Viên</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddGiangVien')}
          >
            <Text style={styles.addBtnText}>+ Thêm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thanh tìm kiếm và Sắp xếp */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên hoặc mã GV..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
          <Text style={styles.sortBtnText}>
            {sortType === 'name_asc'
              ? '🔤 Tên A-Z'
              : '📊 Số lớp giảm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id!}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Không tìm thấy giảng viên nào.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerActions: { flexDirection: 'row', gap: 8 },
  addBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  logoutBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  sortBtn: {
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: '#333' },
  listContainer: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#e1e1e1',
  },
  info: { flex: 1, marginLeft: 12 },
  textId: { fontSize: 12, color: '#666', fontWeight: '600' },
  textName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginVertical: 2,
  },
  textClass: { fontSize: 13, color: '#007bff', fontWeight: '500' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 15,
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
  },
  defaultAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});