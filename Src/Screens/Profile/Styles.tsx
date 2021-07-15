import { Dimensions, StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import { fontFamily, fontSize, hp, wp, GColor } from "../../Globals";

const { gray2, secondaryWhiteTwo, theme, gray4 } = GColor
const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondaryWhiteTwo,
    },
    imageContainer: {
        marginVertical: hp(5),
        alignSelf: 'center',
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
    cameraIconView: {
        position: 'absolute',
        right: wp(6),
        bottom: hp((0.7)),
        backgroundColor: theme,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.1,
        height: width * 0.1 * 1,
        borderRadius: width * 0.1 * 1 / 2,
    },
    inputAndButtonContainer: {
        alignItems: 'center',
    },
    progressContainer: {
        borderWidth: 0,
        marginTop: hp(2),
        marginBottom: hp(-2),
        width: wp(70),
        paddingVertical: hp(3)
    },
    UplodingText: {
        fontSize: fontSize.ProfileImage.uploading,
        fontFamily: fontFamily.ProximaNova_Medium
    }
})