import React, { useState, useEffect, useRef, useReducer, LegacyRef } from 'react'
import { View, Text, Dimensions, PermissionsAndroid, Platform, TouchableWithoutFeedback, AppState, TouchableOpacity, Keyboard, StatusBar, Image, Alert, TouchableHighlight } from 'react-native'
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE, Callout, } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import { FlatList, ScrollView, TextInput, } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu'
import MenuDrawer from 'react-native-side-drawer'
import Conversations from '../Conversations/Conversations'
import ShowMessage from '../../Services/Notifications/Foreground'
import { Notification } from "react-native-in-app-message";
import messaging from '@react-native-firebase/messaging';

//Styles
import Styles from './Styles'

//Components
import { GAlert, Loader, useForceUpdate } from '../../Components/Index';

//Globals
import { fontSize, GColor, GIcons, wp, hp, GButton } from '../../Globals';
import { GFirebase, GCommon, GAsyncStorage } from '../../Services';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/core';

const Home = ({ navigation }: any) => {
    var marker: any = useRef(null)
    //@ts-ignore
    global.NRef = useRef(null)
    const map: LegacyRef<MapView> = useRef(null);
    const mapMarker = require('../../Assets/Images/mapMarker.png')
    const mapMarkerHighlight = require('../../Assets/Images/mapMarkerHighlight.png')
    const markerAddEvent = require('../../Assets/Images/markerAddEvent.png')


    const { gray0, white, secondaryWhite, themeRgba80, theme, color3, color5, color6, color7 } = GColor
    const { btn, txt } = GButton
    const { plus, closeCircle } = GIcons
    const { width, height } = Dimensions.get("window")

    const ASPECT_RATIO = width / height;
    const LATITUDE = 37.78825;
    const LONGITUDE = -122.4324;
    const LATITUDE_DELTA: any = 0.0922;
    const LONGITUDE_DELTA: any = LATITUDE_DELTA * ASPECT_RATIO;


    const [latitudeDelta, setlatitudeDelta] = useState(0.0922)
    const [longitudeDelta, setlongitudeDelta] = useState(LONGITUDE_DELTA)
    const [latitude, setlatitude] = useState(LATITUDE)
    const [longitude, setlongitude] = useState(LONGITUDE)

    const [containerLoader, setcontainerLoader] = useState(true)
    const [addEventModal, setaddEventModal] = useState(false)
    const [showEventModal, setshowEventModal] = useState(false)
    const [showMyEventModal, setshowMyEventModal] = useState(false)
    const [showEventModalData, setshowEventModalData] = useState<any>('')
    const [showMyEventModalData, setshowMyEventModalData] = useState<any>('')
    const [clickedMarker, setclickedMarker] = useState<any>('')
    const [addEventDis, setaddEventDis] = useState('')
    const [submitLoader, setsubmitLoader] = useState(false)
    const [userUid, setuserUid] = useState<any>('')
    const [removeLoader, setremoveLoader] = useState(false)
    const [markerArray, setmarkerArray] = useState<any>([])
    const [sideMenu, setsideMenu] = useState(false)
    const [keyboardVisible, setkeyboardVisible] = useState(false)
    const [currentUserEvents, setcurrentUserEvents] = useState<any>([])
    const [showMyEventUpdate, setshowMyEventUpdate] = useState(false)
    const [updateLoader, setupdateLoader] = useState(false)
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);


    const [currentLocation, setcurrentLocation] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })

    const [coordinate] = useState(new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
    }))


    useEffect(() => {
        async function updateToken() {
            await GAsyncStorage.getLocalData().then(async (localUser: any) => {
                if(localUser.phoneNumber !== '+1 236 866 6867') {
                    await messaging().requestPermission();
                    await GFirebase.updateToken()
                }
            })
        }
        updateToken()
    }, [])


    useEffect(() => {
        //This will run when app kills from background
        //@ts-ignore
        const messageData = global.remoteMessage
        //@ts-ignore
        if(messageData) {
            navigation.navigate('Chat', { chatInitalDetail: messageData.conv, fromHome: true })
        }
    }, [])

    const _handleAppStateChange = (nextAppState: any) => {

        setshowEventModal(false)
        setshowMyEventModal(false)
        setaddEventModal(false)

        //This will run when app is in background
        if(
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            //@ts-ignore
            const messageData = global.remoteMessage
            if(messageData) {
                navigation.navigate('Chat', { chatInitalDetail: messageData.conv, fromHome: true })
            }
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    }


    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);


    const getPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            //@ts-ignore
            {
                title: 'Location Permission',
                message: 'We need to know your location in order to continue',
            },
        );
        return granted
    }



    const getCurrentLocation = async () => {
        if(latitude === LATITUDE && longitude === LONGITUDE) {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newCoordinate: any = {
                        latitude,
                        longitude
                    };
                    if(Platform.OS === "android") {
                        // console.log('marker =>', marker)
                        // if(marker) {
                        //     markerState._component.animateMarkerToCoordinate(
                        //         newCoordinate,
                        //         500 // 500 is the duration to animate the marker
                        //     )
                        // }
                    } else {
                        coordinate.timing(newCoordinate).start();
                    }
                    setlongitude(longitude)
                    setlatitude(latitude)
                    setcurrentLocation({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    })
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 }
            )
        }
    }

    const keyboardDidShow = () => setkeyboardVisible(true)
    const keyboardDidHide = () => setkeyboardVisible(false)

    const getMapRegion = () => ({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
    })


    const onRegionChange = (newRegion: any) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = newRegion;
        setlongitudeDelta(longitudeDelta)
        setlatitudeDelta(latitudeDelta)
        setlatitude(latitude)
        setlongitude(longitude)
    }



    const handleSideMenu = () => setsideMenu(sideMenu ? false : true)
    const closeSideMenu = () => setsideMenu(false)
    const closeShowEvent = () => setshowEventModal(false)
    const closeAddEventModal = () => setaddEventModal(false)
    const closeShowMyEventModal = () => {
        setshowMyEventModal(false)
        setupdateLoader(false)
        setshowMyEventUpdate(false)
    }
    const openAddEventModal = () => setaddEventModal(true)
    const openShowEventModal = (element: any) => {
        element.userUid === userUid ?
            (
                setshowMyEventModal(true),
                setshowMyEventModalData(element),
                setclickedMarker(element)
            ) :
            (
                setshowEventModalData(element),
                setshowEventModal(true),
                setclickedMarker(element)
            )
    }
    const handleShowEventMessage = () => {
        setshowEventModal(false)
        const { discription, id } = showEventModalData

        const header = discription.split(' ').slice(0, 3).join(' ')
        const chatInitalDetail = {
            eventId: id,
            user1: { uid: userUid, header: header },
            user2: { uid: showEventModalData.userUid, header: header }
        }
        navigation.navigate('Chat', { chatInitalDetail: chatInitalDetail, fromHome: true })

    }
    const handleSubmit = async () => {
        const { latitude, longitude } = currentLocation
        var userEvents = currentUserEvents
        var eventToUpload: any = ''
        if(userEvents.length === 0) {
            setsubmitLoader(true)
            const event = {
                latitude: latitude,
                longitude: longitude,
                userUid: userUid,
                id: 'id-' + GCommon.getTimeStamp(),
                discription: addEventDis,
                title: 'Can you help me'
            }
            eventToUpload = event
            userEvents.push(event)
            markerArray.push(event)
        }
        else if(userEvents.length === 1) {
            setsubmitLoader(true)
            const event = {
                // latitude: latitude + 0.002,
                // longitude: longitude + 0.002,
                latitude: latitude + 0.0001,
                longitude: longitude + 0.0001,
                userUid: userUid,
                id: 'id-' + GCommon.getTimeStamp(),
                discription: addEventDis,
                title: 'Can you help me'
            }
            userEvents.push(event)
            eventToUpload = event
            markerArray.push(event)
        }
        else if(userEvents.length === 2) {
            setsubmitLoader(true)
            const event = {
                latitude: latitude + 0.00015,
                longitude: longitude + 0.00015,
                userUid: userUid,
                id: 'id-' + GCommon.getTimeStamp(),
                discription: addEventDis,
                title: 'Can you help me'
            }
            userEvents.push(event)
            eventToUpload = event
            markerArray.push(event)
        }
        else if(userEvents && userEvents.length === 3) {
            GAlert.Alert('Already 3 Events Added Remove previous one first', 'warning')
        }


        if(eventToUpload !== '') {
            await GFirebase.addEvent(eventToUpload)
                .then(() => {
                    GAlert.Alert('Event Submitted', 'success')
                    setaddEventModal(false)
                    setmarkerArray(markerArray)
                    setcurrentUserEvents(userEvents)
                    setaddEventDis('')
                    setsubmitLoader(false)
                })
                .catch(async (err) => {
                    const newData = removeArrayElement(userEvents, eventToUpload)
                    await GAsyncStorage.setLocalEvents(newData)
                    setsubmitLoader(false)
                    setaddEventModal(false)
                    setmarkerArray(markerArray)
                    setcurrentUserEvents(currentUserEvents)
                    setaddEventDis('')
                })
        }
    }

    const onChangeAddEventDis = (text: any) => {
        setaddEventDis(text)
    }

    const onChangeUpdateEvent = (text: any) => {
        setshowMyEventModalData((prevState: any) => {
            return { ...prevState, discription: text }
        });
        showMyEventUpdate ? null : setshowMyEventUpdate(true)

    }

    const handleUpdate = async () => {
        const event = showMyEventModalData
        setupdateLoader(true)
        await GFirebase.updateEvent(event).then(() => {
            markerArray.forEach((element: any, index: any) => {
                if(element.id === event.id) {
                    markerArray[index] = event
                }
            });
        })

        setmarkerArray(markerArray)
        setupdateLoader(false)
        setshowMyEventUpdate(false)
        setshowMyEventModal(false)
        forceUpdate

    }

    const removeArrayElement = (arr: any, item: any) => {
        for(var i = arr.length; i--;) {
            if(arr[i].id === item.id) {
                arr.splice(i, 1);
                return arr
            }
        }
    }

    const handleRemove = async () => {
        setremoveLoader(true)
        await GFirebase.deleteEvent(clickedMarker).then(async () => {
            const newMarkerArray = removeArrayElement(markerArray, clickedMarker)
            const newCurrentUserEvents = removeArrayElement(currentUserEvents, clickedMarker)
            setmarkerArray(newMarkerArray)
            setcurrentUserEvents(newCurrentUserEvents)
            GAlert.Alert('Event Deleted', 'success')
            setshowMyEventModal(false)
            setremoveLoader(false)
        })
            .catch(err => {
                setshowMyEventModal(false)
                setremoveLoader(false)
            })
    }
    var mapStyle = [
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": color5
                },
                {
                    "lightness": 30
                },
                {
                    "weight": 2
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": color5
                }
            ]
        }
    ]


    useEffect(() => {
        var keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        var keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [])

    useEffect(() => {
        async function user() {
            await GFirebase.currentUserUid().then((uid: any) => {
                setuserUid(uid)
            })
        }
        user()
    }, [userUid])

    useEffect(() => {
        async function fetchData() {
            await GFirebase.getEvents().then((res: any) => {
                const { allUsersdata, currentUserData } = res
                setmarkerArray(allUsersdata)
                setcurrentUserEvents(currentUserData)
                setcontainerLoader(false)
            })
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function getLoc() {
            if(Platform.OS === 'android') {
                const getPer: any = await getPermission()
                if(getPer === 'granted') {
                    await getCurrentLocation()
                }
                else {
                    GAlert.Alert('We need to know your location', 'info')
                }
            }
            else {
                await getCurrentLocation()
            }
        }
        getLoc()
    }, [])



    const menu = <View style={{
        flex: 1, marginTop: Math.round(height) < 685 ? 0
            : Platform.OS === 'android' ? hp(-6) : 0
    }}>
        {
            sideMenu &&
            <Conversations navigation={navigation} />
        }
    </View>
    return (
        <View style={{
            ...Styles.containerBeforeDrawer,
            marginTop: Math.round(height) < 685 ? 0
                : Platform.OS === 'android' ? hp(5) : 0
        }}>
            <Notification
                //@ts-ignore
                ref={global.NRef}
                autohide={true}
                duration={2500}
                customComponent={<ShowMessage navigation={navigation} />}
                style={{ backgroundColor: 'transparent', width: wp(80), borderRadius: 30, marginTop: hp(2) }}
                showKnob={false}
                onPress={() => { }}
            />
            <MenuDrawer
                open={sideMenu}
                drawerContent={menu}
                drawerPercentage={80}
                animationTime={250}
                position='right'
                overlay={true}
                opacity={Platform.OS === 'android' ? 0.4 : 1}
            >
                <StatusBar translucent backgroundColor='transparent' barStyle="dark-content" />
                {
                    containerLoader ?
                        <Loader />
                        :
                        <TouchableWithoutFeedback disabled={!sideMenu} onPress={closeSideMenu}>

                            <View style={Styles.container}>
                                <MapView
                                    ref={map}
                                    style={Styles.map}
                                    showsUserLocation={true}
                                    followsUserLocation
                                    loadingEnabled
                                    region={getMapRegion()}
                                    onRegionChangeComplete={onRegionChange}
                                    scrollEnabled
                                    mapType={'standard'}
                                    loadingBackgroundColor={secondaryWhite}
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={mapStyle}
                                    showsMyLocationButton={false}
                                    zoomEnabled
                                    rotateEnabled={false}
                                    moveOnMarkerPress={false}
                                    onPress={() => Platform.OS === 'ios' ? sideMenu && setsideMenu(false) : null}
                                >
                                    {
                                        //@ts-ignore
                                        // <Marker.Animated
                                        //     ref={marker}
                                        //     coordinate={coordinate}
                                        // />
                                    }
                                    {
                                        markerArray.length !== 0 ?
                                            markerArray.map((element: any, index: any) => (
                                                element.latitude && element.longitude ?
                                                    <Marker
                                                        key={index}
                                                        coordinate={{ latitude: element.latitude, longitude: element.longitude }}
                                                        onPress={openShowEventModal.bind(null, element)}
                                                    >
                                                        {
                                                            clickedMarker.id === element.id ?
                                                                <Image
                                                                    source={mapMarkerHighlight}
                                                                    style={Styles.mapMarker}
                                                                />
                                                                :
                                                                element.userUid === userUid ?
                                                                    <Image
                                                                        source={markerAddEvent}
                                                                        style={Styles.mapMarker}
                                                                    />
                                                                    :
                                                                    <Image
                                                                        source={mapMarker}
                                                                        style={Styles.mapMarker}
                                                                    />
                                                        }

                                                    </Marker>
                                                    : null
                                            ))
                                            : null
                                    }
                                </MapView>

                                <View style={Styles.menuContainer}>
                                    <TouchableOpacity style={Styles.menuIcon} onPress={handleSideMenu}>
                                        {GIcons.menu(fontSize.Home.menuIcon, gray0, {})}
                                    </TouchableOpacity>

                                </View>
                                <Animatable.View
                                    animation='zoomIn'
                                    useNativeDriver={true}
                                    duration={500}
                                    style={Styles.plusContainer}
                                >
                                    <TouchableOpacity style={Styles.plusCirlce}
                                        onPress={openAddEventModal}
                                    >
                                        {plus(fontSize.Home.plusCircle, white, {})}
                                    </TouchableOpacity>

                                </Animatable.View>

                                <Modal
                                    isVisible={addEventModal}
                                    hasBackdrop={false}
                                    animationIn='zoomIn'
                                    animationOut='zoomOut'
                                    animationInTiming={300}
                                    animationOutTiming={300}
                                    useNativeDriver={true}
                                    onBackButtonPress={closeAddEventModal}
                                    avoidKeyboard={false}
                                >
                                    <TouchableWithoutFeedback onPress={closeAddEventModal}>
                                        <View style={{
                                            ...Styles.showEventModalContainer,
                                            paddingBottom: Platform.OS === 'ios' && keyboardVisible ? hp(30) : 0
                                        }}>
                                            <View style={{ ...Styles.showEventContainer, backgroundColor: themeRgba80 }}>
                                                <View style={Styles.showEventTitleContainer}>
                                                    <Text style={Styles.showEventTitle}>Can you help me</Text>
                                                </View>
                                                <TextInput
                                                    style={{ ...Styles.showEventDisContainer, ...Styles.showEventDis, textAlignVertical: 'top', paddingHorizontal: wp(6) }}
                                                    placeholder="do something in exchange for..."
                                                    placeholderTextColor='lightgray'
                                                    value={addEventDis}
                                                    onChangeText={onChangeAddEventDis}
                                                    multiline
                                                    selectionColor={white}
                                                />
                                                <TouchableOpacity style={{ ...Styles.showEventMessageButton, backgroundColor: color3, }}
                                                    onPress={handleSubmit}
                                                    disabled={addEventDis === '' || submitLoader ? true : false}
                                                >
                                                    {
                                                        submitLoader ?
                                                            <Text style={{ ...Styles.showEventMessage, color: theme }}>Submitting...</Text>
                                                            : <Text style={{ ...Styles.showEventMessage, color: theme }}>Submit</Text>
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>


                                <Modal
                                    isVisible={showMyEventModal}
                                    hasBackdrop={false}
                                    animationIn='zoomIn'
                                    animationOut='zoomOut'
                                    animationInTiming={300}
                                    animationOutTiming={300}
                                    useNativeDriver={true}
                                    onBackButtonPress={closeShowMyEventModal}
                                >
                                    <TouchableWithoutFeedback onPress={closeShowMyEventModal}>
                                        <View style={{
                                            ...Styles.showEventModalContainer,
                                            paddingBottom: Platform.OS === 'ios' && keyboardVisible ? hp(30) : 0
                                        }}>
                                            <View style={{ ...Styles.showEventContainer, backgroundColor: themeRgba80 }}>
                                                <View style={Styles.showEventTitleContainer}>
                                                    <Text style={Styles.showEventTitle}>Can you help me</Text>
                                                </View>
                                                {/* <View style={Styles.showEventDisContainer}>
                                                    <ScrollView>
                                                        <Text style={Styles.showEventDis}>{showMyEventModalData.discription}</Text>
                                                    </ScrollView>
                                                </View> */}
                                                <TextInput
                                                    style={{ ...Styles.showEventDisContainer, ...Styles.showEventDis, textAlignVertical: 'top', paddingHorizontal: wp(6) }}
                                                    value={showMyEventModalData.discription}
                                                    onChangeText={onChangeUpdateEvent}
                                                    multiline
                                                    selectionColor={white}
                                                />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <TouchableOpacity style={{
                                                        ...Styles.showEventMessageButton,
                                                        backgroundColor: color6,
                                                        marginVertical: hp(0),
                                                        marginHorizontal: wp(5),
                                                        alignSelf: 'flex-start'
                                                    }}
                                                        onPress={handleRemove}
                                                        disabled={removeLoader}
                                                    >
                                                        {removeLoader ?
                                                            <Text style={Styles.removeButton}>Removing</Text> :
                                                            <Text style={Styles.removeButton}>Remove</Text>
                                                        }
                                                    </TouchableOpacity>
                                                    {
                                                        showMyEventUpdate ?
                                                            <TouchableOpacity style={{
                                                                ...Styles.showEventMessageButton,
                                                                backgroundColor: color3,
                                                                marginVertical: hp(0),
                                                                marginHorizontal: wp(5),
                                                            }}
                                                                onPress={handleUpdate}
                                                                disabled={updateLoader}
                                                            >
                                                                {
                                                                    updateLoader ?
                                                                        <Text style={{ ...Styles.showEventMessage, color: theme }}>Updating...</Text>
                                                                        : <Text style={{ ...Styles.showEventMessage, color: theme }}>Update</Text>
                                                                }
                                                            </TouchableOpacity>
                                                            : null
                                                    }
                                                </View>

                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>



                                <Modal
                                    isVisible={showEventModal}
                                    hasBackdrop={false}
                                    animationIn='zoomIn'
                                    animationOut='zoomOut'
                                    animationInTiming={300}
                                    animationOutTiming={300}
                                    useNativeDriver={true}
                                    onBackButtonPress={closeShowEvent}
                                >
                                    <TouchableWithoutFeedback onPress={closeShowEvent}>
                                        <View style={Styles.showEventModalContainer}>
                                            <View style={Styles.showEventContainer}>
                                                <View style={Styles.showEventTitleContainer}>
                                                    <Text style={Styles.showEventTitle} numberOfLines={3}>Can you help me</Text>
                                                </View>
                                                <View style={Styles.showEventDisContainer}>
                                                    <ScrollView>
                                                        <Text style={Styles.showEventDis}>{showEventModalData.discription}</Text>
                                                    </ScrollView>
                                                </View>
                                                <TouchableOpacity style={Styles.showEventMessageButton} onPress={handleShowEventMessage}>
                                                    <Text style={Styles.showEventMessage}>Message</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            </View>
                        </TouchableWithoutFeedback>
                }
            </MenuDrawer>
        </View>
    )
}

export default Home
