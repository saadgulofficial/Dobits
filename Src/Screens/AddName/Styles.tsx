import { Dimensions, StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import { fontFamily, fontSize, hp, wp, GColor } from "../../Globals";

const { gray2, secondaryWhiteTwo, theme } = GColor
const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondaryWhiteTwo,
        paddingTop: hp(4)
    },
    enterContainer: {
        alignItems: 'center',
        borderWidth: 0
    },
    enterName: {
        fontSize: fontSize.PhoneNumber.welcome,
        fontFamily: fontFamily.ProximaNova_Bold,
    },
    intialImage: {
        height: hp(33),
        width: wp(80),
        alignSelf: 'center',
        marginLeft: wp(2.5)
    },
    nameInputContainer: {
        paddingTop: hp(3),
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: hp(3),
    }
})