import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Keyboard, ActivityIndicator, StatusBar, Image } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js'
//@ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import * as Animatable from 'react-native-animatable';

//Styles
import Styles from './Styles'

//Components
import CountriesData from '../../Components/CountryModal/Countries'
import CountryModal from '../../Components/CountryModal/CountryModal'
import { GAlert } from '../../Components/Index'

//Globals
import { GIcons, GColor, wp, GTextInput, GButton, fontSize } from '../../Globals/index'

//Services
import { GAsyncStorage, GFirebase } from '../../Services'


const PhoneNumber = ({ navigation }: any) => {
    const { setLocalData } = GAsyncStorage
    const [countryDetail, setcountryDetail] = useState<any>({
        name: "United States",
        flag: "🇺🇸",
        code: "US",
        dial_code: "+1"
    })
    const [dialCode, setdialCode] = useState('+1')
    const [phoneNumber, setphoneNumber] = useState('')
    const [countryModal, setcountryModal] = useState(false)
    const [nextLoader, setnextLoader] = useState(false)
    const [dialCodeFocus, setdialCodeFocus] = useState(true)
    const [validNumber, setvalidNumber] = useState(false)


    useEffect(() => {
        if(validNumber) {
            handleNext()
        }
    }, [validNumber])

    const { gray4, theme, gray5, secondaryWhiteTwo, themeRgba50 } = GColor
    const { btn, txt } = GButton
    const intialImage = require('../../Assets/Images/WalkingWoman.gif')
    const refPhoneNumber: any = useRef();
    const openCountryModal = () => { setcountryModal(true) }
    const closeCountryModal = () => { setcountryModal(false) }

    const handleSelectedCountry = (country: any) => {
        setcountryDetail({
            name: country.name, flag: country.flag,
            code: country.code, dial_code: country.dial_code
        })
        setdialCode(country.dial_code)
        setcountryModal(false)
        setnextLoader(false)
        setphoneNumber('')
        refPhoneNumber.current.focus()
    }

    const onChangeCode = (text: any) => {
        CountriesData.forEach((element: any) => {
            element.dial_code === text ?
                (setcountryDetail({
                    name: element.name, flag: element.flag,
                    code: element.code, dial_code: element.dial_code
                }),
                    refPhoneNumber.current.focus(),
                    setdialCodeFocus(false),
                    setphoneNumber('')
                ) : null
        })
        text === '' ? setdialCode('+')
            : dialCode.includes('+') ? setdialCode(text)
                : setdialCode('+' + text)

    }
    const onChangePhoneNumber = (text: any) => {
        const textNew = new AsYouType().input(dialCode + text)
        const formatedText = textNew.split(dialCode)[1]
        const check =
            dialCode !== '+86' ?
                isValidPhoneNumber(textNew, countryDetail.code)
                :
                textNew.length === 17 ? true : null
        if(check) { Keyboard.dismiss(); setvalidNumber(true) }
        else { setvalidNumber(false) }
        setphoneNumber(formatedText)
    }
    const handleDialCodeFocus = () => { setdialCodeFocus(true); setnextLoader(false) }
    const handlePhoneFocus = () => { setdialCodeFocus(false); setnextLoader(false) }

    const handleNext = async () => {
        var completePhoneNumber: any = ''
        var user: any = ''
        validNumber ? (
            setnextLoader(true),
            completePhoneNumber = dialCode + phoneNumber,
            user = { phoneNumber: completePhoneNumber },
            await setLocalData(user),
            await GFirebase.sendVerifyCode(completePhoneNumber)
                .then((res) => {
                    setnextLoader(false)
                    navigation.navigate('VerifyCode', { phoneNumber: dialCode + phoneNumber, confirmResult: res })
                })
                .catch(() => setnextLoader(false))
        ) :
            GAlert.Alert('Enter valid number', 'danger')
    }

    return (
        <Animatable.View
            animation='zoomIn'
            useNativeDriver={true}
            duration={500}
            style={Styles.container}
        >
            <StatusBar backgroundColor={secondaryWhiteTwo} barStyle='dark-content' />
            <View style={Styles.welcomeContainer}>
                <Image source={intialImage} style={Styles.intialImage} />
                <Text style={Styles.welcome}>Welcome to Dobits</Text>
                <Text style={Styles.welcomeDis}>Enter your Phone Number we will send you a 6 digit verification code</Text>
            </View>
            <View style={Styles.countryDropDownContainer}>
                <TouchableOpacity style={Styles.countryDropDown} onPress={openCountryModal}>
                    {GIcons.down(fontSize.PhoneNumber.down, 'black', { marginRight: wp(2) })}
                    <Text style={Styles.countryText}>{countryDetail.name}</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
                <View style={Styles.CodePhoneNumberContainer}>
                    <TextInput
                        style={{ ...GTextInput.input, width: wp(20), textAlign: 'center', borderColor: dialCodeFocus ? theme : gray5 }}
                        value={dialCode}
                        onChangeText={onChangeCode}
                        keyboardType='phone-pad'
                        onFocus={handleDialCodeFocus}
                    />
                    <TextInput
                        style={{ ...GTextInput.input, width: wp(56), borderColor: !dialCodeFocus ? theme : gray5 }}
                        value={phoneNumber}
                        placeholder={'Phone Number'}
                        placeholderTextColor={gray4}
                        onChangeText={onChangePhoneNumber}
                        ref={refPhoneNumber}
                        keyboardType='phone-pad'
                        onFocus={handlePhoneFocus}
                        maxLength={20}
                    />
                </View>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={{ ...btn, width: wp(78) }} onPress={handleNext} disabled={nextLoader} >
                        {
                            nextLoader ?
                                <Text style={txt}>Sending Verification code...</Text>
                                : <Text style={txt}>Next</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            {
                countryModal ?
                    <CountryModal
                        closeModal={closeCountryModal}
                        selectedCountry={handleSelectedCountry}
                    />
                    :
                    null
            }
        </Animatable.View>
    )
}

export default PhoneNumber
