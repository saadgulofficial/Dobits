import { useFocusEffect } from '@react-navigation/core'
import React, { useState, useCallback } from 'react'
import { View, Text, Image, StatusBar, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import { GHeader, Loader } from '../../Components/Index'
import { GColor, GStyles, hp, wp } from '../../Globals'
import { GAsyncStorage, GFirebase } from '../../Services'
import Styles from './Styles'
import _ from 'lodash'
import { useForceUpdate } from '../../Components/ForceUpdate'

const { white, gray2 } = GColor
const Conversations = ({ navigation }: any) => {
    const ForceUpdate = useForceUpdate()
    const [containerLoader, setcontainerLoader] = useState<any>(true)
    const [imageLoader, setimageLoader] = useState(true)
    const [localUser, setlocalUser] = useState<any>('')
    const [chats, setchats] = useState([])

    const handleItem = (item: any) => {
        navigation.navigate('Chat', { chatInitalDetail: item })
    }



    const onChatLongPress = async (item: any) => {
        Alert.alert(
            "",
            "Delete Chat",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => await GFirebase.deleteChat(item).then(() => {
                        _.remove(chats, function (n: any) {
                            return n.id === item.id;
                        });
                        setchats(chats)
                        ForceUpdate()
                    })
                }
            ]
        );

    }

    const itemSeperator = () => <View style={{ marginBottom: hp(0.5) }} />
    const renderChats = ({ item }: any) => {
        const { user1, user2 } = item
        const { uid } = localUser
        const headerText = user1.uid === uid ? user1.header : user2.uid === uid ? user2.header : ''
        return (
            <TouchableOpacity
                style={Styles.itemContainer}
                onPress={handleItem.bind(null, item)}
                onLongPress={() => onChatLongPress(item)}
            >
                <View style={Styles.itemImageView}>
                    {
                        item.otherUserImage && item.otherUserImage !== '' ?
                            <Image
                                source={{ uri: item.otherUserImage && item.otherUserImage }}
                                style={Styles.itemImage} />
                            :
                            <Image
                                source={require('../../Assets/Images/user.png')}
                                style={Styles.itemImage} />
                    }
                </View>
                <View style={Styles.fieldView}>
                    <Text style={Styles.itemTitle} numberOfLines={1}>{headerText}</Text>
                    <Text style={Styles.itemLastMessage} numberOfLines={1}>
                        {
                            item.latestMessage.includes('https://firebasestorage') ?
                                'image'
                                :
                                item.latestMessage
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderListEmpty = () => (
        <View style={Styles.listEmptyContainer}>
            <Text style={Styles.listEmptyText}>No chats found</Text>
        </View>
    )


    const getOtherUserHeaderAndUid = (res: any, uid: any) => {
        const { user1, user2 } = res
        if(user2.uid !== uid) {
            return user2
        }
        else if(user1.uid !== uid) {
            return user1
        }
    }



    const getChats = async (user: any) => {
        const uid = user.uid
        await GFirebase.getChats(uid).then(async (res: any) => {
            if(res.length !== 0) {
                for await(var element of res) {
                    const otherUserUid = getOtherUserHeaderAndUid(element, uid)
                    await GFirebase.getUser(otherUserUid.uid).then((data: any) => {
                        const image = data.image ? data.image : ''
                        element.otherUserImage = image
                    })
                }
            }
            setchats(res)
            setcontainerLoader(false)
        })
            .catch(() => {
                setcontainerLoader(false)
            })

    }


    useFocusEffect(
        useCallback(
            () => {
                async function getData() {
                    const user = await GAsyncStorage.getLocalData()
                    setimageLoader(false)
                    setlocalUser(user)
                    await getChats(user)

                }
                getData()
            },
            [],
        )
    )

    const handleProfile = () => navigation.navigate('Profile')

    return (
        <View style={Styles.container}>
            <StatusBar barStyle='dark-content' />
            <GHeader
                left={<Text style={{ ...GStyles.headerText, marginTop: hp(3) }}>Chats</Text>}
                bgColor={white}
                right={
                    <TouchableOpacity
                        onPress={handleProfile}
                    >
                        {
                            imageLoader ?
                                <ActivityIndicator size='small' color={gray2} style={{ paddingHorizontal: wp(3) }} />
                                :
                                localUser && localUser.image ?
                                    <Image
                                        source={{ uri: localUser.image }}
                                        style={Styles.itemImage}
                                    />
                                    :
                                    <Image
                                        source={require('../../Assets/Images/user.png')}
                                        style={Styles.itemImage}
                                    />
                        }
                    </TouchableOpacity>

                }
                style={{ paddingHorizontal: wp(2.8) }}
            />
            {    containerLoader ?
                <Loader />
                :
                <FlatList
                    data={chats}
                    renderItem={renderChats}
                    ItemSeparatorComponent={itemSeperator}
                    ListEmptyComponent={renderListEmpty}
                    contentContainerStyle={Styles.convFlatContainer}
                />
            }
        </View>
    )
}

export default Conversations
