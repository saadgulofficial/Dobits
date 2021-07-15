const GPush = (token: any, _data: { title: string, body: string, data: any }) => {
    let data = {
        "to": token,
        "notification": {
            "title": _data.title,
            "body": _data.body,
            "sound": "default",
        },
        "priority": 'high',
        "data": { "data": _data.data },
    }
    return fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAZQmwixE:APA91bEe4tlAZEXEAEy3221_rPrW3g1Wtu9uUsGHvhAbpKOSsHixjA3png4QosxXv6aBgAmDwS1cgnOD3Nm-KCwY7qmXwLziB9pYUnIBzd_NBnK9Cz8mZW3g0I2ihKv2_okfrjm7dIRE'
        },
        body: JSON.stringify(data),
    })
        .then((res) => { })
        .catch((err) => { console.log("push send err", err); });

}
export default GPush