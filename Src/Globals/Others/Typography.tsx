import { VerifyCode } from '../../Screens';
import { wp, hp } from './Scalling';
const fontSize = {
    header: wp(5),
    headerBack: wp(5),
    textInput: wp(4.3),
    button: wp(4.3),

    PhoneNumber: {
        country: wp(4.2),
        welcome: wp(5.5),
        welcomeDis: wp(3.5),
        down: wp(4)
    },
    VerifyCode: {
        otpDis: wp(3.8)
    },
    Home: {
        menuIcon: wp(10),
        plusCircle: wp(10),
        addEventTitle: wp(4),
        mapMarkerTitle: wp(4),
        closeCircle: wp(8),
        showEventTitle: wp(5),
        showEventDis: wp(4)
    },
    Chat: {
        back: wp(6),
        header: wp(4.3),
        message: wp(4.15),
        attach: wp(11),
        send: wp(9),
        edit: wp(4)
    },
    ProfileImage: {
        profileDis: wp(4.5),
        profileHeading: wp(6),
        cameraIcon: wp(8),
        useCamera: wp(4.5),
        or: wp(5),
        imageIcon: wp(12),
        selectImageDis: wp(4.2),
        pngText: wp(3.5),
        next: wp(6),
        uploading: wp(4)
    }
}

export { fontSize }