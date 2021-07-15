import { StatusBar, View } from 'react-native';
import { Text } from 'react-native-animatable';
import { showMessage } from "react-native-flash-message";
import { fontFamily, hp, wp } from '../Globals';
class Alert {
    Alert = (remoteMessage: any) => {
        showMessage({
            message: 'e',
            type: 'success',
            titleStyle: { fontFamily: fontFamily.ProximaNova_Medium, fontSize: wp(4) },
            duration: 2500,
            autoHide: false,
            statusBarHeight: StatusBar.currentHeight,
        })
    }
}

const GMessageAlert = new Alert()
export { GMessageAlert }