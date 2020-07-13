import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import { AsyncStorage } from 'react-native';


import {
  SafeAreaView,
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  Button,
  Modal
} from "react-native";
import AppText from "./AppText";
import ListItem from "./ListItem";

function MainScreen(props) {

  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [doneItems, setDoneItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const handleDelete = item => {
    setItems(items.filter(arrayItem => arrayItem.id !== item.id));
  }

  const handleDoneDelete = item => {
    setDoneItems(doneItems.filter(arrayItem => arrayItem.id !== item.id));
  }

  const handleDone = item => {
    setItems(items.filter(arrayItem => arrayItem.id !== item.id));
    setDoneItems([...doneItems, item]);
  }

  const handleAdd = (text) => {
    if (!text) {
      return;
    } else {
      setItems([...items, {
        id: nextId,
        text
      }]);
      setText("");
      setNextId(nextId + 1);
    }
  }

  const _storeData = async () => {
    try {
      await AsyncStorage.setItem('items', JSON.stringify(items));
      await AsyncStorage.setItem('doneItems', JSON.stringify(doneItems));
      await AsyncStorage.setItem('nextId', nextId.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const _retrieveData = async () => {
    try {
      const items = await AsyncStorage.getItem('items');
      const doneItems = await AsyncStorage.getItem('doneItems');
      const nextId = await AsyncStorage.getItem('nextId');
      if (items !== null) {
        setItems(JSON.parse(items))
      }
      if (doneItems !== null) {
        setDoneItems(JSON.parse(doneItems))
      }
      if (nextId !== null) {
        setNextId(parseInt(nextId))
      } 
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (!loaded) {
      _retrieveData();
      setLoaded(true);
    } else {
      _storeData();
    }
  });
  
  return (
    <>
      <ImageBackground
        source={require("../assets/trolley.jpg")}
        style={styles.background}
      >
        <SafeAreaView style={styles.screen}>
          <View>
            <AppText style={styles.title}>Shopping List</AppText>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ListItem text={item.text} thumbUp={true} deleteItem={() => handleDelete(item)} doneItem={() => handleDone(item) }/>}
            />
          </View>
          <View style={styles.addContainer}>
            <TextInput style={styles.input} placeholder="Item to buy..." onChangeText={(text) => setText(text)} value={text}/>
            <Button title="Add" onPress={() => handleAdd(text) }/>
          </View>
          <View style={styles.buttonStyle}>
            <Button title="Show bought items" onPress={() => setModalVisible(true)} />
          </View>
        </SafeAreaView>
      </ImageBackground>
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalScreen}>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          <FlatList
            data={doneItems}
            keyExtractor={(doneItem) => doneItem.id.toString()}
            renderItem={({item}) => (
              <ListItem
                text={item.text}
                thumbUp={false}
                deleteDoneItem={() => handleDoneDelete(item)}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    flexDirection: "row",
    paddingBottom: 30,
    paddingRight: 20
  },
  background: {
    flex: 1,
    alignItems: "center",
  },
  buttonStyle: {
    paddingBottom: 44,
    paddingTop: 15,
  },
  input: {
    backgroundColor: "white",
    flex: 2,
    height: 35,
    marginLeft: 20,
  },
  modalScreen: {
    backgroundColor: "#483D8B",
    flex: 1,
  },
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center", 
  },
  title: {
    fontSize: 32,
    paddingTop: 35,
  },
});

export default MainScreen;
