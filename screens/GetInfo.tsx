import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';

export default function GetInfo() {
  const router = useRouter();
  const { logout } = useAuth();

  const data = [
    { id: '1', tenCongTrinh: 'Công trình A', soGiayPhep: 'GP-001' },
    { id: '2', tenCongTrinh: 'Công trình B', soGiayPhep: 'GP-002' },
    { id: '3', tenCongTrinh: 'Công trình C', soGiayPhep: 'GP-003' },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'THÔNG BÁO',
      'Bạn thực sự muốn đăng xuất?',
      [
        {
          text: 'HUỶ',
          style: 'cancel',
        },
        {
          text: 'ĐĂNG XUẤT',
          onPress: () => {
            logout();
            router.replace("/login");
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('');

  const handlePress = (license:any) => {
    setSelectedLicense(license);
    setModalVisible(true);
  };

  const renderItem = ({ item, index } : { item: any; index: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.tenCongTrinh}</Text>
      <TouchableOpacity onPress={() => handlePress(item.soGiayPhep)} style={styles.cell}>
        <Text style={styles.linkText}>{item.soGiayPhep}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
    <View style={styles.header}>
      <TouchableOpacity style={[styles.buttonLogout]} onPress={() => router.replace('/')}>
        <Icon name="arrow-back-outline" style={styles.iconWhite} size={25} ></Icon>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Tra cứu thông tin</Text>
    </View>

    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>STT</Text>
        <Text style={[styles.cell, styles.headerText]}>Tên công trình</Text>
        <Text style={[styles.cell, styles.headerText]}>Số Giấy phép</Text>
      </View>

      {/* Danh sách */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={[styles.tableData]}
      />

      {/* Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Số Giấy phép: {selectedLicense}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#035291',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: "#e2f3ff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
  },
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonLogout: {
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 10,
  },
  iconWhite: {
    color: '#fff'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  tableData: {
    width: '80%',
  },
  headerRow: {
    backgroundColor: '#cec',
    width: '80%',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
  },
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
