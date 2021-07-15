import React, { Component } from 'react'
import { TouchableWithoutFeedback, View, Image, Text, Dimensions, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import Modal from 'react-native-modal';
import { GColor, wp, hp, fontFamily, } from '../../Globals/index'
import { Notification } from "react-native-in-app-message";

const { width, height } = Dimensions.get('window')
class ShowMessage extends Component<any> {
    state: {
        isVisible: boolean,
        remoteMessage: any,
        notification: any,
        data: any
    } = {
            isVisible: false,
            remoteMessage: '',
            notification: '',
            data: ''
        }

    componentDidMount() {
        messaging().onMessage(async (remoteMessage: any) => {
            const notify = remoteMessage.notification
            const data = JSON.parse(remoteMessage.data.data)
            //@ts-ignore
            if(data.sendBy !== global.reserveId) {
                this.setState({
                    isVisible: true,
                    remoteMessage: remoteMessage,
                    notification: notify,
                    data: data
                },
                    () => {
                        //@ts-ignore
                        global.NRef.current?.show()
                    })
            }
        })
    }

    closeModal = () => {
        //@ts-ignore
        this.timerID = setTimeout(this.setState.bind(this, { isVisible: false }), 3000);
    }
    componentWillUnmount() {
        //@ts-ignore
        clearInterval(this.timerID);
    }
    render() {
        const { isVisible, data, notification } = this.state
        return (
            // <Modal
            //     isVisible={!isVisible}
            //     hasBackdrop={false}
            //     animationIn='fadeInDown'
            //     animationOut='fadeOutUp'
            //     animationInTiming={500}
            //     animationOutTiming={500}
            //     useNativeDriver={true}
            //     coverScreen
            //     onModalShow={this.closeModal}
            //     onBackButtonPress={this.closeModal}
            // >
            // <TouchableWithoutFeedback
            //     onPress={this.closeModal}
            // >
            <View style={Styles.container}>
                <TouchableOpacity style={Styles.messageContainer}
                    onPress={() => this.props.navigation.navigate('Chat', { chatInitalDetail: data.conv })}
                    activeOpacity={1}
                >
                    {
                        data.image !== '' ?
                            <Image
                                source={{ uri: data.image }}
                                style={Styles.image}
                            />
                            :
                            <Image
                                source={require('../../Assets/Images/user.png')}
                                style={Styles.image}
                            />
                    }
                    <View style={Styles.textContainer}>
                        <Text style={Styles.title} numberOfLines={1}>{notification.title}</Text>
                        <Text style={Styles.message} numberOfLines={1}>{notification.body}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            // </TouchableWithoutFeedback>
            // </Modal>
        )
    }
}

export default ShowMessage

const Styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // paddingVertical: hp(2),
        // paddingTop: Platform.OS === 'android' ? hp(0) : hp(4),
    },
    messageContainer: {
        width: wp(80),
        backgroundColor: GColor.white,
        paddingVertical: hp(1),
        borderRadius: 30,
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    image: {
        width: width * 0.12,
        height: width * 0.12 * 1,
        borderRadius: width * 0.12 * 1 / 2,
    },
    textContainer: {
        borderWidth: 0,
        width: wp(60),
        paddingHorizontal: wp(1),
        paddingTop: hp(0.7)
    },
    title: {
        fontFamily: fontFamily.ProximaNova_Bold,
        fontSize: wp(3.8)
    },
    message: {
        fontFamily: fontFamily.ProximaNova_Regular,
        fontSize: wp(3.7)
    }
})
