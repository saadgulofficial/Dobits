import React from 'react'
import auth from '@react-native-firebase/auth'
import { GAlert } from '../Components/Alert'
import firestore from '@react-native-firebase/firestore';
import { GAsyncStorage } from './AsyncStorage';
import { GCommon } from './Common';
import { GToken } from './Notifications/Token';


class firebaseService {
    sendVerifyCode = (phoneNumber: any) => {
        return new Promise((resolve, reject) => {
            auth().signInWithPhoneNumber(phoneNumber)
                .then((confirmResult: any) => {
                    resolve(confirmResult)
                })
                .catch(error => {
                    //@ts-ignore
                    alert(error)
                    console.log('Error while sending verification code =>', error)
                    reject()
                })
        })
    }

    matchVerifyCode = (confirmResult: any, value: any) => {
        return new Promise(async (resolve, reject) => {
            const user: any = auth().currentUser
            if(user && user.uid) {
                resolve(user)
            }
            else {
                confirmResult.confirm(value)
                    .then(async (user: any) => {
                        resolve(user)
                    })
                    .catch((error: any) => {
                        //@ts-ignore
                        GAlert.Alert(error.message, 'error')
                        reject()
                        console.log('Error while matching verification code =>', error)
                    })
            }
        })
    }

    currentUserUid = () => {
        return new Promise(async (resolve, reject) => {
            const user = await GAsyncStorage.getLocalData()
            if(user && user.uid) {
                resolve(user.uid)
            }
            else {
                const user = await auth().currentUser
                user && user.uid ? resolve(user.uid)
                    : (
                        reject(),
                        console.log('no User found')
                    )
            }
        })
    }

    addUser = (user: any) => {
        return new Promise((resolve, reject) => {
            const uid = auth().currentUser?.uid
            user.uid = uid
            firestore()
                .collection('Users')
                .doc(uid).set({ user })
                .then(async (res) => {
                    await GAsyncStorage.setLocalData(user)
                    resolve(res)
                    console.log('User added!');
                })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while uploading user Data =>', err)
                    reject()
                })
        })
    }

    updateUser = (user: any) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Users')
                .doc(user.uid)
                .update({ user })
                .then(async (res) => {
                    await GAsyncStorage.setLocalData(user)
                    resolve(res)
                    console.log('User updated!');
                })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while updating user Data =>', err)
                    reject()
                })
        })
    }

    addEvent = (event: any) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Events')
                .doc(event.id).set({ event })
                .then(async (res) => {
                    resolve(res)
                    console.log('Event added!');
                })
                .catch((err) => {
                    GAlert.Alert('Something went wrong while Adding Event please try again later', 'error')
                    console.log('error while Adding event Data =>', err)
                    reject()
                })
        })
    }

    getEvents = () => {
        return new Promise(async (resolve, reject) => {
            const userUid = await this.currentUserUid()
            firestore()
                .collection('Events')
                .get()
                .then(async (res) => {
                    const allUsersdata: any = []
                    const currentUserData: any = []
                    res.docs.forEach(doc => {
                        const docData = doc.data().event
                        docData.userUid === userUid ?
                            currentUserData.push(docData) : null
                        allUsersdata.push(docData)
                    })
                    const data = {
                        allUsersdata: allUsersdata,
                        currentUserData: currentUserData
                    }
                    resolve(data)
                })
                .catch((err) => {
                    console.log('error while getting events Data =>', err)
                    reject()
                })
        })
    }

    deleteEvent = (event: any) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Events')
                .doc(event.id)
                .delete()
                .then(() => {
                    console.log('Event deleted!');
                    resolve('done')
                })
                .catch(
                    (err) => {
                        GAlert.Alert('Somthing Went wrong Please try again later', err)
                        console.log('error while deleting events Data =>', err)
                        reject()
                    })
        })
    }

    updateEvent = (event: any) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Events')
                .doc(event.id)
                .update({ event })
                .then(() => {
                    resolve('done')
                    GAlert.Alert('Event Updated', 'success')
                })
                .catch(err => {
                    console.log('error while updating an event', err)
                    GAlert.Alert('Something went wrong while updating Event please try again later', 'error')
                })
        })
    }

    getDataForAsync = () => {
        return new Promise(async (resolve, reject) => {
            await this.currentUserUid().then((uid: any) => {
                firestore().collection('Users').doc(uid).get()
                    .then((documentSnapshot: any) => {
                        if(documentSnapshot.data()) {
                            GAsyncStorage.setLocalData(documentSnapshot.data().user)
                            resolve(documentSnapshot.data())
                        }
                        else {
                            resolve(documentSnapshot.data())
                        }
                    })
                    .catch((err) => {
                        console.log('error while getting current user data =>', err)
                        GCommon.commonErrorCall()
                        reject('data not found')
                    })
            })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    reject('data not found')
                })
        })
    }

    signout = () => {
        return new Promise((resolve, reject) => {
            auth()
                .signOut()
                .then(() => {
                    resolve('done')
                })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while Signingout =>', err)
                    reject()
                })
        })
    }

    getUser = (uid: any) => {
        return new Promise(async (resolve, reject) => {
            await firestore().collection('Users').doc(uid).get().then((documentSnapshot: any) => {
                resolve(documentSnapshot.data().user);
            })
                .catch((err) => {
                    // GCommon.commonErrorCall()
                    console.log('error while getting user =>', err)
                    reject()
                })
        })
    }

    createChat = (conv: any) => {
        const { id, user1, user2, eventId, latestMessage, createdAt } = conv
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Chats')
                .doc(conv.id).set({
                    id: id,
                    user1: user1,
                    user2: user2,
                    eventId: eventId,
                    latestMessage: latestMessage,
                    createdAt: new Date()
                })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while Creating conversation =>', err)
                    reject()
                })
        })
    }

    searchChatState = (key: any, value: any, eventId: any) => {
        return (
            firestore().collection('Chats')
                .where('eventId', '==', eventId)
                .where(key, '==', value)
                .get()
                .then((doc: any) => doc._docs)
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while searchChatState =>', err)
                    return null
                })
        )
    }



    checkChat = (chatInitalDetail: any, currentUserUid: any) => {
        const { eventId, user1 } = chatInitalDetail
        return new Promise(async (resolve, reject) => {
            Promise.all([this.searchChatState('user1.uid', currentUserUid, eventId), this.searchChatState('user2.uid', currentUserUid, eventId)])
                .then(([one, two]) => one.concat(two))
                .then(res => {
                    if(res.length !== 0) {
                        const data = res[0].data()
                        resolve(data)
                    }
                    else {
                        resolve([])
                    }
                })
                .catch((err) => {
                    // GCommon.commonErrorCall()
                    // console.log('error while checking chat =>', err)
                    reject()
                })
        })
    }

    sendMessage = (msgDetails: any, convId: any) => {
        const { createdAt, message, user, id, sendTo } = msgDetails
        return new Promise((resolve, reject) => {
            firestore().collection("Chats").doc(convId).collection('messages').doc(id)
                .set({
                    id: id,
                    message: message,
                    user: user,
                    createdAt: new Date()
                })
                .then(() => {
                    firestore().collection("Chats").doc(convId).update({
                        latestMessage: message,
                        sendTo: sendTo,
                    })
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            GCommon.commonErrorCall()
                            console.log('error while Updating latest message =>', err)
                            reject()
                        })
                })
                .catch((err) => {
                    GCommon.commonErrorCall()
                    console.log('error while creating message Collection=>', err)
                    reject()
                })
        })
    }

    searchGetChats = (key: any, value: any) => {
        return (
            firestore().collection('Chats')
                .where(key, '==', value)
                .get()
                .then((doc: any) => doc._docs)
                .catch((err) => {
                    // GCommon.commonErrorCall()
                    console.log('error while searchChatState =>', err)
                    return null
                })
        )
    }
    getChats = (uid: any) => {
        return new Promise((resolve, reject) => {
            Promise.all([this.searchGetChats('user1.uid', uid), this.searchGetChats('user2.uid', uid)])
                .then(([one, two]) => one.concat(two))
                .then(res => {
                    if(res.length !== 0) {
                        const chats: any = []
                        res.forEach((doc: any) => {
                            chats.push(doc.data())
                        })
                        resolve(chats)
                    }
                    else {
                        reject()
                    }
                })
                .catch((err) => {
                    // GCommon.commonErrorCall()
                    // console.log('error while checking chat =>', err)
                    reject()
                })
        })
    }

    updateHeader = (chatDetail: any, currentUserUid: any, editHeaderData: any) => {
        const { eventId, user1, user2, id } = chatDetail
        return new Promise((resolve, reject) => {
            Promise.all([this.searchChatState('user1.uid', currentUserUid, eventId), this.searchChatState('user2.uid', currentUserUid, eventId)])
                .then(([one, two]) => {
                    if(one.length !== 0) {
                        firestore()
                            .collection('Chats')
                            .doc(id)
                            .update({ user1: { uid: user1.uid, header: editHeaderData } })
                            .then(() => {
                                resolve('done')
                                GAlert.Alert('Header Updated', 'success')
                            })
                            .catch(err => {
                                console.log('error while updating an Header', err)
                                GAlert.Alert('Something went wrong while updating Event please try again later', 'error')
                                reject()
                            })
                    }
                    else if(two.length !== 0) {
                        firestore()
                            .collection('Chats')
                            .doc(id)
                            .update({ user2: { uid: user2.uid, header: editHeaderData } })
                            .then(() => {
                                resolve('done')
                                GAlert.Alert('Header Updated', 'success')
                            })
                            .catch(err => {
                                console.log('error while updating Header ', err)
                                GAlert.Alert('Something went wrong while updating Event please try again later', 'error')
                                reject()
                            })
                    }
                })
                .catch(err => {
                    console.log('error while searching header data ', err)
                    GAlert.Alert('Something went wrong while updating Event please try again later', 'error')
                    reject()
                })
        })
    }

    updateToken = async () => {
        const uid: any = await this.currentUserUid()
        const token = await GToken()
        const user = await GAsyncStorage.getLocalData()
        user.token = token
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Users')
                .doc(uid)
                .set({ user })
                .then(async () => {
                    console.log('updated')
                    await GAsyncStorage.setLocalData(user)
                    resolve(token)
                })
                .catch(err => {
                    console.log('error while updating token ', err)
                    reject()
                })
        })
    }

    deleteChat = (item: any) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection('Chats')
                .doc(item.id)
                .delete()
                .then(() => {
                    GAlert.Alert('Deleted', 'success')
                    resolve('done')
                })
                .catch(
                    (err) => {
                        GAlert.Alert('Somthing Went wrong Please try again later', err)
                        console.log('error while deleting chat Data =>', err)
                        reject()
                    })
        })
    }

}

const GFirebase = new firebaseService();
export { GFirebase }