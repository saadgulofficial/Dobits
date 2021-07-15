import { Dimensions, StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import { fontFamily, fontSize, hp, wp, GColor } from "../../Globals";

const { gray2, secondaryWhiteTwo, theme, white, gray4, gray3, gray1, gray0 } = GColor
const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondaryWhiteTwo,
        paddingTop: hp(4)
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(47),
        borderWidth: 0
    },
    intialImage: {
        height: hp(33),
        width: wp(80),
        alignSelf: 'center',
        marginLeft: wp(1.5)
    },
    profileDis: {
        textAlign: 'center',
        fontFamily: fontFamily.ProximaNova_Medium,
        fontSize: fontSize.ProfileImage.profileDis,
        color: gray2
    },
    profileHeading: {
        fontSize: fontSize.ProfileImage.profileHeading,
        fontFamily: fontFamily.ProximaNova_Bold,
        marginTop: hp(1),
        textAlign: 'center',
    },
    imageCirlceView: {
        width: width * 0.47,
        height: width * 0.47 * 1,
        borderRadius: width * 0.47 * 1 / 2,
        borderWidth: 0.5,
        borderColor: gray4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: width * 0.465,
        height: width * 0.465 * 1,
        borderRadius: width * 0.465 * 1 / 2,
    },
    // useCameraLinear: {
    //     height: hp(6.5),
    //     borderRadius: 8,
    //     width: wp(48),
    //     alignItems: 'center',
    //     alignSelf: 'center'
    // },
    // useCamera: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    // },
    reSelect: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // useCameraText: {
    //     fontFamily: fontFamily.ProximaNova_Medium,
    //     fontSize: fontSize.ProfileImage.useCamera,
    //     color: white,
    //     marginTop: hp(0.6)
    // },
    buttonShadow: {
        shadowColor: theme,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    orContainer: {
        paddingVertical: hp(4),
        width: width,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wp(25)
    },
    or: {
        fontSize: fontSize.ProfileImage.or,
        color: gray3,
        fontFamily: fontFamily.ProximaNova_Regular
    },
    orLine: {
        borderWidth: 0.7,
        borderColor: gray4,
        width: wp(20)
    },
    selectImageContainer: {
        borderWidth: 0.7,
        borderColor: gray4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(10),
        width: wp(90),
        borderRadius: 8
    },
    selectImageView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(10),
        alignItems: 'center',
        width: wp(90),
    },
    selectImageDis: {
        fontSize: fontSize.ProfileImage.selectImageDis,
        fontFamily: fontFamily.ProximaNova_Medium,
        color: gray0,
    },
    pngText: {
        fontSize: fontSize.ProfileImage.pngText,
        fontFamily: fontFamily.ProximaNova_Regular,
        color: gray1
    },
    next: {
        fontSize: fontSize.ProfileImage.next,
        fontFamily: fontFamily.ProximaNova_Medium
    },
    UplodingText: {
        fontSize: fontSize.ProfileImage.uploading,
        fontFamily: fontFamily.ProximaNova_Medium
    }


})