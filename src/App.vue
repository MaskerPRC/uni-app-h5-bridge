<template>
  <div class="demo">
    <input type="text" :value="userName" />
    <input type="password" :value="password" />
    <button type="submit" class="btn" @click="test">确定</button>
  </div>
  {{msg}}
</template>

<script>
import {reactive} from "vue";
import {getUuid} from "@/uuid";

export default {
  name: 'App',
  data() {
    return {
      msg: "",
      userName: "",
      password: "",
      sdkAppId: "",
      userSig: "",
      trtc: null
    }
  },
  created() {
    window.getTRTCConfig = this.getTRTCConfig;
  },
  methods: {
    getTRTCConfig (ret) {
      this.sdkAppId = ret.sdkAppId;
      this.userSig = ret.userSig;
    },
    async test() {
      // eslint-disable-next-line no-debugger
      const ret = await this.trtc.enterRoom({
        roomId: 123213223,
        userId: "uye",
        sdkAppId: this.sdkAppId,
        userSig: this.userSig
      }, 0)
      console.log(ret)
      const ret1 = await this.trtc.startLocalPreview(true, "uye");
      console.log(ret1)
    },
    apiCloud() {
      var userId,invitedCode,examNo,seatOrder,roomOpenDate,tim, g_clarity;
      var tencentTRTC = null;
      var audioStreamer = null;
      var cameraFront = false; // 记录摄像头方向,默认开启后置摄像头

      /**
       * 清晰度级别，0：标清（默认），1：高清：2：超高清
       * @type {{"0": string, "1": string, "2": string}}
       */
      const clarityFriendlyNameMap = {
        "0": "SD", // 标清（SD）不高于640 × 480（含）300kbps-900kbps（含）14.00rmb/kmin
        "1": "HD", // 高清（HD）640 × 480 - 1280 × 720（含）900kbps-1800kbps（含）28.00rmb/kmin
        // 目前apicloud不支持安卓的全高清
        "2": "FHD", // 超高清（Full HD）1280x720-1920 ×1080（含）1800kbps-4000kbps（含）63.00rmb/kmin
      }

      const clarityFriendlyNameEnum = {
        "SD": 62, // 标清（SD）不高于640 × 480（含）300kbps-900kbps（含）14.00rmb/kmin
        "HD": 112, // 高清（HD）640 × 480 - 1280 × 720（含）900kbps-1800kbps（含）28.00rmb/kmin
        // 目前apicloud不支持安卓的全高清
        "FHD": 114, // 超高清（Full HD）1280x720-1920 ×1080（含）1800kbps-4000kbps（含）63.00rmb/kmin
      }

      const clarityEnum = {
        "3": 100, //3: 宽高比1:1，160_160，建议码率 VideoCall:100kbps  LIVE:150kbps
        "5": 200, //5: 宽高比1:1，270_270，建议码率 VideoCall:200kbps  LIVE:120kbps
        "7": 350, //7: 宽高比1:1，480_480，建议码率 VideoCall:350kbps  LIVE:120kbps
        "50": 100, //50: 宽高比4:3，160_120，建议码率 VideoCall:100kbps  LIVE:150kbps
        "52": 150, //52: 宽高比4:3，240_180，建议码率 VideoCall:150kbps  LIVE:225kbps
        "54": 200, //54: 宽高比4:3，280_210，建议码率 VideoCall:200kbps  LIVE:300kbps
        "56": 250, //56: 宽高比4:3，320_240，建议码率 VideoCall:250kbps  LIVE:375kbps
        "58": 300, //58: 宽高比4:3，400_300，建议码率 VideoCall:300kbps  LIVE:450kbps
        "60": 400, //60: 宽高比4:3，480_360，建议码率 VideoCall:400kbps  LIVE:600kbps
        "62": 600, //62: 宽高比4:3，640_480，建议码率 VideoCall:600kbps  LIVE:900kbps
        "64": 1000, //64: 宽高比4:3，960_720，建议码率 VideoCall:1000kbps LIVE:1500kbps
        "100": 150, //100: 宽高比16:9，160_90，建议码率 VideoCall:150kbps  LIVE:250kbps
        "102": 200, //102: 宽高比16:9，256_144，建议码率 VideoCall:200kbps  LIVE:300kbps
        "104": 250, //104: 宽高比16:9，320_180，建议码率 VideoCall:250kbps  LIVE:400kbps
        "106": 350, //106: 宽高比16:9，480_270，建议码率 VideoCall:350kbps  LIVE:550kbps
        "108": 550, //108: 宽高比16:9，640_360，建议码率 VideoCall:550kbps  LIVE:900kbps
        "110": 850, //110: 宽高比16:9，960_540，建议码率 VideoCall:850kbps  LIVE:1300kbps
        "112": 1200, //112: 宽高比16:9，1280_720，建议码率 VideoCall:1200kbps LIVE:1800kbps
        "114": 2000, //114: 宽高比16:9，1920_1080，建议码率 VideoCall:2000kbps LIVE:3000kbps（此分辨率仅支持iOS）
      }

      function initTim() {
        try{
          if(!userId){
            layer.alert('未登录')
            return
          }

          var SDKAPPID = <%=TRTCConstant.IM_APPID%>;
          var SECRETKEY = '<%=TRTCConstant.IM_SECRETKEY%>';
          var userID = examNo + "_" + userId;
          tim = TIM.create({
            SDKAppID: SDKAPPID
          });
          tim.on("sdkStateReady", function(e){});
          /*tim.on(TIM.EVENT.KICKED_OUT, function(event) {
              exitRoom();
              showTitle(false)
              layer.alert('账号在其它终端登录，请确保账号安全！', {
                  closeBtn: 0
              }, function(){
                  quitExam()
              });
          });*/
          tim.on('onMessageReceived', function (message) {
            for(var i =0; i <message.data.length; i++){
              var msg = message.data[i];
              //接收并播放音频文件
              if(msg.type == TIM.TYPES.MSG_FILE){
                var fileUrl = msg.payload.fileUrl
                console.info("接收到文件：" + fileUrl)
                var myAudio = document.getElementById('audio');
                myAudio.src = fileUrl;
                myAudio.play();//自动播放
                myAudio.preload = true;//是否预加载
                myAudio.currentTime
              }else{
                if(msg.payload.extension){
                  //建群通知
                  console.info(msg.payload.extension);
                }else if(msg.payload.text == "join_mix_room"){
                  joinRoomShowTitle(1,'','mixRoom')
                }else if(msg.payload.text == "exit_1v1_room"){
                  //监考开始或退出1v1
                  // todo!: 这里可能有异步问题
                  exitRoom();
                  openCamera();
                  joinRoom("mixRoom");
                }else if(msg.payload.text == "exit_mix_room" || msg.payload.text == "exit"){
                  //监考结束
                  exitRoom();
                  showTitle(false)
                  layer.alert('监考系统已关闭，您可以退出了', {
                    closeBtn: 0
                  }, function(){
                    quitExam()
                  });
                }else if(msg.payload.text == "exit_none"){
                  // todo!: 这里可能有异步问题
                  exitRoom();
                  openCamera();
                }else if(msg.payload.text == "join_1v1_room"){
                  // todo!: 这里可能有异步问题
                  exitRoom();
                  openCamera()
                  joinRoom("1v1");
                }else if(msg.payload.text == "userId"){
                  layer.msg(userId)
                }else{
                  if(msg.payload.text){
                    layer.alert("广播：" + msg.payload.text)
                  }
                }
              }
            }
          })
          setTimeout(function(){
            try{
              var generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, 1000000);
              var userSig = generator.genTestUserSig(userID);
              tim.login({
                userID: userID,
                userSig: userSig
              })
            }catch (e) {
            }
          },2000)
        }catch (e) {
        }
      }

      function quitExam() {
        api.setScreenOrientation({
          orientation: 'portrait_up'
        });
        api.setFullScreen({
          fullScreen: false
        });
        api.closeFrame({
          name:'monitorWin'
        });
      }

      /**
       * 进入房间 信息展示切换
       */
      function joinRoomShowTitle(openStatus, openTime, joinType) {
        var statusParam = {}
        statusParam.status = openStatus
        if(openStatus == 1){
          if(joinType != ''){
            joinRoom(joinType)
          }
        }else if(openStatus == 0){
          statusParam.time = openTime
          api.toast({
            msg: '暂未到开启时间，按照要求摆放设备即可，系统会自动开启',
            duration: 6000
          });
        }
        try {
          setTimeout(function(){
            api.sendEvent({
              name: 'changeRoomOpenStatus',
              extra: statusParam
            });
          },1000)
        }catch (e) {
          alert(e)
        }
      }

      function getExamInfo(invitedCode) {
        $.ajax({
          url: '/openBeta/user/stuLogin',
          async: false,
          data: {invitedCode: invitedCode},
          dataType: "json",
          type: "POST",
          success: function (data) {
            var userId,examNo,seatOrder,clarityInner;
            if(data.success){
              userId = data.obj.userId;
              clarityInner = data.obj.clarity;
              examNo = data.obj.monitorExamRoom.examNo;
              roomOpenDate = data.obj.monitorExamRoom.roomOpenDate;
              if(roomOpenDate){
                roomOpenDate = roomOpenDate.substring(5,roomOpenDate.length).replace("-","月").replace(" ","日 ");
              }
              seatOrder = data.obj.seatOrder;
              var storage = window.localStorage;
              storage.setItem("userId", userId);
              storage.setItem("clarity", clarityInner);
              storage.setItem("invitedCode", invitedCode);
              storage.setItem("examNo", examNo);
              storage.setItem("seatOrder", seatOrder);
              //监考已开启，自动进入混流房间
              preJoinRoom(isStart(data.obj.monitorExamRoom.roomOpenDate),data.obj.monitorExamRoom.roomOpenDate, roomOpenDate, 'mixRoom')
            }else{
              layer.alert(data.msg);
            }
          },
          error: function (returndata) {
            _error(returndata);
          }
        });
      }
      function getRoomId(type) {
        if(!userId){
          layer.msg("userId is null");
          return "";
        }
        if(!examNo){
          layer.msg("examNo is null");
          return "";
        }
        if(!seatOrder){
          layer.msg("seatOrder is null");
          return "";
        }
        // todo: 将此逻辑改到后端
        // todo: 使用腾讯的安全验证接口先调用后端获取key，再进房，防止外部人员破坏
        var roomId;
        if(type == "1v1"){
          roomId = "1";
          roomId = roomId + examNo + seatOrder;
        }else{
          roomId = "2";
          roomId = roomId + examNo;
          var num = '01';
          if(parseInt(seatOrder) > 0){
            if(parseInt(seatOrder)  <=14){
              num = '01';
            }else if(parseInt(seatOrder)  >14 && parseInt(seatOrder) <=28){
              num = '02';
            }else if(parseInt(seatOrder)  >28 && parseInt(seatOrder) <=42){
              num = '03';
            }else if(parseInt(seatOrder)  >42 && parseInt(seatOrder) <=56){
              num = '04';
            }else{
              num = '05';
            }
            roomId = roomId + num;
          }else{
            layer.alert("座位号错误：" + seatOrder);
            return "";
          }
        }
        return roomId;
      }

      function apiready() {
        var microphone = 'microphone';
        var camera = 'camera';
        var resultList = api.hasPermission({
          list: [microphone, camera]
        });
        if (resultList[0].granted) {
          start()
        } else {
          layer.confirm('请授权访问摄像头和麦克风来使用监考功能', {
            btn: ['去授权', '取消'], //按钮
            title: '授权请求'
          }, function(){
            api.requestPermission({
              list: [microphone, camera],
            }, function(res) {
              if (res.list[0].granted) {
                start()
              }
            });
            layer.closeAll()
          }, function() {
            layer.closeAll()
            window.history.back()
          });
        }


      }

      function start() {
        try{
          api.setScreenOrientation({
            orientation: 'auto_landscape'
          });
          api.setFullScreen({
            fullScreen: true
          });
          api.setKeepScreenOn({
            keepOn: true
          });
          api.addEventListener({
            name:'swiperight'
          }, function(ret, err){
            back()
          });
          api.addEventListener({
            name:'keyback'
          }, function(ret, err){
            if( ret ){
              exitRoom();
              showTitle(false)
              quitExam()
            }else{
              alert( JSON.stringify( err ) );
            }
          });

          api.addEventListener({
            name: 'changeCamera'
          }, function(ret, err) {
            switchCamera()
          });
          api.addEventListener({
            name: 'exit'
          }, function(ret, err) {
            exitRoom();
            showTitle(false)
            quitExam();
          });
        } catch (e) {
          console.info(e)
        }
        tencentTRTC = api.require('tencentTRTC');
        audioStreamer = api.require('audioStreamer');
        trtcRoomListener()
        var storage = window.localStorage;
        g_clarity = storage.getItem("clarity");
        openCamera()
        showTitle(true)
        userId = storage.getItem("userId");
        invitedCode = storage.getItem("invitedCode");
        examNo = storage.getItem("examNo");
        seatOrder = storage.getItem("seatOrder");
        initTim();
        getExamInfo(invitedCode)
      }

      //监听事件
      function trtcRoomListener() {
        try{
          tencentTRTC.setTRTCListener({
          },function(ret, err) {
            if (ret.status) {
              var event = ret.action//事件
              //进入房间监听
              if(event === "error"){
              }
              if(event === "enterRoom"){
                stopAllRemoteView()
                // timeStopAllRemoteView()
              }
              if(event === "firstAudioFrame"){
                stuAudioEvent(ret.firstAudioFrame.userId)
              }
              if(event === "remoteUserEnterRoom"){
                stuAudioEvent(ret.remoteUserEnterRoom.userId)
                stopAllRemoteView()
              }
              // if(event === "connectionLost"){// 失去连接
              //     joinRoomShowTitle(-1,'',''); // 更改录制状态为已中断
              //     lostConnectionAudio()
              // }
              // if(event === "connectionRecovery"){
              //     joinRoomShowTitle(1,'','');// 更改录制状态为录制中
              //     stopAudio();
              // }
            }else{
              layer.msg(JSON.stringify(ret))
            }
          });
        }catch (e) {
          layer.msg(e)
        }
      }

      function stopAllRemoteView() {
        tencentTRTC.stopAllRemoteView({
        },function(ret, err) {
        });
        timeStopAllRemoteView()
      }

      function timeStopAllRemoteView() {
        setTimeout(function(){
          tencentTRTC.stopAllRemoteView({
          },function(ret, err) {
          });
        },6000)
      }
      // 不接收学员的视频
      // function stuVideoEvent(userId) {
      //     tencentTRTC.stopRemoteView({remoteUid:userId});
      // }

      function stuAudioEvent(userId) {
        if(userId.startsWith('L')){
          tencentTRTC.muteRemoteAudio({
            remoteUid:userId,
            mute:false
          },function (ret,err) {
          })
        } else {
          tencentTRTC.muteRemoteAudio({
            remoteUid:userId,
            mute:true
          },function (ret,err) {
          })
        }
      }

      function lostConnectionAudio(){
        audioStreamer.setVolume({
          volume: 1
        });
        audioStreamer.setLoop({loop:true});
        audioStreamer.openPlayer({
          path: 'widget://widget/audio/lostConnection.mp3'
        }, function(ret, err) {
        });
      }
      function batterylowAudio(){
        audioStreamer.setVolume({
          volume: 1
        });
        audioStreamer.setLoop({loop:true});
        audioStreamer.openPlayer({
          path: 'widget://widget/audio/batterylow.mp3'
        }, function(ret, err) {
        });
      }

      function stopAudio(){
        audioStreamer.stop();
      }

      function recStatus() {
        $("#recStatus").addClass("icon-yuandian");

      }
      //摄像头预览，跳转frame，并打开摄像头
      function openCamera() {
        try{
          var clarityFriendlyName = clarityFriendlyNameMap[g_clarity];
          if(!clarityFriendlyName) {
            clarityFriendlyName = "SD";
          }
          var winWidth = api.winWidth
          var winHeight = api.winHeight
          if(winWidth < winHeight){
            winWidth = api.winHeight
            winHeight = api.winWidth
          }
          tencentTRTC.startLocalPreview({
            rect:{
              x:0,y:0,
              w:winWidth,
              h:winHeight
            },
            fixedOn: 'monitorWin',
            isFrontCamera: cameraFront,
            fixed: true
          },function(ret, err) {
          });
          tencentTRTC.setVideoEncoderParam({
            resMode:0,
            videoResolution: clarityFriendlyNameEnum[clarityFriendlyName],
            videoFps:15,
            videoBitrate: clarityEnum[clarityFriendlyNameEnum[clarityFriendlyName]],
            enableAdjustRes: false
          },function(ret, err) {
          });
        }catch (e) {
        }
      }

      /**
       * 切换摄像头
       */
      function switchCamera() {
        try {
          // 记录当下摄像头的前后置状态
          cameraFront = cameraFront?false:true;
          // stopAllRemoteView()
          tencentTRTC.switchCamera({
          },function(ret, err) {
          });
        }catch (e) {
        }
      }

      function stopView() {
        try {
          tencentTRTC.stopLocalPreview({
          });
        }catch (e) {
        }
      }

      //进入房间
      function joinRoom(type) {
        tencentTRTC.startLocalAudio({
        },function (ret,err) {
        })

        tencentTRTC.stopAllRemoteView({
        },function(ret, err) {
        });

        if(!userId){
          layer.alert("userId为空，请重新登录！");
          return;
        }
        var roomId = getRoomId(type)
        if(roomId == ""){
          layer.alert("房间号生成错误！");
          return;
        }

        var generator = new LibGenerateTestUserSig(
            <%=TRTCConstant.TRTC_APPID%>,
            '<%=TRTCConstant.TRTC_SECRETKEY%>',
            604800);
        var userSig = generator.genTestUserSig(userId)
        tencentTRTC.enterRoom({
          appId: <%=TRTCConstant.TRTC_APPID%>,
            userId: userId,
            roomId: roomId,
            userSig: userSig
      },function(ret, err) {
        });
      }

      function exitRoom() {
        try{
          tencentTRTC.exitRoom({
          });
          stopView()
        }catch (e) {
        }
      }

      function showTitle(status) {
        try {
          if(!status){
            api.closeFrame({
              name: 'showTitle'
            });
          }else{
            var winWidth = api.winWidth
            var winHeight = api.winHeight
            if(winWidth < winHeight){
              winWidth = api.winHeight
            }
            api.openFrame({
              name: 'showTitle',
              url: 'widget://widget/html/monitor_title.html',
              rect: {
                x: 0,
                y: 0,
                w: winWidth,
                h: 'auto'
              }
            });
          }
        }catch (e) {
        }
      }

      // 统一进入房间方法，未到时间倒计时进入
      function preJoinRoom(openStatus,openTime,timeText,joinType) {
        joinRoomShowTitle(openStatus, timeText, joinType)
        if(openStatus != 1){
          let endDate = strToDate(openTime).getTime();
          let leftTimeInterval = setInterval(function(){
            //获取当前时间
            let startDate = new Date().getTime();
            //时间差
            let leftTime = endDate - startDate;
            if (leftTime<=0){
              joinRoomShowTitle(1,'','mixRoom');
              clearInterval(leftTimeInterval);
            }
          },1000)
        }
      }

      //字符串转日期格式，strDate要转为日期格式的字符串
      function isStart(strDate) {
        var st = strDate;
        var a = st.split(" ");
        var b = a[0].split("-");
        var c = a[1].split(":");
        var date = new Date(b[0], parseInt(b[1])-1, b[2], c[0], c[1], c[2])
        var compareResult = new Date() > date
        var result = 0;
        if(compareResult){
          result = 1;
        }
        return result;
      }

      function strToDate(strDate) {
        var st = strDate;
        var a = st.split(" ");
        var b = a[0].split("-");
        var c = a[1].split(":");
        var date = new Date(b[0], parseInt(b[1])-1, b[2], c[0], c[1], c[2])
        return date;
      }
    }
  },
  mounted() {
    document.addEventListener('UniAppJSBridgeReady', function() {
      // eslint-disable-next-line no-undef
      console.log("UniAppJSBridgeReady")
      const state = reactive({});

      const handler = {
        // eslint-disable-next-line no-unused-vars
        get(target, key) {
          if (key !== '__v_isRef') {
            return function (params1, params2, params3) {
              return new Promise((resolve) => {
                const uuidFunc = getUuid();
                window[uuidFunc] = function (ret) {
                  resolve(ret);
                  window[uuidFunc] = null
                };
                // eslint-disable-next-line no-undef
                uni.postMessage({
                  data: {
                    func: key,
                    params1: params1,
                    params2: params2,
                    params3: params3,
                    retFunc: uuidFunc,
                  },
                });
              });
            }
          }
          return target[key];
        },
      };

      this.trtc = new Proxy(state, handler);
    }.bind(this));
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
