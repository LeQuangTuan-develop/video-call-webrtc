export const pc_config = {
    "iceServers": [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stun.services.mozilla.com"
            ]
        },
        // {
        //   urls: ['turn:numb.viagenie.ca'],
        //   credential: '123456',
        //   username: 'tuanlqps14736@fpt.edu.vn'
        // },
        {
            urls: ["stun:ss-turn2.xirsys.com"]
        },
        {
            username: "SL5X7cJw92B3v3X50Py-NYN6xdo9j7CXriaUuC52i0yqjx0i5i6JpvXDH5Ux2uoBAAAAAGFCpbdRdWFuZ1R1YW4xNjU=",
            credential: "272d8792-1692-11ec-897d-0242ac140004",
            urls: [
                "turn:ss-turn2.xirsys.com:80?transport=udp",
                "turn:ss-turn2.xirsys.com:3478?transport=udp",
                "turn:ss-turn2.xirsys.com:80?transport=tcp",
                "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                "turns:ss-turn2.xirsys.com:443?transport=tcp",
                "turns:ss-turn2.xirsys.com:5349?transport=tcp"
            ]
        }
    ],
    // iceTransportPolicy: "relay"
}