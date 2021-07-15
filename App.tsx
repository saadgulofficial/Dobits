import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react'
import { View, LogBox, Alert } from 'react-native'
import StackNav from './Src/Navigations/StackNav'
import FlashMessage from "react-native-flash-message";
import { Notification } from "react-native-in-app-message";


const App = () => {
  { LogBox.ignoreAllLogs() }
  return (
    <View style={{ flex: 1 }}>
      <StackNav />
      <FlashMessage position="top" />
    </View>
  )
}

export default App