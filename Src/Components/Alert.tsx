import { StatusBar } from 'react-native';
import { Text } from 'react-native-animatable';
import { showMessage } from "react-native-flash-message";
import { fontFamily, wp } from '../Globals';
class Alert {
    Alert = (message: any, type: any) => {
        showMessage({
            message: message,
            type: type,
            titleStyle: { fontFamily: fontFamily.ProximaNova_Medium, fontSize: wp(4) },
            duration: 2500,
            statusBarHeight: StatusBar.currentHeight
        })
    }
}

const GAlert = new Alert()
export { GAlert }