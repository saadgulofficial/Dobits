import { StyleSheet, Dimensions } from "react-native";
import { wp, GColor, hp, fontFamily } from "../../Globals";

const { white, secondaryWhite, gray4, gray0, gray3, gray2 } = GColor
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        borderWidth: 0,
        backgroundColor: secondaryWhite,
        flex: 1,
    },
    convFlatContainer: {
        flex: 1,
        paddingVertical: hp(1),
    },
    itemContainer: {
        borderWidth: 0,
        paddingVertical: hp(1),
        flexDirection: 'row',
        paddingHorizontal: wp(3)
    },
    itemImageView: {
        width: width * 0.14,
        height: width * 0.14 * 1,
        borderRadius: width * 0.14 * 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white,
    },
    itemImage: {
        width: width * 0.125,
        height: width * 0.125 * 1,
        borderRadius: width * 0.125 * 1 / 2,
    },
    fieldView: {
        borderBottomWidth: 0.5,
        borderBottomColor: gray4,
        width: wp(60),
        justifyContent: 'space-between',
        paddingVertical: hp(0.8),
        marginLeft: wp(1.2)
    },
    itemTitle: {
        fontFamily: fontFamily.ProximaNova_Bold,
        fontSize: wp(4.3),
        color: gray0,
        maxWidth: wp(45),
    },
    itemLastMessage: {
        fontFamily: fontFamily.ProximaNova_Regular,
        fontSize: wp(4.3),
        color: gray3,
        maxWidth: wp(40),
    },
    listEmptyContainer: {
        flex: 1,
        paddingTop: hp(2),
        alignItems: 'center'
    },
    listEmptyText: {
        fontSize: wp(4),
        color: gray2,
        fontFamily: fontFamily.ProximaNova_Regular
    }

})