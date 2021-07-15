import AsyncStorage from '@react-native-async-storage/async-storage';

import React from 'react'

class AsyncStorageClass {

    KEYS = {
        USER_INFO: 'USER_INFO',
        USER_EVENTS: 'USER_EVENTS'
    };

    setLocalData = async (userDetails: any) => {
        try {
            await AsyncStorage.setItem(this.KEYS.USER_INFO, JSON.stringify(userDetails));
        } catch(err) {
            console.log('error while saving aysncstorage user data =>', err)
            return null;
        }
    };

    getLocalData = async () => {
        try {
            const response = await AsyncStorage.getItem(this.KEYS.USER_INFO);
            if(response) {
                return JSON.parse(response);
            }
            return null;
        } catch(err) {
            console.log('error while getting aysncstorage user data =>', err)
            return null;
        }
    }

    deleteLocalData = async () => {
        try {
            await AsyncStorage.removeItem(this.KEYS.USER_INFO);
        } catch(err) {
            console.log('error while deleting aysncstorage user data =>', err)
            return null;
        }
    };

    setLocalEvents = async (eventDetails: any) => {
        try {
            await AsyncStorage.setItem(this.KEYS.USER_EVENTS, JSON.stringify(eventDetails));
        } catch(err) {
            console.log('error while saving aysncstorage user Events =>', err)
            return null;
        }
    };

    getLocalEvents = async () => {
        try {
            const response = await AsyncStorage.getItem(this.KEYS.USER_EVENTS);
            if(response) {
                return JSON.parse(response);
            }
            return null;
        } catch(err) {
            console.log('error while getting aysncstorage user Events =>', err)
            return null;
        }
    }
}

const GAsyncStorage = new AsyncStorageClass();
export { GAsyncStorage }
