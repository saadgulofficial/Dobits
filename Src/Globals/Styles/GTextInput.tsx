import { StyleSheet, Dimensions, Platform } from 'react-native'
import { fontFamily, fontSize, hp, wp, GColor } from '../index'
const { white, black, secondaryWhite, gray5 } = GColor

const GTextInput = StyleSheet.create({
    input: {
        borderWidth: 0.5,
        borderColor: gray5,
        paddingHorizontal: wp(4),
        paddingVertical: Platform.OS === 'ios' ? hp(1.3) : hp(0.8),
        fontSize: fontSize.textInput,
        fontFamily: fontFamily.ProximaNova_Regular,
        backgroundColor: '#fff',
        borderRadius: 8
    }
})

export { GTextInput }