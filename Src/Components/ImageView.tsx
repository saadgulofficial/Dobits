import React, { useState } from 'react'
import { View, Text } from 'react-native'
//@ts-ignore
import ImageView from 'react-native-image-view';

const GImageView = ({ image, isVisible, onClose }: any) => {

    return (
        <ImageView
            images={image}
            imageIndex={0}
            isVisible={isVisible}
            onClose={onClose}
        />

    )
}

export { GImageView }
