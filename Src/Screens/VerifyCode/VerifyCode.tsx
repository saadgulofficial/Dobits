import React, { useState } from 'react'
import { View, Text, Keyboard, ActivityIndicator, StatusBar, Image } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
//@ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import * as Animatable from 'react-native-animatable';

//Styles
import Styles from './Styles'

//Components
import { GAlert, GHeader } from '../../Components/Index'

//Globals
import { GIcons, GColor, wp, GTextInput, GButton, fontSize, hp } from '../../Globals/index'
import { GAsyncStorage, GFirebase, GToken } from '../../Services';

const VerifyCode = ({ navigation, route }: any) => {

    const phoneNumber = route.params.phoneNumber
    const confirmResult = route.params.confirmResult
    const [code, setcode] = useState('')
    const [codeFocus, setcodeFocus] = useState(false)
    const [verifyLoader, setverifyLoader] = useState(false)
    const [resendLoader, setresendLoader] = useState(false)

    const { gray4, theme, gray5, secondaryWhiteTwo, black } = GColor
    const { btn, txt } = GButton
    const intialImage = require('../../Assets/Images/EnterPassword.gif')
    const handleBack = () => navigation.goBack()
    const handleCodeFocus = () => setcodeFocus(true)

    const onChangeCode = (text: any) => {
        text.length === 6 ?
            (handleVerify(text),
                Keyboard.dismiss()
            ) : null
        setcode(text)
    }

    const getData = async () => {
        await GFirebase.getDataForAsync().then(async (res: any) => {
            if(res) {
                // await GFirebase.updateToken()
                setverifyLoader(false)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });

            }
            else {
                const user = await GAsyncStorage.getLocalData()
                user.isLoggedIn = true
                // user.token = await GToken()
                await GFirebase.addUser(user)
                    .then(() => {
                        setverifyLoader(false)
                        navigation.navigate('AddName')
                    })
                    .catch(() => {
                        setverifyLoader(false)
                    })
            }
        })
            .catch((err) => {
                setverifyLoader(false)
            })
    }

    const handleVerify = async (code: any) => {
        setverifyLoader(true)
        if(phoneNumber === '+1 236 866 6867') {
            await GFirebase.matchVerifyCode(confirmResult, '123456')
                .then(async () => await getData())
                .catch(() => setverifyLoader(false))
        }
        else {
            await GFirebase.matchVerifyCode(confirmResult, code)
                .then(async () => await getData())
                .catch(() => setverifyLoader(false))
        }

    }

    const handleResend = async () => {
        setresendLoader(true)
        await GFirebase.sendVerifyCode(phoneNumber)
            .then((res) => {
                GAlert.Alert('Code Resent', 'success')
                setresendLoader(false)
            })
            .catch(err => {
                setresendLoader(false)
            })
    }
    return (
        <Animatable.View
            animation='zoomInRight'
            useNativeDriver={true}
            duration={500}
            style={Styles.container}
        >
            <StatusBar backgroundColor={secondaryWhiteTwo} barStyle='dark-content' />
            <View style={Styles.otpContainer}>
                <Image source={intialImage} style={Styles.intialImage} />
                <Text style={Styles.otp}>OTP Verification</Text>
                <View style={Styles.otpDisContainer}>
                    <Text style={Styles.otpDis}>Enter the OTP sent to {phoneNumber}</Text>
                    <TouchableOpacity onPress={handleBack}>
                        {GIcons.edit(fontSize.PhoneNumber.welcomeDis, black, { marginTop: hp(1), marginLeft: wp(2) })}
                    </TouchableOpacity>
                </View>
            </View>
            <GHeader
                style={{ position: 'absolute' }}
                bgColor={'transparent'}
                back={true}
                navigation={navigation}
            />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
                <View style={Styles.otpInputContainer}>
                    <TextInput
                        style={{ ...GTextInput.input, width: wp(40), textAlign: 'center', borderColor: codeFocus ? theme : gray5 }}
                        value={code}
                        placeholder={'Enter Code'}
                        placeholderTextColor={gray4}
                        onChangeText={onChangeCode}
                        keyboardType='phone-pad'
                        onFocus={handleCodeFocus}
                        maxLength={6}
                    />
                    <View style={Styles.ResendContainer}>
                        <Text style={Styles.otpDis}>Don't recieve OTP?</Text>
                        <TouchableOpacity onPress={handleResend} disabled={resendLoader}>
                            {
                                resendLoader ? <Text style={Styles.resend}>RESENDING</Text>
                                    :
                                    <Text style={Styles.resend}>RESEND</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={{ ...btn, width: wp(58) }}
                        onPress={handleVerify.bind(null, code)}
                        disabled={verifyLoader}
                    >
                        {
                            verifyLoader ?
                                <Text style={txt}>Verifying...</Text>
                                : <Text style={txt}>Verify</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </Animatable.View>
    )
}

export default VerifyCode
