var websocket;//声明全局的webSocket
var yourVideo = document.getElementById("yours");//获取video标签
var theirVideo = document.getElementById("theirs");//获取video标签
var Connection;//声明全局的WebRTC
//生成随机数userId
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}
const userid = 'user' + randomNum(0,100000);
hasUserMedia();//初始化获取摄像头和麦克风
hasRTCPeerConnection();//初始化判断WebRTC
//判断是否支持获取摄像头
function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return !!navigator.getUserMedia;
}
//判断是否支持WebRTC
function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return !!window.RTCPeerConnection;
}



//初始化WebRTC
function startPeerConnection() {
    var config;
    config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
        ],
    };
    //初始化RTCPeerConnection
    Connection = new RTCPeerConnection(config);
    console.log(Connection)
    Connection.onicecandidate= function(e) {
        console.log(e.candidate);
        if (e.candidate) {
            websocket.send(JSON.stringify({
                "userid":userid,
                "event": "_ice_candidate",
                "data": {
                    "candidate": e.candidate
                }
            }));
        }
    }
    //显示画面在当前页面
    Connection.onaddstream = function(e) {
        //theirVideo.src = window.URL.createObjectURL(e.stream);
        theirVideo.srcObject = e.stream;
    }
}


createSocket();
startPeerConnection();
//获得用户权限许可
function f() {
    //如果用户给予许可，successCallback回调就会被调用
    navigator.getUserMedia({ video: true, audio: true },function (stream){
        yourVideo.srcObject = stream;
        window.stream = stream;
        Connection.addStream(stream)
        },
        err => {
            console.log(err);
        })
}

//调用createOffer方法准备创建SDP
function createOffer(){
    //发送offer和answer的函数，发送本地session描述
    Connection.createOffer().then(offer => {
        //将会话描述设置在本地
        Connection.setLocalDescription(offer);
        console.log(offer);
        websocket.send(JSON.stringify({
            "userid":userid,
            "event": "offer",
            "data": {
                "sdp": offer
            }
        }));
    });
}



function createSocket(){
    var user = Math.round(Math.random()*1000) + ""
    console.log(user);
    websocket = new WebSocket("wss://192.168.191.1:8443/videoCall/Video/"+user);
    eventBind();
};
function eventBind() {
    //连接成功
    websocket.onopen = function(e) {
        console.log('连接成功')
    };
    //server端请求关闭
    websocket.onclose = function(e) {
        console.log('close')
    };
    //error
    websocket.onerror = function(e) {

    };
    //收到消息
    websocket.onmessage = (event)=> {
        if(event.data == "new user") {
            location.reload();
        } else {
            var json = JSON.parse(event.data);
            console.log('onmessage: ', json);
            if(json.userid !=userid){
                //ICE是一个提供
                //如果是一个ICE的候选,则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
                if(json.event === "_ice_candidate"&&json.data.candidate) {
                    Connection.addIceCandidate(new RTCIceCandidate(json.data.candidate));
                }else if(json.event ==='offer'){
                    //这里可以弹出接听电话的ui页面
                    Connection.setRemoteDescription(json.data.sdp);
                    Connection.createAnswer().then(answer => {
                        Connection.setLocalDescription(answer);
                        console.log(window.stream)
                        websocket.send(JSON.stringify({
                            "userid":userid,
                            "event": "answer",
                            "data": {
                                "sdp": answer
                            }
                        }));
                    })
                }else if(json.event ==='answer'){
                    Connection.setRemoteDescription(json.data.sdp);
                    console.log(window.stream)
                }
            }
        }
    };
}
