
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'

import React from 'react'

class Icons {
    down = (size: any, color: any, style: any) => <AntDesign name="down" size={size} color={color} style={style} />
    left = (size: any, color: any, style: any) => <AntDesign name="left" size={size} color={color} style={style} />
    edit = (size: any, color: any, style: any) => <Entypo name="edit" size={size} color={color} style={style} />
    menu = (size: any, color: any, style: any) => <Feather name="menu" size={size} color={color} style={style} />
    plusCircle = (size: any, color: any, style: any) => <AntDesign name="pluscircle" size={size} color={color} style={style} />
    plus = (size: any, color: any, style: any) => <AntDesign name="plus" size={size} color={color} style={style} />
    attach = (size: any, color: any, style: any) => <Entypo name="attachment" size={size} color={color} style={style} />
    sendCircleOutLine = (size: any, color: any, style: any) => <MaterialCommunityIcons name="send-circle-outline" size={size} color={color} style={style} />
    sendCircle = (size: any, color: any, style: any) => <MaterialCommunityIcons name="send-circle" size={size} color={color} style={style} />
    camera = (size: any, color: any, style: any) => <EvilIcons name="camera" size={size} color={color} style={style} />
    cameraTwo = (size: any, color: any, style: any) => <Foundation name="camera" size={size} color={color} style={style} />
    image = (size: any, color: any, style: any) => <Ionicons name="image-outline" size={size} color={color} style={style} />
    closeCircle = (size: any, color: any, style: any) => <AntDesign name="closecircle" size={size} color={color} style={style} />
    ionIconsCheckMark = (size: any, color: any, style: any) => <Ionicons name="checkmark" size={size} color={color} style={style} />
    ionIconsCloseO = (size: any, color: any, style: any) => <Ionicons name="close-outline" size={size} color={color} style={style} />

}

const GIcons = new Icons();
export { GIcons }