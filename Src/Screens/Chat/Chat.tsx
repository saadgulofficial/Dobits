import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, KeyboardAvoidingView, Platform, Dimensions, StatusBar, ActivityIndicator, AppState, Keyboard, BackHandler } from 'react-native'
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as Animatable from 'react-native-animatable';
import { useForceUpdate } from '../../Components/ForceUpdate'
import { GAlert, GHeader, GImageView } from '../../Components/Index'
import { fontSize, GColor, GIcons, hp, wp } from '../../Globals'
import Styles from './Styles'
import { GAsyncStorage, GCommon, GFirebase } from '../../Services';
import GPush from '../../Services/Notifications/Push'
import _ from 'lodash'
import firestore from '@react-native-firebase/firestore';
import { Bullets } from 'react-native-easy-content-loader';
import * as Progress from 'react-native-progress';
import ActionSheet from 'react-native-actionsheet'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


const { width, height } = Dimensions.get('window')
const Chat = ({ navigation, route }: any) => {
    var ActionSheetRef: any = useRef(null)
    const forceUpdate = useForceUpdate()
    const [chatInitalDetail, setchatInitalDetail] = useState(route.params && route.params.chatInitalDetail ? route.params.chatInitalDetail : '')
    // const chatInitalDetail = route.params && route.params.chatInitalDetail ? route.params.chatInitalDetail : ''
    const { white, black, secondaryWhiteTwo, theme, color0, gray2, gray3, gray4, color4, blue, gray5 } = GColor
    const [containerLoader, setcontainerLoader] = useState(true)
    const [headerImageLoader, setheaderImageLoader] = useState(true)
    const [message, setmessage] = useState('')
    const [messages, setmessages] = useState<any>([])
    const [otherUserImage, setotherUserImage] = useState('')
    const [otherUser, setotherUser] = useState<any>('')
    const [currentUserUid, setcurrentUserUid] = useState('')
    const [currentUserHeaderUid, setcurrentUserHeaderUid] = useState({ header: '', uid: '' })
    const [otherUserHeaderUid, setOtherUserHeaderUid] = useState({ header: '', uid: '' })
    const [prevChatDetail, setprevChatDetail] = useState({ id: '' })
    const [localUser, setlocalUser] = useState<any>('')
    const [editPress, seteditPress] = useState(false)
    const [editHeaderData, seteditHeaderData] = useState('')
    const [editLoader, seteditLoader] = useState(false)
    const [progress, setprogress] = useState(0)
    const [progressBarStatus, setprogressBarStatus] = useState(0)
    const [showImageSendProg, setshowImageSendProg] = useState(false)
    const [openImage, setopenImage] = useState(false)
    const [openImageData, setopenImageData] = useState<any>([])
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [getNewchatIntialDetail, setgetNewchatIntialDetail] = useState(false)

    const backAction = () => {
        //@ts-ignore
        global.reserveId = ''
        //@ts-ignore
        global.remoteMessage = undefined
        navigation.goBack()
        return true
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);


    const _handleAppStateChange = async (nextAppState: any) => {
        if(appState.current.match('active')) {
            //@ts-ignore
            // global.remoteMessage = undefined
        }
        //This will run when app is in background
        if(
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            //@ts-ignore
            // const messageData = global.remoteMessage
            // if(messageData) {
            //     await GAsyncStorage.getLocalData().then(async (localUser: any) => {
            //         const currentUserUid = localUser.uid
            //         await GFirebase.checkChat(messageData.conv, currentUserUid).then(async (res: any) => {
            //             if(res) {
            //                 await getMessages(res.id)
            //                 setprevChatDetail(res)
            //             }
            //         })
            //             .catch(() => setcontainerLoader(false))
            //     })
            // }
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);



    useEffect(() => {
        async function user() {
            await GAsyncStorage.getLocalData().then((localUser: any) => {
                const uid = localUser.uid
                setcurrentUserUid(uid)
                setlocalUser(localUser)
            })
        }
        user()
    }, [])


    const getOtherUserHeaderAndUid = () => {
        const { user1, user2 } = chatInitalDetail
        if(user2.uid !== currentUserUid) {
            return user2
        }
        else if(user1.uid !== currentUserUid) {
            return user1
        }
    }

    const getCurrentUserHeaderAndUid = () => {
        const { user1, user2 } = chatInitalDetail
        if(user2.uid === currentUserUid) {
            return user2
        }
        else if(user1.uid === currentUserUid) {
            return user1
        }
    }


    const getFetchUser = async () => {
        if(currentUserUid !== '') {
            const otherUser = getOtherUserHeaderAndUid()
            const otherUseruid = otherUser.uid
            const otherUserHeader = otherUser.header

            const currentUserDetail = getCurrentUserHeaderAndUid()
            const currentUserUid = currentUserDetail.uid
            const currentUserHeader = currentUserDetail.header

            //@ts-ignore
            global.reserveId = otherUseruid
            setOtherUserHeaderUid({ header: otherUserHeader, uid: otherUseruid })
            setcurrentUserHeaderUid({ header: currentUserHeader, uid: currentUserUid })

            await GFirebase.getUser(otherUseruid).then((data: any) => {
                const image = data.image ? data.image : ''
                setotherUser(data)
                setotherUserImage(image)
                setheaderImageLoader(false)
            })
        }
    }

    useEffect(() => {
        async function fetchUser() {
            if(route.params && !route.params.fromHome) {
                await getFetchUser()
            }
        }
        fetchUser()
    }, [currentUserUid])


    useEffect(() => {
        async function fetchUser() {
            getNewchatIntialDetail && route.params && route.params.fromHome ?
                await getFetchUser() : null
        }
        fetchUser()
    }, [getNewchatIntialDetail])

    const getMessages = async (convId: any) => {
        await firestore().collection('Chats').doc(convId).collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot((docs: any) => {
                const messagesArray: any = Array();
                if(docs && docs.length !== 0) {
                    docs.forEach((doc: any) => {
                        messagesArray.push(doc.data())
                    })
                    setmessages(messagesArray)
                    setcontainerLoader(false)
                }
                else {
                    setcontainerLoader(false)
                }

            })
    }


    useEffect(() => {
        async function fetchCheckChat() {
            route.params && route.params.fromHome ?
                currentUserUid &&
                await GFirebase.checkChat(chatInitalDetail, currentUserUid).then(async (res: any) => {
                    if(res.length !== 0) {
                        setchatInitalDetail(res)
                        setgetNewchatIntialDetail(true)
                        await getMessages(res.id)
                        setprevChatDetail(res)
                    }
                    else {
                        await getFetchUser()
                        setcontainerLoader(false)
                    }
                })
                    .catch(() => setcontainerLoader(false))
                :
                (
                    setprevChatDetail(chatInitalDetail),
                    await getMessages(chatInitalDetail.id)
                )

        }
        fetchCheckChat()
    }, [currentUserUid])


    const onChangeMessage = (text: any) => { setmessage(text) }

    const handleBack = () => navigation.goBack()

    const sendPush = async (msgDetails: any, conv: any) => {
        const token = otherUser.token
        const data = {
            title: 'New Message',
            body: otherUserHeaderUid.header,
            data: {
                image: otherUserImage,
                sendTo: otherUserHeaderUid.uid,
                sendBy: currentUserUid,
                conv: conv
            }
        }
        await GPush(token, data)
    }

    const sendMessage = async (msgDetails: any, conv: any) => {
        const { message } = msgDetails
        var convId = conv.id
        if(message.includes('$Image$')) {
            const newMessage = message.split('$Image$')[0]
            await imageUpload(newMessage).then(async (imageUrl) => {
                msgDetails.message = imageUrl
                await GFirebase.sendMessage(msgDetails, convId).then(() => {
                    sendPush(msgDetails, conv)
                    msgDetails.status = 'sent'
                    _.replace(messages, msgDetails.id, msgDetails)
                    setmessages(messages)
                    forceUpdate()
                })
                    .catch(() => handleFailedSend(msgDetails))
            })
        }
        else {
            await GFirebase.sendMessage(msgDetails, convId).then(() => {
                sendPush(msgDetails, conv)
                msgDetails.status = 'sent'
                _.replace(messages, msgDetails.id, msgDetails)
                setmessages(messages)
                forceUpdate()
            })
                .catch(() => handleFailedSend(msgDetails))
        }
    }

    const handleFailedSend = async (msgDetails: any) => {
        msgDetails.status = 'failed'
        _.replace(messages, msgDetails.id, msgDetails)
        setmessages(messages)
        forceUpdate()
    }

    const onSend = async (newMessage: any) => {
        setmessage('')
        const msgDetails: any = {
            createdAt: '',
            message: newMessage,
            user: currentUserUid,
            id: 'id-' + GCommon.getTimeStamp(),
            sendTo: otherUserHeaderUid.uid,
            status: 'sending'
        }
        if(messages.length === 0) {

            messages.unshift(msgDetails)
            setmessages(messages)

            const conv = {
                id: 'id-' + GCommon.getTimeStamp(),
                user1: { uid: currentUserUid, header: currentUserHeaderUid.header },
                user2: { uid: otherUserHeaderUid.uid, header: otherUserHeaderUid.header },
                eventId: chatInitalDetail.eventId,
                latestMessage: newMessage,
                createdAt: ''
            }
            await GFirebase.createChat(conv).then(() => {
                const convId: any = conv.id
                sendMessage(msgDetails, conv)
                setprevChatDetail(conv)
            })
                .catch(() => handleFailedSend(msgDetails))
        }
        else {
            messages.unshift(msgDetails)
            setmessages(messages)
            sendMessage(msgDetails, prevChatDetail)
        }
    }

    const onTryAgain = async (msgDetails: any) => {
        setmessage('')
        msgDetails.status = 'sending'
        _.replace(messages, msgDetails.id, msgDetails)
        setmessages(messages)
        forceUpdate()

        if(prevChatDetail.id !== '') {
            sendMessage(msgDetails, prevChatDetail)
        }
        else {
            const conv = {
                id: 'id-' + GCommon.getTimeStamp(),
                user1: { uid: currentUserUid, header: currentUserHeaderUid.header },
                user2: { uid: otherUserHeaderUid.uid, header: otherUserHeaderUid.header },
                eventId: chatInitalDetail.eventId,
                latestMessage: msgDetails.message,
                createdAt: ''
            }
            await GFirebase.createChat(conv).then(() => {
                const convId: any = conv.id
                sendMessage(msgDetails, conv)
                setprevChatDetail(conv)
            })
                .catch(() => handleFailedSend(msgDetails))
        }
    }


    const onSelectCamera = () => {
        var options: any = {}
        launchCamera(options, async (res: any) => {
            if(res.didCancel) {
                console.log('User cancelled image picker');
            } else if(res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                const path = res.uri
                const path2 = path.concat('$Image$')
                onSend(path2)
            }
        });
    }

    const onSelectImageLibaray = () => {
        var options: any = {}
        launchImageLibrary(options, async (res: any) => {
            if(res.didCancel) {
                console.log('User cancelled image picker');
            } else if(res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                const path = res.uri
                const path2 = path.concat('$Image$')
                onSend(path2)
            }
        });
    }

    const onCameraPress = () => ActionSheetRef.show()


    const imageUpload = (path: any) => {
        return new Promise((resolve, reject) => {
            let imageName = 'id-' + GCommon.getTimeStamp()
            const reference = storage().ref(`/Chats/${currentUserUid}/${imageName}`)
            const task = reference.putFile(path);
            task.on('state_changed', (taskSnapshot: any) => {
                //@ts-ignore
                const prog = parseInt((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
                const progressBar = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                setshowImageSendProg(true)
                setprogressBarStatus(progressBar)
                setprogress(prog)
            })
            task.then(async () => {
                const url = await storage().ref(`/Chats/${currentUserUid}/${imageName}`).getDownloadURL();
                setshowImageSendProg(false)
                resolve(url)
            })
                .catch((err: any) => {
                    GAlert.Alert('image sending failed try again later', 'error')
                    console.log('error while updating Image =>', err)
                    reject()
                })
        })
    }


    const onImagePress = (image: any) => {
        openImage ? (
            setopenImage(false),
            setopenImageData([])
        )
            :
            (
                setopenImageData(
                    [{
                        source: {
                            uri: image,
                        },
                        width: 806,
                        height: 720,
                    },
                    ]
                ),
                setopenImage(true)
            )

    }







    const itemSeperator = () => <View style={{ marginVertical: hp(0.5) }} />
    const renderMessages = ({ item, index }: any) => {
        const status = item.status ? item.status : ''
        return (
            <Animatable.View
                animation={item.user === currentUserUid ? 'zoomInRight' : 'zoomInLeft'}
                useNativeDriver={true}
                duration={900}
            >
                <View style={{ ...Styles.messageContainer, alignSelf: item.user === currentUserUid ? 'flex-end' : 'flex-start', }}>
                    {
                        item.user === otherUserHeaderUid.uid ?
                            headerImageLoader ?
                                <ActivityIndicator size='small' color={gray2} style={{ paddingHorizontal: wp(1) }} />
                                :
                                otherUserImage !== '' ?
                                    <Image
                                        source={{ uri: otherUserImage }}
                                        style={Styles.messageImage}
                                    />
                                    :
                                    <Image
                                        source={require('../../Assets/Images/user.png')}
                                        style={Styles.messageImage}
                                    />
                            : null
                    }
                    <TouchableOpacity style={{ ...Styles.messageView, backgroundColor: item.id === currentUserUid ? color4 : color0 }}
                        disabled={status === 'failed' ? false : true}
                        onPress={onTryAgain.bind(null, item)}
                    >

                        {
                            item.message.includes('$Image$')
                                || item.message.includes('https://firebasestorage.googleapis.com/v0/b/mapchat-b4252') ?
                                <View>
                                    <TouchableOpacity onPress={onImagePress.bind(null, item.message)}>
                                        <Image
                                            source={{ uri: item.message.includes('$Image$') ? item.message.split('$Image$')[0] : item.message }}
                                            style={Styles.imageMessage}
                                            resizeMethod='scale'
                                            resizeMode='cover'
                                        />
                                    </TouchableOpacity>
                                    {
                                        showImageSendProg && item.message.includes('$Image$') &&
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Progress.Bar progress={progressBarStatus} width={wp(30)} style={{ marginTop: hp(1.3), alignSelf: 'center' }}
                                                useNativeDriver
                                                height={3}
                                                color={theme}
                                                borderColor={gray3}
                                            />
                                            <Text style={Styles.imageMessageUploadText}>{progress}%</Text>
                                        </View>
                                    }
                                </View>
                                :
                                <Text style={{ ...Styles.message, color: item.user === currentUserUid ? white : black }}>
                                    {item.message}
                                </Text>
                        }
                        {
                            status === 'sending' ?
                                <View style={Styles.statusContainer}>
                                    <ActivityIndicator color={blue} size={wp(3.2)} />
                                    <Text style={Styles.sending}>Sending</Text>
                                </View>
                                : status === 'failed' ?
                                    <View style={Styles.statusContainer}>
                                        <Text style={{ ...Styles.sending, color: 'red' }}>Try again</Text>
                                    </View>
                                    :
                                    null
                        }
                    </TouchableOpacity>
                    {
                        item.user === currentUserUid ?

                            localUser && localUser.image && localUser.image !== '' ?
                                <Image source={{ uri: localUser.image }}
                                    style={Styles.messageImage}
                                />
                                :
                                <Image source={require('../../Assets/Images/user.png')}
                                    style={Styles.messageImage}
                                />
                            :
                            null
                    }
                </View>
            </Animatable.View >
        )
    }

    const renderEmptyMessagesList = () => (
        <View style={{ alignItems: 'center', paddingTop: hp(3) }}>
            {
                <Bullets
                    active
                    primaryColor={'rgba(220, 220, 220, 1)'}
                    secondaryColor={gray5}
                    animationDuration={900}
                    listSize={10}
                    loading={containerLoader}
                    containerStyles={{ paddingVertical: hp(1) }}
                />
            }
        </View>
    )

    const onEdit = () => {
        seteditHeaderData(currentUserHeaderUid.header)
        seteditPress(true)
    }
    const onChangeEdit = (text: any) => seteditHeaderData(text)
    const closeEdit = () => seteditPress(false)
    const onSubmitEdit = async () => {
        seteditLoader(true)
        await GFirebase.updateHeader(prevChatDetail, currentUserUid, editHeaderData)
            .then(() => {
                seteditLoader(false)
                seteditPress(false)
                setcurrentUserHeaderUid({ header: editHeaderData, uid: currentUserHeaderUid.uid })
            })
            .catch(() => {
                seteditLoader(false)
                seteditPress(false)
            })
    }

    return (
        <KeyboardAvoidingView
            //@ts-ignore
            behavior={Platform.OS === "ios" ? 'padding' : null}
            style={{ flex: 1 }}
        >
            {/* {Keyboard.dismiss()} */}
            <StatusBar barStyle='dark-content' />
            <View style={Styles.container}>
                <GHeader
                    left={
                        <TouchableOpacity style={Styles.headerContainer}
                            onPress={backAction}
                        >
                            {GIcons.left(fontSize.Chat.back, black, { marginTop: hp(0.4) })}
                            {
                                headerImageLoader ?
                                    <ActivityIndicator size='small' color={gray2} style={{ paddingHorizontal: wp(3) }} />
                                    :
                                    otherUserImage !== '' ?
                                        <Image
                                            source={{ uri: otherUserImage }}
                                            style={Styles.headerImage}
                                        />
                                        :
                                        <Image
                                            source={require('../../Assets/Images/user.png')}
                                            style={Styles.headerImage}
                                        />
                            }
                            {
                                editPress ?
                                    <TextInput
                                        value={editHeaderData}
                                        style={Styles.editHeaderInput}
                                        autoFocus
                                        onChangeText={onChangeEdit}
                                    />
                                    : editLoader ?
                                        <ActivityIndicator size='small' color={gray2} style={{ paddingHorizontal: wp(3) }} />
                                        :
                                        <Text style={Styles.headerText}>{currentUserHeaderUid.header}</Text>
                            }
                        </TouchableOpacity>
                    }
                    right={
                        editPress ?
                            <View style={Styles.editSubmitContainer}>
                                <TouchableOpacity style={Styles.editSubmitView}
                                    onPress={onSubmitEdit}
                                >
                                    {GIcons.ionIconsCheckMark(wp(5), 'green', {})}
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...Styles.editSubmitView, backgroundColor: 'rgba(224, 130, 131, 0.5)', }}
                                    onPress={closeEdit}
                                >
                                    {GIcons.ionIconsCloseO(wp(5), 'red', {})}
                                </TouchableOpacity>
                            </View>
                            : prevChatDetail.id !== '' &&
                            <TouchableOpacity style={Styles.editContainer}
                                onPress={onEdit}
                            >
                                <Text style={Styles.editText}>edit</Text>
                            </TouchableOpacity>
                    }
                    bgColor={white}
                />

                <FlatList
                    data={messages}
                    inverted
                    renderItem={renderMessages}
                    ItemSeparatorComponent={itemSeperator}
                    contentContainerStyle={Styles.chatContainer}
                    ListEmptyComponent={renderEmptyMessagesList}
                    keyExtractor={(item) => item.id}
                />

                <View style={Styles.inputContainer}>
                    <TouchableOpacity style={Styles.attachContainer}
                        onPress={onCameraPress}
                    >
                        {GIcons.camera(fontSize.Chat.attach, gray2, {})}
                    </TouchableOpacity>
                    <View style={Styles.inputView}>
                        <TextInput
                            value={message}
                            style={Styles.input}
                            placeholder="Write message"
                            placeholderTextColor={gray3}
                            onChangeText={onChangeMessage}
                            multiline
                            autoFocus={Platform.OS === 'ios' ? false : true}
                        />
                        {
                            message === '' ?
                                <Animatable.View
                                    animation={'flipInY'}
                                    useNativeDriver={true}
                                    duration={600}
                                >
                                    {GIcons.sendCircleOutLine(fontSize.Chat.send, gray3, { marginLeft: wp(2) })}
                                </Animatable.View>
                                :
                                <Animatable.View
                                    animation='flipInX'
                                    useNativeDriver={true}
                                    duration={600}
                                >
                                    <TouchableOpacity
                                        onPress={onSend.bind(null, message)}
                                        disabled={message === '' ? true : false}
                                    >
                                        {GIcons.sendCircle(fontSize.Chat.send, theme, { marginLeft: wp(2) })}
                                    </TouchableOpacity>

                                </Animatable.View>
                        }
                    </View>
                </View>
            </View>

            <ActionSheet
                ref={(o: any) => ActionSheetRef = o}
                title={'Select image from ?'}
                options={['Camra', 'Image Libaray', 'cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={2}
                onPress={(index: any) => { index === 0 ? onSelectCamera() : index === 1 ? onSelectImageLibaray() : null }}
            />
            <GImageView
                image={openImageData}
                isVisible={openImage}
                onClose={onImagePress}
            />

        </KeyboardAvoidingView>

    )
}

export default Chat
