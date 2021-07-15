import React from 'react'
import auth from '@react-native-firebase/auth'
import { GAlert } from '../Components/Alert'
import firestore from '@react-native-firebase/firestore';
import { GAsyncStorage } from './AsyncStorage';


class Common {

    getTimeStamp() {
        let date = new Date();
        return date.getTime();
    }

    commonErrorCall = () => {
        GAlert.Alert('Something went wrong please try again later', 'error')
    }

}

const GCommon = new Common();
export { GCommon }