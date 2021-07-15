import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { GColor, hp } from '../Globals/index'
const { theme } = GColor
const Loader = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: hp(8) }}>
            <ActivityIndicator size="small" color={theme} />
        </View>
    )
}

export { Loader }
