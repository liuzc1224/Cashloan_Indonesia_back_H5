window.STI_JSSIP = {

  jssip_login : function(account, password) {
    // 如果没有初始化和登录过
    if (!window.userAgent || !window.userAgent.isConnected() || !window.userAgent.isRegistered()) {
      window.userAgent = null;
      window.jssipIsConnected = false;
      window.jssipIsRegistered = false;
      // 呼叫时长
      window.jssipCallDuration = 0;

      // 本地语音流
      window.localStream = null;

      var socket = new JsSIP.WebSocketInterface('wss://csweb1.kmindo.com:9343');
      var configuration = {
        sockets: [ socket ],
        uri: 'sip:' + account + '@csweb1.kmindo.com:9568',
        authorization_user: account,
        display_name: account,
        password: password,
        register: true
      };

      try {
        window.userAgent = new JsSIP.UA(configuration);

        STI_JSSIP.addEventListener();

        window.userAgent.start();
      } catch(e) {
        console.log('登录异常:' + e);
      }
    }
    // 没有登录成功
    else {
      // 不作操作，第一次登录的时候已经启用了自动登录机制
    }
  },

  // 添加事件监听
  addEventListener : function() {
    window.userAgent.on('connected', function (data) {
      console.log('连接SIP成功...');
    });

    window.userAgent.on('connecting', function (data) {
      console.log('正在连接SIP...');
      STI_GUI.set_call_status_txt('Connecting...');
    });

    // 连接失败
    window.userAgent.on('disconnected', function (data) {
      console.log('连接SIP失败...');
      STI_GUI.set_call_status_txt('Connection Failed');
    });

    window.userAgent.on('registered', function (data) {
      console.log('登录注册SIP成功...');
      STI_GUI.set_call_status_txt('Calling');
    });

    window.userAgent.on('registrationFailed', function (data) {
      console.log('登录注册SIP失败...', data.cause, data.response);
      // SIP注册失败不会重连，需要自己控制重连机制

      var delay = 1000;

      // 用户名或密码错误
      if (data.cause == 'Rejected') {
        delay = 20000;
        STI_GUI.set_call_status_txt('Register Rejected', '#eb2629');
      }

      setTimeout(function () {
        if (window.userAgent.isConnected() && !window.userAgent.isRegistered()) {
          window.userAgent.register();
        }
      }, delay);
    });

    window.userAgent.on('newRTCSession', function(data) {
      // 当前呼叫的通话Session

      // TODO 3.3.x版本获取音频流方法
      var callSession = data.session;
      callSession.connection.addEventListener('addstream', function (ev) {
        window.jssipAudioPlay.srcObject = ev.stream;
      });

      // TODO 3.0.13版本获取音频流方法
      // data.session.on('peerconnection', function(data) {
      //     console.info('newRTCSession-Peerconnection: ', data.originator);
      //     data.peerconnection.onaddstream = function(ev) {
      //         console.info('onaddstream from remote - ', ev);
      //         window.jssipAudioPlay.srcObject = ev.stream;
      //     };
      // });
    });
  },

  call : function (msisdn) {
    var eventHandlers = {
      'progress': function(data) {
        window.jssipCallDuration = 0;

        // 正在呼叫
        console.log('call is in progress');
        STI_GUI.set_call_status_txt('Calling');
      },
      'failed': function(data) {
        console.log('call failed with cause: '+ data.cause);

        STI_GUI.stop_timing_call_duration();

        STI_GUI.set_call_status_txt(data.cause);

        if (data.cause == 'Unavailable') {
          STI_GUI.call_terminated(true);
        }
      },
      'confirmed': function(data) {
        // 电话接听
        console.log('call confirmed');
        STI_GUI.set_call_status_txt('Call established');
        STI_GUI.start_timing_call_duration();
      },
      'ended': function(data) {
        // 呼叫终止
        console.log('call ended with cause: '+ data.cause);

        // 挂断
        STI_GUI.set_call_status_txt('Call ended');
        STI_GUI.call_terminated(true);
      }
    };

    var options = {
      'eventHandlers'    : eventHandlers,
      'mediaConstraints' : { 'audio': true, 'video': false },
      'mediaStream'      : window.localStream
    };

    if (window.sti_extend_id && window.sti_voip_account && window.sti_msisdn) {
      options.extraHeaders = [ 'x-extend-id: ' + window.sti_extend_id, 'x-extend-post-url: ' + window.sti_post_url, 'x-extend-channel-key: ' + window.sti_channel_key ];
    }

    console.info("连接状态..." + window.userAgent.isConnected() + " " + window.userAgent.isRegistered());

    window.userAgent.call('sip:' + msisdn + '@csweb1.kmindo.com:9568', options);

  },

  // 呼叫终止
  call_terminated : function () {
    if (window.userAgent && window.userAgent.isConnected() && window.userAgent.isRegistered()) {
      // 终止正在进行的通话
      window.userAgent.terminateSessions();
    }
  }

};
