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
            urls: [ "stun:ss-turn1.xirsys.com" ]
        }, 
        {
            username: "K98R0xENxW54u-O075JEYFK27Z1hnafXlbfs83lHCC-Eo0NccDFa6fZ8C06minMCAAAAAGFH2rJMVExpZXU=",
            credential: "abb53402-19ac-11ec-82dc-0242ac140004",
            urls: [
                "turn:ss-turn1.xirsys.com:80?transport=udp",
                "turn:ss-turn1.xirsys.com:3478?transport=udp",
                "turn:ss-turn1.xirsys.com:80?transport=tcp",
                "turn:ss-turn1.xirsys.com:3478?transport=tcp",
                "turns:ss-turn1.xirsys.com:443?transport=tcp",
                "turns:ss-turn1.xirsys.com:5349?transport=tcp"
            ]
        }
    ],
    // iceTransportPolicy: "relay"
}