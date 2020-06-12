window.STI = {

  // 登录账号-请在主页面框架调用
  login : function (account, password, channelKey, voipAccount, voipPassword) {
    STI_JSSIP.jssip_login(voipAccount, voipPassword);
  },

  // 适应原先配置
  init : function (clickViewId, divid, account, password, channelKey, voipAccount, voipPassword, senderId, phone, extendId, postUrl) {
    this.call(clickViewId, divid, account, password, channelKey, voipAccount, voipPassword, phone, extendId, postUrl);
  },

  // 呼叫操作
  call : function (clickViewId, divid, account, password, channelKey, voipAccount, voipPassword, phone, extendId, postUrl) {
    console.log('bind call click event', clickViewId, divid);

    // 防止同一id的控件重复绑定点击事件
    $('#' + clickViewId).off('click').on('click', function () {

      // 转换成标准号码格式
      var msisdn = STI_GUI.msisdn_format(phone);

      console.log('call click event', clickViewId, divid, account, voipAccount, voipPassword, msisdn);

      // 是否已点击标志，防止多次被点击
      if (!window.sti_call_click_tag || window.sti_call_click_tag == 0) {
        window.sti_call_click_tag = 1;
        window.sti_call_click_view_id = clickViewId;

        // 控制点击间隔，有些开发把事件绑定了多个事件，导致每次点击重复点击多次
        // 使按钮不能被点击
        $('#' + clickViewId).attr('disabled', 'disabled');

        // 保存到全局
        window.sti_account = account;
        window.sti_password = password;
        window.sti_channel_key = channelKey;
        window.sti_voip_account = voipAccount;
        window.sti_voip_password = voipPassword;
        window.sti_msisdn = msisdn;
        window.sti_extend_id = extendId;
        window.sti_post_url = postUrl;

        STI_GUI.play_sound('pound');

        // 显示呼叫弹框
        // 获取点击坐标位置并设置iframe的显示位置
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        var width = $(this).width();

        STI_GUI.show_call_dialog(divid, top, left, width, msisdn);

        // 登录jssip
        STI_JSSIP.jssip_login(voipAccount, voipPassword);

        // 已连接状态直接呼叫
        if (window.userAgent.isConnected() && window.userAgent.isRegistered()) {
          STI_JSSIP.call(msisdn);
        }
        // 定时获取SIP登录状态
        else {
          // 定时更新登录状态
          var callTimer = setInterval(function () {
            if (window.userAgent.isConnected() && window.userAgent.isRegistered()) {
              clearInterval(callTimer);

              console.info("开始呼叫..." + window.userAgent.isConnected() + " " + window.userAgent.isRegistered());

              STI_JSSIP.call(msisdn);
            }
          }, 300);
          window.sti_call_timer = callTimer;
        }

        var callTextStatusTimer = setInterval(function () {
          var callStatus = $('#sti-call-status-txt').text();
          if (callStatus == 'Calling') {
            STI_GUI.set_call_status_txt('Calling..');
          } else if (callStatus == 'Calling..') {
            STI_GUI.set_call_status_txt('Calling....');
          } else if (callStatus == 'Calling....') {
            STI_GUI.set_call_status_txt('Calling......');
          } else if (callStatus == 'Calling......') {
            STI_GUI.set_call_status_txt('Calling........');
          } else if (callStatus == 'Calling........') {
            STI_GUI.set_call_status_txt('Calling..');
          } else {
            clearInterval(callTextStatusTimer);
          }
        }, 1000);
        window.sti_call_text_status_timer = callTextStatusTimer;

        // 页面关闭
        window.onunload = function() {
          console.log('呼叫页面关闭');
          STI_GUI.call_terminated();
        }
      }
      // 如果有呼叫正在呼叫，弹出确认挂断之前的弹框
      else if (window.sti_call_click_tag = 1) {
        console.log('点击标志：' + window.sti_call_click_tag);

        window.sti_call_new_click_view_id = clickViewId;

        // 显示呼叫弹框
        // 获取点击坐标位置并设置iframe的显示位置
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        var width = $(this).width();

        STI_GUI.show_close_calling_dialog(divid, top, left, width);
      }
    });
  },

};
// window.STI_GUI = {
//
//   // 显示是否关闭当前正在呼叫的弹框
//   show_close_calling_dialog : function(divid, top, left, width) {
//     // ------页面展示开始------
//     var callDialogHtml = [];
//     // callDialogHtml.push("<div id='div-sti-close-calling-dialog' style='position: absolute; left: " + parseInt(left + width + 30) + "px; top: " + parseInt(top - 10) + "px;'>");
//     callDialogHtml.push("<div id='div-sti-close-calling-dialog' style='position: fixed; z-index: 9999999; background-color: white;>");
//     callDialogHtml.push("<div style='border-radius:5px; border:1px solid #ccc; width: 270px;'>");
//     callDialogHtml.push("<div style='background-color: #ccc; padding: 8px;'>");
//     callDialogHtml.push("<label style='margin-right: 8px; text-align: center; font-size: 16px; color: black; font-weight: bold;'>STI VOIP SYSTEM</label>");
//     callDialogHtml.push("<img onclick='STI_GUI.close_close_calling_dialog();' src='https://cs.kmindo.com:8443/pages/jssip/images/icon_close_alt.png' style='width: 25px; height: 25px; float: right; margin-top: -3px;'>");
//     callDialogHtml.push("</div>");
//
//     callDialogHtml.push("<div>");
//     callDialogHtml.push("<div style='padding: 12px; text-align: center; font-size: 18px;'>Do you want to close the current call for a new call?</div>");
//
//     callDialogHtml.push("<div onclick='STI_GUI.start_new_call();' style='line-height: 35px; text-align: center; background-color: #dfdfdf; height: 35px; margin-top: 4px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;'>");
//     callDialogHtml.push("Click To Start A New Call");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//
//     $('#' + divid).append(callDialogHtml.join(''));
//     // ------页面展示结束------
//   },
//
//   close_close_calling_dialog : function() {
//     $('#div-sti-close-calling-dialog').remove();
//   },
//
//   start_new_call : function() {
//     STI_GUI.call_terminated(false);
//     STI_GUI.close_close_calling_dialog();
//     $('#' + window.sti_call_new_click_view_id).click();
//   },
//
//   // 显示呼叫弹框
//   show_call_dialog : function(divid, top, left, width, msisdn) {
//     // ------页面展示开始------
//
//     // 音频播放器
//     var audioElement = new Audio();
//     audioElement.autoplay = true;
//     audioElement.volume = 1;
//     window.jssipAudioPlay = audioElement;
//
//     // 如果存在先移除
//     $('#div-sti-call-dialog').remove();
//     // 停掉可能正在通话的
//     STI_JSSIP.call_terminated();
//
//     var callDialogHtml = [];
//     // callDialogHtml.push("<div id='div-sti-call-dialog' style='position: absolute; left: " + parseInt(left + width + 30) + "px; top: " + parseInt(top - 10) + "px;'>");
//     callDialogHtml.push("<div id='div-sti-call-dialog' style='position: fixed; z-index: 9999999; background-color: white;margin-left: -200px'>");
//     callDialogHtml.push("<div id='dialog-call-voip' style='border-radius:5px; border:1px solid #ccc; width: 270px;'>");
//     callDialogHtml.push("<div style='background-color: #ccc; padding: 8px;'>");
//     callDialogHtml.push("<label id='call-voip-title' style='margin-right: 8px; font-size: 16px; color: black; font-weight: bold;'>STI VOIP SYSTEM</label>");
//     callDialogHtml.push("<img id='btn-call-voip-close-dialog' onclick='STI_GUI.call_terminated(true);' src='https://cs.kmindo.com:8443/pages/jssip/images/icon_close_alt.png' style='width: 25px; height: 25px; float: right; margin-top: -3px;'>");
//     callDialogHtml.push('</div>');
//
//     callDialogHtml.push('<div>');
//     callDialogHtml.push("<img src='https://cs.kmindo.com:8443/pages/jssip/images/img-user.png' style='float: left; height: 60px; margin-left: 4px;'>");
//     callDialogHtml.push("<div class='calling-info' style='height: 60px; margin-left: 75px; margin-top: 6px;'>");
//     // 呼叫状态显示
//     callDialogHtml.push("<div id='sti-call-status-txt' style='color: #303030; font-size: 14px; padding-top: 2px; font-weight: bold;'>Calling</div>");
//     callDialogHtml.push("<div style='border-bottom:1px solid #dddddd; margin-top: 2px;'></div>");
//     callDialogHtml.push("<div id='calling-number' style='color: #303030; font-size: 18px; margin-top: 2px;'>" + msisdn + "</div>");
//     callDialogHtml.push("</div>");
//
//     callDialogHtml.push("<div style='background-color: #dfdfdf; height: 35px; margin-top: 4px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;'>");
//     callDialogHtml.push("<label id='sti-call-duration' style='display: none; line-height: 36px; margin-left: 10px; font-size: 15px;'>00:00</label>");
//     callDialogHtml.push("<img id='btn-voip-hangup' onclick='STI_GUI.call_terminated(true);' src='https://cs.kmindo.com:8443/pages/jssip/images/btn-hangup.png' style='height: 35px; float: right; border-bottom-right-radius: 5px;'>");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//     callDialogHtml.push("</div>");
//
//     $('#' + divid).append(callDialogHtml.join(''));
//     // ------页面展示结束------
//
//   },
//
//   // 呼叫信息显示
//   set_call_status_txt : function (txt, color) {
//     $('#sti-call-status-txt').text(txt);
//
//     if (color) {
//       $('#sti-call-status-txt').attr('style', 'color: ' + color + '; font-size: 14px; padding-top: 2px; font-weight: bold;');
//     } else {
//       $('#sti-call-status-txt').attr('style', 'color: #303030; font-size: 14px; padding-top: 2px; font-weight: bold;');
//     }
//   },
//
//   // 开始计时呼叫时长
//   start_timing_call_duration : function () {
//
//     $('#sti-call-duration').show();
//     $('#sti-call-duration').val('00:00');
//
//     if (window.timingCallDurationTimer) {
//       clearInterval(window.timingCallDurationTimer);
//     }
//
//     window.timingCallDurationTimer = setInterval(function () {
//
//       window.jssipCallDuration = window.jssipCallDuration + 1;
//
//       var minute = Math.floor(window.jssipCallDuration / 60);
//       var second = window.jssipCallDuration % 60;
//
//       if (minute > 0) {
//         if (minute < 10) {
//           minute = '0' + minute;
//         } else {
//           minute = minute;
//         }
//       } else {
//         minute = '00';
//       }
//
//       if (second > 0) {
//         if (second < 10) {
//           second = '0' + second;
//         } else {
//           second = second;
//         }
//       } else {
//         second = '00';
//       }
//
//       STI_GUI.set_call_duration(minute + ':' + second);
//
//     }, 1000);
//   },
//
//   // 停止呼叫计时
//   stop_timing_call_duration : function() {
//     $('#sti-call-duration').hide();
//     $('#sti-call-duration').val('00:00');
//
//     if (window.timingCallDurationTimer) {
//       clearInterval(window.timingCallDurationTimer);
//     }
//   },
//
//   // 呼叫时长显示
//   set_call_duration : function (duration) {
//     $('#sti-call-duration').text(duration);
//   },
//
//   // 呼叫终止
//   call_terminated : function (playSound) {
//     clearInterval(window.sti_call_timer);
//     clearInterval(window.sti_call_text_status_timer);
//
//     window.sti_call_click_tag = 0 ;
//     // 使按钮能够被点击
//     $('#' + window.sti_call_click_view_id).removeAttr("disabled");
//
//     // 停止呼叫计时
//     STI_GUI.stop_timing_call_duration();
//
//     STI_GUI.set_call_status_txt('Terminated');
//
//     $('#div-sti-call-dialog').remove();
//
//     // JSSIP呼叫终止
//     STI_JSSIP.call_terminated();
//     if (playSound) {
//       STI_GUI.play_sound('pound');
//     }
//   },
//
//   // 播放声音文件
//   play_sound : function (sound_file) {
//     var soundPlayer = new Audio();
//     soundPlayer.autoplay = true;
//     soundPlayer.volume = 1;
//
//     soundPlayer.setAttribute("src", "https://cs.kmindo.com:8443/pages/jssip/sounds/dialpad/" + sound_file + ".ogg");
//     soundPlayer.play();
//   },
//
//   // 将号码解析成统一格式的号码
//   msisdn_format : function (msisdn) {
//     // 原号码
//     console.log('old msisdn: ' + msisdn);
//
//     // 替换异常字符串
//     msisdn = msisdn.replace(new RegExp('-', 'g'), '').replace(new RegExp(' ', 'g'), '');
//     // +62国家码开头
//     if (msisdn.startsWith('+62')) {
//       msisdn = msisdn.replace('+62', '0');
//     }
//     // 62开头
//     else if (msisdn.startsWith('62')) {
//       msisdn = msisdn.replace('62', '0');
//     }
//     // 其它非0开头的号码
//     else if (!msisdn.startsWith('0')) {
//       msisdn = '0' + msisdn;
//     }
//
//     // 如果是两个0开头转成一个0
//     if (msisdn.startsWith('00')) {
//       msisdn = msisdn.replace('00', '0');
//     }
//
//     // 转换后的正常号码
//     console.log('changed msisdn: ', msisdn);
//
//     return msisdn;
//   }
//
// };
// window.STI_JSSIP = {
//
//   jssip_login : function(account, password) {
//     // 如果没有初始化和登录过
//     if (!window.userAgent || !window.userAgent.isConnected() || !window.userAgent.isRegistered()) {
//       window.userAgent = null;
//       window.jssipIsConnected = false;
//       window.jssipIsRegistered = false;
//       // 呼叫时长
//       window.jssipCallDuration = 0;
//
//       // 本地语音流
//       window.localStream = null;
//
//       var socket = new JsSIP.WebSocketInterface('wss://csweb1.kmindo.com:9343');
//       var configuration = {
//         sockets: [ socket ],
//         uri: 'sip:' + account + '@csweb1.kmindo.com:9568',
//         authorization_user: account,
//         display_name: account,
//         password: password,
//         register: true
//       };
//
//       try {
//         window.userAgent = new JsSIP.UA(configuration);
//
//         STI_JSSIP.addEventListener();
//
//         window.userAgent.start();
//       } catch(e) {
//         console.log('登录异常:' + e);
//       }
//     }
//     // 没有登录成功
//     else {
//       // 不作操作，第一次登录的时候已经启用了自动登录机制
//     }
//   },
//
//   // 添加事件监听
//   addEventListener : function() {
//     window.userAgent.on('connected', function (data) {
//       console.log('连接SIP成功...');
//     });
//
//     window.userAgent.on('connecting', function (data) {
//       console.log('正在连接SIP...');
//       STI_GUI.set_call_status_txt('Connecting...');
//     });
//
//     // 连接失败
//     window.userAgent.on('disconnected', function (data) {
//       console.log('连接SIP失败...');
//       STI_GUI.set_call_status_txt('Connection Failed');
//     });
//
//     window.userAgent.on('registered', function (data) {
//       console.log('登录注册SIP成功...');
//       STI_GUI.set_call_status_txt('Calling');
//     });
//
//     window.userAgent.on('registrationFailed', function (data) {
//       console.log('登录注册SIP失败...', data.cause, data.response);
//       // SIP注册失败不会重连，需要自己控制重连机制
//
//       var delay = 1000;
//
//       // 用户名或密码错误
//       if (data.cause == 'Rejected') {
//         delay = 20000;
//         STI_GUI.set_call_status_txt('Register Rejected', '#eb2629');
//       }
//
//       setTimeout(function () {
//         if (window.userAgent.isConnected() && !window.userAgent.isRegistered()) {
//           window.userAgent.register();
//         }
//       }, delay);
//     });
//
//     window.userAgent.on('newRTCSession', function(data) {
//       // 当前呼叫的通话Session
//
//       // TODO 3.3.x版本获取音频流方法
//       var callSession = data.session;
//       callSession.connection.addEventListener('addstream', function (ev) {
//         window.jssipAudioPlay.srcObject = ev.stream;
//       });
//
//       // TODO 3.0.13版本获取音频流方法
//       // data.session.on('peerconnection', function(data) {
//       //     console.info('newRTCSession-Peerconnection: ', data.originator);
//       //     data.peerconnection.onaddstream = function(ev) {
//       //         console.info('onaddstream from remote - ', ev);
//       //         window.jssipAudioPlay.srcObject = ev.stream;
//       //     };
//       // });
//     });
//   },
//
//   call : function (msisdn) {
//     var eventHandlers = {
//       'progress': function(data) {
//         window.jssipCallDuration = 0;
//
//         // 正在呼叫
//         console.log('call is in progress');
//         STI_GUI.set_call_status_txt('Calling');
//       },
//       'failed': function(data) {
//         console.log('call failed with cause: '+ data.cause);
//
//         STI_GUI.stop_timing_call_duration();
//
//         STI_GUI.set_call_status_txt(data.cause);
//
//         if (data.cause == 'Unavailable') {
//           STI_GUI.call_terminated(true);
//         }
//       },
//       'confirmed': function(data) {
//         // 电话接听
//         console.log('call confirmed');
//         STI_GUI.set_call_status_txt('Call established');
//         STI_GUI.start_timing_call_duration();
//       },
//       'ended': function(data) {
//         // 呼叫终止
//         console.log('call ended with cause: '+ data.cause);
//
//         // 挂断
//         STI_GUI.set_call_status_txt('Call ended');
//         STI_GUI.call_terminated(true);
//       }
//     };
//
//     var options = {
//       'eventHandlers'    : eventHandlers,
//       'mediaConstraints' : { 'audio': true, 'video': false },
//       'mediaStream'      : window.localStream
//     };
//
//     if (window.sti_extend_id && window.sti_voip_account && window.sti_msisdn) {
//       options.extraHeaders = [ 'x-extend-id: ' + window.sti_extend_id, 'x-extend-post-url: ' + window.sti_post_url, 'x-extend-channel-key: ' + window.sti_channel_key ];
//     }
//
//     console.info("连接状态..." + window.userAgent.isConnected() + " " + window.userAgent.isRegistered());
//
//     window.userAgent.call('sip:' + msisdn + '@csweb1.kmindo.com:9568', options);
//
//   },
//
//   // 呼叫终止
//   call_terminated : function () {
//     if (window.userAgent && window.userAgent.isConnected() && window.userAgent.isRegistered()) {
//       // 终止正在进行的通话
//       window.userAgent.terminateSessions();
//     }
//   }
//
// };
