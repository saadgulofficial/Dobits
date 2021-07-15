import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors } from "react-native-elements";
import { wp, GColor, hp, fontFamily, fontSize } from "../../Globals";

const { white, secondaryWhite, gray4, gray0, gray3, color0, theme, black, color10, blue } = GColor
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        borderWidth: 0,
        backgroundColor: secondaryWhite,
        flex: 10,
        // height: hp(100)
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(70),
        borderWidth: 0
    },
    headerImage: {
        width: width * 0.10,
        height: width * 0.10 * 1,
        borderRadius: width * 0.10 * 1 / 2,
        marginRight: wp(2),
    },
    headerText: {
        fontSize: fontSize.Chat.header,
        fontFamily: fontFamily.ProximaNova_Bold
    },
    editHeaderInput: {
        fontSize: fontSize.Chat.header,
        fontFamily: fontFamily.ProximaNova_Bold,
        borderBottomWidth: 2,
        width: wp(50)
    },
    editSubmitContainer: {
        width: wp(25),
        paddingTop: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(2),
        alignItems: 'center'
    },
    editSubmitView: {
        width: width * 0.08,
        height: width * 0.08 * 1,
        borderRadius: width * 0.08 * 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(123, 239, 178, 0.5)',
    },
    chatContainer: {
        // flex: 1,
        borderWidth: 0,
        paddingTop: hp(1),
    },
    messageContainer: {
        borderWidth: 0,
        paddingVertical: hp(0.3),
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    messageView: {
        borderRadius: 15,
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.7),
        maxWidth: wp(70),
    },
    message: {
        fontSize: fontSize.Chat.message,
        fontFamily: fontFamily.ProximaNova_Regular
    },
    messageImage: {
        width: width * 0.07,
        height: width * 0.07 * 1,
        borderRadius: width * 0.07 * 1 / 2,
        marginHorizontal: wp(1.4),
        marginVertical: hp(0.2)
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingRight: wp(5),
        paddingBottom: hp(1.5),
        alignItems: 'center'
    },
    attachContainer: {
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(12),
        paddingVertical: hp(1)
    },
    inputView: {
        width: wp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(1),
        borderRadius: 30,
        backgroundColor: white,
        borderWidth: 1,
        borderColor: gray4,
        maxHeight: hp(17),
    },
    input: {
        width: wp(67),
        paddingVertical: Platform.OS === 'android' ? hp(1) : 0,
        paddingTop: Platform.OS === 'android' ? hp(1.3) : 0,
        paddingHorizontal: wp(3),
        fontSize: fontSize.Chat.message,
        fontFamily: fontFamily.ProximaNova_Regular,
        maxHeight: hp(17)
    },
    editContainer: {
        marginTop: hp(1.2),
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.4),
        borderRadius: 30,
        backgroundColor: color10,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(18)
    },
    editText: {
        fontSize: fontSize.Chat.edit,
        fontFamily: fontFamily.ProximaNova_Regular,
        color: black
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sending: {
        fontSize: wp(3.2),
        color: blue,
        fontFamily: fontFamily.ProximaNova_Regular,
        marginHorizontal: wp(1)
    },
    imageMessage: {
        width: width * .2,
        aspectRatio: 1,
        height: hp(20),
        borderRadius: 10,
        alignSelf: 'center'
    },
    imageMessageUploadText: {
        fontSize: wp(3.5),
        marginHorizontal: wp(2),
        marginTop: hp(0.7),
        fontFamily: fontFamily.ProximaNova_Medium
    }


})