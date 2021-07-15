import { StyleSheet, Dimensions } from 'react-native'
import { fontFamily, hp, wp, fontSize } from '../index'
import { GColor } from '../Others/Theme'
const { white } = GColor
const GStyles = StyleSheet.create({
    headerText: {
        fontSize: fontSize.header,
        fontFamily: fontFamily.ProximaNova_Bold
    }
})
export { GStyles }