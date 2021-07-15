import { Dimensions, Platform, StyleSheet } from "react-native";
import { fontFamily, fontSize, hp, wp, GColor } from "../../Globals";

const { theme, white, gray5, gray0, secondaryWhite, gray3, color3, black, color7, color9Rgba80 } = GColor
const { width } = Dimensions.get('window')
export default StyleSheet.create({
    containerBeforeDrawer: {
        flex: 1,
        zIndex: 0,
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        alignItems: "center",
        position: 'absolute',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: secondaryWhite,
    },
    mapMarker: {
        width: width * 0.06158,
        height: width * 0.082 * 1,
    },
    pin: {
        height: hp(2),
        width: wp(6)
    },
    menuContainer: {
        borderWidth: 0,
        borderColor: 'red',
        alignSelf: 'flex-end',
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
    },
    menuIcon: {
        paddingTop: hp(5),
        paddingHorizontal: wp(1),
        alignItems: 'flex-end'
    },
    plusContainer: {
        borderWidth: 0,
        borderColor: 'red',
        flex: Platform.OS === 'ios' ? 0.13 : 0.16,
        // width: width,
        alignItems: 'center',
        alignSelf: 'center'
    },
    plusCirlce: {
        width: width * 0.145,
        height: width * 0.145 * 1,
        borderRadius: width * 0.145 * 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: theme,
        borderWidth: 0.7,
        borderColor: theme
    },


    messageInput: {
        borderWidth: 0.5,
        borderColor: gray5,
        alignSelf: 'center',
        height: hp(33),
        width: wp(80),
        color: gray0,
        backgroundColor: secondaryWhite,
        fontSize: fontSize.Home.addEventTitle,
        fontFamily: fontFamily.ProximaNova_Medium,
        marginTop: hp(1),
        paddingHorizontal: wp(3),
        textAlignVertical: 'top',
        paddingTop: hp(2)
    },
    showEventModalContainer: {
        flex: 1,
        justifyContent: 'center',
        // paddingBottom: hp(50),
        alignItems: 'center',
    },
    showEventContainer: {
        width: wp(85),
        // width: 350,
        // height: 250,
        height: hp(36.5),
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: color9Rgba80,
        paddingTop: hp(2)
    },
    showEventTitleContainer: {
        borderWidth: 0,
        borderColor: 'white',
        alignSelf: 'flex-start',
        width: wp(68),
        paddingHorizontal: wp(6),
        overflow: 'hidden'
    },
    showEventTitle: {
        color: white,
        fontFamily: fontFamily.ProximaNova_Bold,
        fontSize: fontSize.Home.showEventTitle
    },
    showEventDisContainer: {
        paddingHorizontal: wp(6),
        paddingVertical: hp(1),
        // maxHeight: hp(49),
        height: hp(23.5),
        overflow: 'hidden',
        borderWidth: 0
    },
    showEventDis: {
        color: white,
        fontFamily: fontFamily.ProximaNova_Regular,
        fontSize: fontSize.Home.showEventDis
    },
    showEventMessageButton: {
        backgroundColor: color3,
        alignSelf: 'flex-end',
        height: hp(5),
        width: wp(25),
        borderRadius: 8,
        marginVertical: hp(0.7),
        marginHorizontal: wp(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    showEventMessageContainer: {
        borderWidth: 1,
        paddingVertical: hp(3)
    },
    showEventMessage: {
        color: theme,
        fontFamily: fontFamily.ProximaNova_Bold,
        fontSize: fontSize.Home.showEventDis
    },
    removeButton: {
        color: color7,
        fontFamily: fontFamily.ProximaNova_Regular,
        fontSize: fontSize.Home.showEventDis
    }


})
