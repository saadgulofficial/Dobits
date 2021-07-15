import { StyleSheet } from 'react-native'
import { fontFamily, hp, wp, GColor, fontSize } from '../index'
const { white, theme, gray0 } = GColor

const GButton = StyleSheet.create({

    btn: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.3),
        backgroundColor: theme,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },
    txt: {
        fontSize: fontSize.button,
        color: white,
        fontFamily: fontFamily.ProximaNova_Bold,
    },
    shdw: {
        shadowColor: gray0,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 0,
    },

    rowBtn: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.3),
        backgroundColor: theme,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderRadius: 8,
        flexDirection: 'row'
    }
})

export { GButton }