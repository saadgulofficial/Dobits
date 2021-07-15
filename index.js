import React from 'react'
import { AppRegistry, AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    if(AppState.currentState != 'active') {
        const data = JSON.parse(remoteMessage.data.data)
        global.remoteMessage = data
    }
});
messaging().onNotificationOpenedApp(remoteMessage => {
    const data = JSON.parse(remoteMessage.data.data)
    global.remoteMessage = data
});


messaging().getInitialNotification().then(remoteMessage => {
    if(remoteMessage) {
        const data = JSON.parse(remoteMessage.data.data)
        global.remoteMessage = data
    }
})

function HeadlessCheck({ isHeadless }) {
    if(isHeadless) {
        return null;
    }

    return <App />;
}


AppRegistry.registerComponent(appName, () => HeadlessCheck);
