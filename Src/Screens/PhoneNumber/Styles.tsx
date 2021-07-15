import { Dimensions, StyleSheet } from "react-native";
import { fontFamily, fontSize, hp, wp, GColor } from "../../Globals";

const { gray3, secondaryWhiteTwo } = GColor
const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondaryWhiteTwo,
        paddingTop: hp(4)
    },
    welcomeContainer: {
        alignItems: 'center',
        borderWidth: 0
    },
    welcome: {
        fontSize: fontSize.PhoneNumber.welcome,
        fontFamily: fontFamily.ProximaNova_Bold,
    },
    welcomeDis: {
        textAlign: 'center',
        maxWidth: wp(60),
        marginTop: hp(1.5),
        fontFamily: fontFamily.ProximaNova_Regular,
        fontSize: fontSize.PhoneNumber.welcomeDis
    },
    intialImage: {
        height: hp(30),
        width: wp(80),
        alignSelf: 'center',
        marginRight: wp(4)
    },
    countryDropDownContainer: {
        paddingTop: hp(4),
        borderWidth: 0,
        borderColor: 'red',
        alignItems: 'center',
    },
    countryDropDown: {
        borderBottomWidth: 1,
        borderBottomColor: gray3,
        paddingLeft: wp(3),
        paddingRight: wp(5),
        paddingVertical: hp(1),
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    countryText: {
        fontSize: fontSize.PhoneNumber.country,
        fontFamily: fontFamily.ProximaNova_Regular,
    },
    CodePhoneNumberContainer: {
        paddingTop: hp(5),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(11)
    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: hp(5),
    }
})