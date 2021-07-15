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
import { GAsyncStorage, GFirebase } from '../../Services';

const AddName = ({ navigation, route }: any) => {
    const [name, setname] = useState('')
    const [nameFocus, setnameFocus] = useState(false)
    const [nextLoader, setnextLoader] = useState(false)

    const { gray4, theme, gray5, secondaryWhiteTwo, black } = GColor
    const { btn, txt } = GButton
    const intialImage = require('../../Assets/Images/EnterPassword.gif')
    const handlenameFocus = () => setnameFocus(true)

    const onChangename = (text: any) => setname(text)
    const handleNext = async () => {
        Keyboard.dismiss()
        if(name === '') { GAlert.Alert('Please Enter your name', 'warning') }
        else {
            const user = await GAsyncStorage.getLocalData()
            user.name = name
            setnextLoader(true),
                await GFirebase.updateUser(user)
                    .then(() => {
                        setnextLoader(false)
                        navigation.navigate('AddProfileImage')
                    })
                    .catch(() => {
                        setnextLoader(false)
                    })
        }
    }
    return (
        <Animatable.View
            animation='zoomInRight'
            useNativeDriver={true}
            duration={500}
            style={Styles.container}
        >
            <StatusBar backgroundColor={secondaryWhiteTwo} barStyle='dark-content' />
            <View style={Styles.enterContainer}>
                <Image source={intialImage} style={Styles.intialImage} />
                <Text style={Styles.enterName}>Enter your name</Text>
            </View>
            <GHeader
                style={{ position: 'absolute' }}
                bgColor={'transparent'}
                back={true}
                navigation={navigation}
            />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
                <View style={Styles.nameInputContainer}>
                    <TextInput
                        style={{ ...GTextInput.input, width: wp(78), textAlign: 'center', borderColor: nameFocus ? theme : gray5 }}
                        value={name}
                        onChangeText={onChangename}
                        onFocus={handlenameFocus}
                    />
                </View>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={{ ...btn, width: wp(78) }} onPress={handleNext} >
                        {
                            nextLoader ?
                                <Text style={txt}>Updating...</Text>
                                : <Text style={txt}>Next</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </Animatable.View>
    )
}

export default AddName
