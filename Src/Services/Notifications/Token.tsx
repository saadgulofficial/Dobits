import messaging from '@react-native-firebase/messaging';
const GToken = () => {
    return new Promise(async (resolve, reject) => {
        // await messaging().requestPermission().then((enabled) => {
        //     if(enabled) {
        messaging()
            .getToken()
            .then(token => resolve(token))
            .catch(err => {
                console.log('Error while getting device token =>', err)
                reject()
            })
        // }
        // else {
        //     console.log('user rejected to give notification permission')
        // }
        // })
        //     .catch(err => {
        //         console.log('Error while getting device token =>', err)
        //         reject()
        //     })

    })
}
export { GToken }