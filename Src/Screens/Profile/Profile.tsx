import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Keyboard, ActivityIndicator, StatusBar, Image, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import ActionSheet from 'react-native-actionsheet'


//@ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';

//Styles
import Styles from './Styles'

//Components
import { GAlert, GHeader, Loader } from '../../Components/Index'

//Globals
import { GIcons, GColor, wp, GTextInput, GButton, fontSize, hp, GStyles, fontFamily, } from '../../Globals/index'
import { GAsyncStorage, GFirebase } from '../../Services';

const { gray4, theme, gray5, secondaryWhiteTwo, black, white, gray3 } = GColor

const Profile = ({ navigation }: any) => {
    var ActionSheetRef: any = useRef(null)
    const [containerLoader, setcontainerLoader] = useState<any>(true)
    const [localUser, setlocalUser] = useState<any>('')
    const [image, setimage] = useState<any>({ path: '', uri: '' })
    const [name, setname] = useState<any>('')
    const [updateLoader, setupdateLoader] = useState(false)
    const [progress, setprogress] = useState(0)
    const [progressBarStatus, setprogressBarStatus] = useState(0)
    const [signoutLoader, setsignoutLoader] = useState(false)


    useEffect(() => {
        async function getData() {
            await getLocalUser()
        }
        getData()
    }, [])


    const getLocalUser = async () => {
        const user = await GAsyncStorage.getLocalData()
        setlocalUser(user)
        setname(user.name)
        setcontainerLoader(false)
    }


    const onSelectCamera = () => {
        var options: any = {}
        launchCamera(options, async (res: any) => {
            if(res.didCancel) {
                console.log('User cancelled image picker');
            } else if(res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                const uri = res.uri
                const path = res.uri
                setimage({ path, uri })

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
                const uri = res.uri
                const path = res.uri
                setimage({ path, uri })

            }
        });
    }

    const onImagePress = () => ActionSheetRef.show()
    const onChangeText = (text: any) => setname(text)

    const hanldeUpdate = async () => {
        if(name === '') {
            GAlert.Alert('Please Enter your name', 'error')
        }
        else {
            setupdateLoader(true)
            var imageUrl: any = ''
            if(image.uri !== '') {
                await imageUpload().then(url => {
                    imageUrl = url
                })
                    .catch(err => {
                        setupdateLoader(false)
                        setprogress(0)
                    })
            }
            localUser.name = name
            localUser.image = imageUrl !== '' ? imageUrl : localUser.image
            await GFirebase.updateUser(localUser)
                .then(async res => {
                    setupdateLoader(false)
                    setprogress(100)
                    localUser.name = name
                    localUser.image = imageUrl !== '' ? imageUrl : localUser.image
                    await GAsyncStorage.setLocalData(localUser)
                    GAlert.Alert('Updated', 'success')
                })
                .catch(() => {
                    setupdateLoader(false)
                    setprogress(0)
                })
        }

    }


    const imageUpload = () => {
        return new Promise((resolve, reject) => {
            const user = localUser
            let imageName = user.uid
            const reference = storage().ref(`/images/${imageName}`)
            const task = reference.putFile(image.path);
            task.on('state_changed', (taskSnapshot: any) => {
                //@ts-ignore
                const prog = parseInt((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
                const progressBar = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                setprogressBarStatus(progressBar)
                setprogress(prog)
            })
            task.then(async () => {
                const url = await storage().ref(`/images/${imageName}`).getDownloadURL();
                resolve(url)
            })
                .catch((err: any) => {
                    GAlert.Alert('Update image Failed try again later', 'error')
                    console.log('error while updating Image =>', err)
                    reject()
                })
        })
    }



    const handleSignout = async () => {
        Alert.alert(
            "Sign out",
            "Are you sure you want to sign out",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {

                        setsignoutLoader(true)
                        await GFirebase.signout()
                            .then(async () => {
                                await GAsyncStorage.deleteLocalData().then(() => {
                                    setsignoutLoader(false)
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'PhoneNumber' }],
                                    });
                                })
                                    .catch(() => {
                                        setsignoutLoader(false)
                                    })
                            })
                            .catch(() => {
                                setsignoutLoader(false)
                            })


                    }
                }
            ]
        );


    }


    return (
        <View style={Styles.container}>
            <StatusBar backgroundColor={secondaryWhiteTwo} barStyle='dark-content' />
            <GHeader
                center={<Text style={GStyles.headerText}>Profile</Text>}
                bgColor={'transparent'}
                back={true}
                navigation={navigation}
            />
            {
                containerLoader ?
                    <Loader />
                    :
                    <Animatable.View
                        animation='zoomIn'
                        useNativeDriver={true}
                        duration={500}
                        style={{ alignItems: 'center' }}
                    >
                        <TouchableOpacity style={Styles.imageContainer} activeOpacity={0.7}
                            onPress={onImagePress}
                            disabled={true}
                        >
                            {
                                localUser && localUser.image && image.uri === '' ?
                                    <View style={Styles.imageCirlceView}>
                                        <Image source={{ uri: localUser.image }} style={Styles.image} />
                                    </View>
                                    :
                                    image.uri !== '' ?
                                        <View style={Styles.imageCirlceView}>
                                            <Image source={{ uri: image.uri }} style={Styles.image} />
                                        </View>
                                        :
                                        <View style={Styles.imageCirlceView}>
                                            <Image source={require('../../Assets/Images/user.png')} style={Styles.image} />
                                        </View>

                            }
                            {/* <View style={Styles.cameraIconView}>
                                {GIcons.cameraTwo(wp(6), white, {})}
                            </View> */}

                        </TouchableOpacity>
                        <View style={Styles.inputAndButtonContainer}>
                            <TextInput
                                value={name}
                                style={{ ...GTextInput.input, width: wp(70), textAlign: 'center' }}
                                onChangeText={onChangeText}
                            />
                            {
                                image.uri !== '' && updateLoader ?
                                    <View style={Styles.progressContainer}>
                                        <Text style={Styles.UplodingText}>Updating Profile Picture...   {progress}%</Text>
                                        <Progress.Bar progress={progressBarStatus} width={wp(68)} style={{ marginTop: hp(1.3) }}
                                            useNativeDriver
                                            height={3}
                                            color={theme}
                                            borderColor={gray3}
                                        />
                                    </View>
                                    : null
                            }
                            <TouchableOpacity style={{ ...GButton.btn, width: wp(70), marginVertical: hp(4) }}
                                onPress={hanldeUpdate}
                            >
                                {
                                    updateLoader ?
                                        <Text style={GButton.txt}>Updating...</Text>
                                        : <Text style={GButton.txt}>Update</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity style={{ ...GButton.btn, width: wp(70) }}
                                onPress={handleSignout}
                            >
                                {
                                    signoutLoader ?
                                        <Text style={GButton.txt}>Signing out...</Text>
                                        : <Text style={GButton.txt}>Sign out</Text>}
                            </TouchableOpacity>

                        </View>

                        <ActionSheet
                            ref={(o: any) => ActionSheetRef = o}
                            title={'Select image from ?'}
                            options={['Camra', 'Image Libaray', 'cancel']}
                            cancelButtonIndex={2}
                            destructiveButtonIndex={2}
                            onPress={(index: any) => { index === 0 ? onSelectCamera() : index === 1 ? onSelectImageLibaray() : null }}
                        />
                    </Animatable.View>
            }
        </View>
    )
}

export default Profile
