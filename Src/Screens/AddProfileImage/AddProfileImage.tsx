import React, { useState } from 'react'
import { View, Text, Image, StatusBar } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import storage from '@react-native-firebase/storage';

//Styles
import Styles from './Styles'

//Global
import { fontSize, GButton, GColor, GIcons, GStyles, hp, wp } from '../../Globals'

//Component
import { GAlert, GHeader } from '../../Components/Index'
import { GAsyncStorage, GFirebase } from '../../Services'
const { white, secondaryWhiteTwo, theme, rgba1, black, gray2, gray3 } = GColor
const { btn, rowBtn, txt } = GButton

const intialImage = require('../../Assets/Images/AddProfileImage.gif')

const AddProfileImage = ({ navigation }: any) => {
    const [image, setimage] = useState<any>({ path: '', uri: '' })
    const [nextLoader, setnextLoader] = useState(false)
    const [progress, setprogress] = useState(0)
    const [progressBarStatus, setprogressBarStatus] = useState(0)

    const handleSelectImage = () => {
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

    const handleCamera = () => {
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

    const handleReselect = () => {
        setimage({ path: '', uri: '' })
        setnextLoader(false)
    }
    const handleNext = async () => {
        setnextLoader(true)
        const user = await GAsyncStorage.getLocalData()
        let name = user.uid
        const reference = storage().ref(`/images/${name}`)
        const task = reference.putFile(image.path);
        task.on('state_changed', (taskSnapshot: any) => {
            //@ts-ignore
            const prog = parseInt((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
            setprogress(prog)
            const progressBar = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
            setprogressBarStatus(progressBar)
        })
        task.then(async () => {
            const url = await storage().ref(`/images/${name}`).getDownloadURL();
            const user = await GAsyncStorage.getLocalData()
            user.image = url
            await GFirebase.addUser(user)
                .then(() => {
                    setnextLoader(false)
                    GAlert.Alert('Uploaded', 'success')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                })
        })
            .catch((err: any) => {
                GAlert.Alert('Upload image Failed try again later', 'error')
                console.log('error while uploading Image from Sign up =>', err)
                setnextLoader(false)
                setprogress(0)
            })
    }
    return (
        <Animatable.View
            animation='zoomInRight'
            useNativeDriver={true}
            duration={500}
            style={Styles.container}
        >
            <StatusBar barStyle='dark-content' />
            <View style={Styles.profileContainer}>
                {
                    image.uri !== '' ?
                        <Animatable.View
                            animation='zoomIn'
                            useNativeDriver={true}
                            duration={800}
                            style={Styles.imageCirlceView}
                        >
                            <Image source={{ uri: image.uri }}
                                style={Styles.image}
                                resizeMethod='auto' resizeMode='cover' />
                        </Animatable.View>
                        :
                        <View>
                            <Image source={intialImage} style={Styles.intialImage} />
                            <Text style={Styles.profileDis}>You need to Upload your</Text>
                            <Text style={Styles.profileHeading}>Profile Image</Text>
                        </View>
                }
            </View>
            <GHeader
                bgColor={'transparent'}
                back={true}
                navigation={navigation}
                style={{ position: 'absolute', borderBottomWidth: 0 }}
            />
            <View style={Styles.buttonShadow} >
                {
                    image.uri === '' ?
                        <TouchableOpacity activeOpacity={0.8} onPress={handleCamera}>
                            <Animatable.View
                                animation={'zoomIn'}
                                useNativeDriver={true}
                                duration={800}
                                style={{ ...rowBtn, width: wp(40), paddingRight: wp(5) }}
                            >
                                {GIcons.camera(fontSize.ProfileImage.cameraIcon, white, { marginTop: hp(-0.3) })}
                                <Text style={txt}>Use Camera</Text>
                            </Animatable.View>
                        </TouchableOpacity>
                        :
                        <Animatable.View
                            animation={'zoomIn'}
                            useNativeDriver={true}
                            duration={800}
                            style={{ ...btn, width: wp(40) }}
                        >
                            <TouchableOpacity onPress={handleReselect} activeOpacity={0.8} style={Styles.reSelect}>
                                <Text style={txt}>Change</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                }
            </View>
            <View style={Styles.orContainer}>
                <View style={Styles.orLine} />
                <Text style={Styles.or}>or</Text>
                <View style={Styles.orLine} />
            </View>
            <View style={Styles.selectImageContainer}>
                {
                    image.uri === '' ?
                        <TouchableOpacity activeOpacity={0.8} onPress={handleSelectImage}>
                            <Animatable.View
                                animation='zoomIn'
                                useNativeDriver={true}
                                duration={800}
                                style={Styles.selectImageView}
                            >
                                {GIcons.image(fontSize.ProfileImage.imageIcon, gray2, {})}
                                <View>
                                    <Text style={Styles.selectImageDis}>Select the image from Gallery</Text>
                                    <Text style={Styles.pngText}>PNG or JPEG</Text>
                                </View>
                            </Animatable.View>
                        </TouchableOpacity>
                        :
                        <Animatable.View
                            animation={'zoomIn'}
                            useNativeDriver={true}
                            duration={800} >
                            <TouchableOpacity
                                onPress={handleNext}
                                disabled={nextLoader}
                                activeOpacity={0.8}
                                style={{ ...Styles.selectImageContainer }}
                            >
                                {
                                    nextLoader ?
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={Styles.UplodingText}>Uploding Profile Picture...   {progress}%</Text>
                                            <Progress.Bar progress={progressBarStatus} width={wp(70)} style={{ marginTop: hp(1.3) }}
                                                useNativeDriver
                                                height={3}
                                                color={theme}
                                                borderColor={gray3}
                                            />
                                        </View>
                                        :
                                        <Text style={Styles.next}>Next</Text>
                                }
                            </TouchableOpacity>
                        </Animatable.View>
                }
            </View>

        </Animatable.View>
    )
}


export default AddProfileImage
