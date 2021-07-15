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
    otpContainer: {
        alignItems: 'center',
        borderWidth: 0
    },
    otp: {
        fontSize: fontSize.PhoneNumber.welcome,
        fontFamily: fontFamily.ProximaNova_Bold,
    },
    otpDis: {
        textAlign: 'center',
        marginTop: hp(1.5),
        fontFamily: fontFamily.ProximaNova_Medium,
        fontSize: fontSize.VerifyCode.otpDis,
        color: gray2
    },
    otpDisContainer: {
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: wp(4)
    },
    intialImage: {
        height: hp(33),
        width: wp(80),
        alignSelf: 'center',
        marginLeft: wp(2.5)
    },
    otpInputContainer: {
        paddingVertical: hp(3),
        alignItems: 'center'
    },
    ResendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
    },
    resend: {
        marginTop: hp(1.5),
        fontFamily: fontFamily.ProximaNova_Bold,
        fontSize: fontSize.VerifyCode.otpDis,
        color: theme,
        marginLeft: wp(2)
    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: hp(3),
    }
})