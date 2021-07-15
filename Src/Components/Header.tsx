import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Header } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GIcons, fontSize, GColor, fontFamily } from '../Globals'

const { black } = GColor
const GHeader = ({ left, center, right, style, bgColor, back, navigation }: any) => {
    const handleBack = () => navigation.goBack()
    return (
        <Header
            leftComponent={back ?
                <TouchableOpacity style={Styles.leftContainer}
                    onPress={handleBack}
                >
                    {GIcons.left(fontSize.headerBack, black, {})}
                    <Text style={Styles.backText}>Back</Text>
                </TouchableOpacity>
                : left}
            centerComponent={center}
            rightComponent={right}
            backgroundColor={bgColor}
            containerStyle={style}
        />
    )
}

const Styles = StyleSheet.create({
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: fontSize.headerBack,
        fontFamily: fontFamily.ProximaNova_Medium
    }
})

export { GHeader }
