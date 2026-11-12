import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import * as ImageManipulator from "expo-image-manipulator";

// Collection GiangVien trong Firestore
const giangVienCollection = collection(db, "GiangVien");

// Kiểu dữ liệu giảng viên
export interface GiangVien {
  id?: string;
  IDGV: string;
  Fullname: string;
  Image: string;
  SumClass: number;
}

// Chuyển ảnh sang Base64 và tự động resize, nén ảnh.
// Không sử dụng Firebase Storage.
export const uploadImageToStorage = async (image: string): Promise<string> => {
  if (!image) return "";

  // Nếu ảnh là URL online thì giữ nguyên
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  try {
    const result = await ImageManipulator.manipulateAsync(
      image,
      [{ resize: { width: 300 } }],
      {
        compress: 0.35,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!result.base64) {
      throw new Error("Không thể chuyển ảnh sang Base64.");
    }

    const compressedImage = `data:image/jpeg;base64,${result.base64}`;

    // Kiểm tra dung lượng ảnh
    if (compressedImage.length > 700000) {
      throw new Error("Ảnh vẫn quá lớn. Vui lòng chọn ảnh khác.");
    }

    return compressedImage;
  } catch (error) {
    console.error("Lỗi xử lý ảnh:", error);
    throw error;
  }
};

// Lấy danh sách giảng viên từ Firestore
export const getGiangViens = async (): Promise<GiangVien[]> => {
  try {
    const snapshot = await getDocs(giangVienCollection);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as GiangVien[];
  } catch (error) {
    console.error("Lỗi lấy danh sách giảng viên:", error);
    return [];
  }
};

// Thêm mới giảng viên
export const addGiangVien = async (data: GiangVien) => {
  try {
    const image = await uploadImageToStorage(data.Image);

    const docRef = await addDoc(giangVienCollection, {
      IDGV: data.IDGV.trim(),
      Fullname: data.Fullname.trim(),
      Image: image,
      SumClass: Number(data.SumClass),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Lỗi thêm giảng viên:", error);

    return {
      success: false,
      error: error.message || "Không thể thêm giảng viên.",
    };
  }
};

// Cập nhật thông tin giảng viên
export const updateGiangVien = async (id: string, data: GiangVien) => {
  try {
    if (!id) throw new Error("Không tìm thấy ID document giảng viên.");

    const docRef = doc(db, "GiangVien", id);
    const image = data.Image ? await uploadImageToStorage(data.Image) : "";

    await updateDoc(docRef, {
      IDGV: data.IDGV.trim(),
      Fullname: data.Fullname.trim(),
      Image: image,
      SumClass: Number(data.SumClass),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật giảng viên:", error);

    return {
      success: false,
      error: error.message || "Không thể cập nhật giảng viên.",
    };
  }
};

// Xóa giảng viên
export const deleteGiangVien = async (id: string) => {
  try {
    if (!id) throw new Error("Không tìm thấy ID giảng viên.");

    await deleteDoc(doc(db, "GiangVien", id));

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xóa giảng viên:", error);

    return {
      success: false,
      error: error.message || "Không thể xóa giảng viên.",
    };
  }
};

// Lấy thông tin một giảng viên theo ID
export const getGiangVienById = async (id: string) => {
  try {
    const docRef = doc(db, "GiangVien", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Không tìm thấy giảng viên.");
    }

    return {
      success: true,
      data: {
        id: snapshot.id,
        ...snapshot.data(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Không thể lấy thông tin giảng viên.",
    };
  }
};
