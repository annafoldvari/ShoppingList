import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';

function ListItem({text, deleteItem, deleteDoneItem, doneItem, thumbUp}) {
  return (
    <View style={styles.container}>
      <AppText style={styles.fontSize}>{text}</AppText>
      <View style={styles.iconContainer}>
        {thumbUp && <TouchableWithoutFeedback onPress={doneItem}>
          <MaterialCommunityIcons style={styles.iconSpacing} name="thumb-up-outline" size={20} color="white"/>
        </TouchableWithoutFeedback>}
        <TouchableWithoutFeedback onPress={deleteDoneItem ? deleteDoneItem : deleteItem}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" /> 
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
  },
  iconContainer: {
    flexDirection: "row"
  },
  iconSpacing: {
    paddingRight: 20,
  },
  fontSize: {
    fontSize: 20,
    paddingRight: 15,
  }
});

export default ListItem;