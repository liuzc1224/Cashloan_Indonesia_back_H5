window.STI_GUI = {

  // 显示是否关闭当前正在呼叫的弹框
  show_close_calling_dialog : function(divid, top, left, width) {
    // ------页面展示开始------
    var callDialogHtml = [];
    // callDialogHtml.push("<div id='div-sti-close-calling-dialog' style='position: absolute; left: " + parseInt(left + width + 30) + "px; top: " + parseInt(top - 10) + "px;'>");
    callDialogHtml.push("<div id='div-sti-close-calling-dialog' style='position: fixed; z-index: 9999999; background-color: white;>");
    callDialogHtml.push("<div style='border-radius:5px; border:1px solid #ccc; width: 270px;'>");
    callDialogHtml.push("<div style='background-color: #ccc; padding: 8px;'>");
    callDialogHtml.push("<label style='margin-right: 8px; text-align: center; font-size: 16px; color: black; font-weight: bold;'>STI VOIP SYSTEM</label>");
    callDialogHtml.push("<img onclick='STI_GUI.close_close_calling_dialog();' src='https://cs.kmindo.com:8443/pages/jssip/images/icon_close_alt.png' style='width: 25px; height: 25px; float: right; margin-top: -3px;'>");
    callDialogHtml.push("</div>");

    callDialogHtml.push("<div>");
    callDialogHtml.push("<div style='padding: 12px; text-align: center; font-size: 18px;'>Do you want to close the current call for a new call?</div>");

    callDialogHtml.push("<div onclick='STI_GUI.start_new_call();' style='line-height: 35px; text-align: center; background-color: #dfdfdf; height: 35px; margin-top: 4px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;'>");
    callDialogHtml.push("Click To Start A New Call");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");

    $('#' + divid).append(callDialogHtml.join(''));
    // ------页面展示结束------
  },

  close_close_calling_dialog : function() {
    $('#div-sti-close-calling-dialog').remove();
  },

  start_new_call : function() {
    STI_GUI.call_terminated(false);
    STI_GUI.close_close_calling_dialog();
    $('#' + window.sti_call_new_click_view_id).click();
  },

  // 显示呼叫弹框
  show_call_dialog : function(divid, top, left, width, msisdn) {
    // ------页面展示开始------

    // 音频播放器
    var audioElement = new Audio();
    audioElement.autoplay = true;
    audioElement.volume = 1;
    window.jssipAudioPlay = audioElement;

    // 如果存在先移除
    $('#div-sti-call-dialog').remove();
    // 停掉可能正在通话的
    STI_JSSIP.call_terminated();

    var callDialogHtml = [];
    // callDialogHtml.push("<div id='div-sti-call-dialog' style='position: absolute; left: " + parseInt(left + width + 30) + "px; top: " + parseInt(top - 10) + "px;'>");
    callDialogHtml.push("<div id='div-sti-call-dialog' style='position: fixed; z-index: 9999999; background-color: white;margin-left: -200px'>");
    callDialogHtml.push("<div id='dialog-call-voip' style='border-radius:5px; border:1px solid #ccc; width: 270px;'>");
    callDialogHtml.push("<div style='background-color: #ccc; padding: 8px;'>");
    callDialogHtml.push("<label id='call-voip-title' style='margin-right: 8px; font-size: 16px; color: black; font-weight: bold;'>STI VOIP SYSTEM</label>");
    callDialogHtml.push("<img id='btn-call-voip-close-dialog' onclick='STI_GUI.call_terminated(true);' src='https://cs.kmindo.com:8443/pages/jssip/images/icon_close_alt.png' style='width: 25px; height: 25px; float: right; margin-top: -3px;'>");
    callDialogHtml.push('</div>');

    callDialogHtml.push('<div>');
    callDialogHtml.push("<img src='https://cs.kmindo.com:8443/pages/jssip/images/img-user.png' style='float: left; height: 60px; margin-left: 4px;'>");
    callDialogHtml.push("<div class='calling-info' style='height: 60px; margin-left: 75px; margin-top: 6px;'>");
    // 呼叫状态显示
    callDialogHtml.push("<div id='sti-call-status-txt' style='color: #303030; font-size: 14px; padding-top: 2px; font-weight: bold;'>Calling</div>");
    callDialogHtml.push("<div style='border-bottom:1px solid #dddddd; margin-top: 2px;'></div>");
    callDialogHtml.push("<div id='calling-number' style='color: #303030; font-size: 18px; margin-top: 2px;'>" + msisdn + "</div>");
    callDialogHtml.push("</div>");

    callDialogHtml.push("<div style='background-color: #dfdfdf; height: 35px; margin-top: 4px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;'>");
    callDialogHtml.push("<label id='sti-call-duration' style='display: none; line-height: 36px; margin-left: 10px; font-size: 15px;'>00:00</label>");
    callDialogHtml.push("<img id='btn-voip-hangup' onclick='STI_GUI.call_terminated(true);' src='https://cs.kmindo.com:8443/pages/jssip/images/btn-hangup.png' style='height: 35px; float: right; border-bottom-right-radius: 5px;'>");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");
    callDialogHtml.push("</div>");

    $('#' + divid).append(callDialogHtml.join(''));
    // ------页面展示结束------

  },

  // 呼叫信息显示
  set_call_status_txt : function (txt, color) {
    $('#sti-call-status-txt').text(txt);

    if (color) {
      $('#sti-call-status-txt').attr('style', 'color: ' + color + '; font-size: 14px; padding-top: 2px; font-weight: bold;');
    } else {
      $('#sti-call-status-txt').attr('style', 'color: #303030; font-size: 14px; padding-top: 2px; font-weight: bold;');
    }
  },

  // 开始计时呼叫时长
  start_timing_call_duration : function () {

    $('#sti-call-duration').show();
    $('#sti-call-duration').val('00:00');

    if (window.timingCallDurationTimer) {
      clearInterval(window.timingCallDurationTimer);
    }

    window.timingCallDurationTimer = setInterval(function () {

      window.jssipCallDuration = window.jssipCallDuration + 1;

      var minute = Math.floor(window.jssipCallDuration / 60);
      var second = window.jssipCallDuration % 60;

      if (minute > 0) {
        if (minute < 10) {
          minute = '0' + minute;
        } else {
          minute = minute;
        }
      } else {
        minute = '00';
      }

      if (second > 0) {
        if (second < 10) {
          second = '0' + second;
        } else {
          second = second;
        }
      } else {
        second = '00';
      }

      STI_GUI.set_call_duration(minute + ':' + second);

    }, 1000);
  },

  // 停止呼叫计时
  stop_timing_call_duration : function() {
    $('#sti-call-duration').hide();
    $('#sti-call-duration').val('00:00');

    if (window.timingCallDurationTimer) {
      clearInterval(window.timingCallDurationTimer);
    }
  },

  // 呼叫时长显示
  set_call_duration : function (duration) {
    $('#sti-call-duration').text(duration);
  },

  // 呼叫终止
  call_terminated : function (playSound) {
    clearInterval(window.sti_call_timer);
    clearInterval(window.sti_call_text_status_timer);

    window.sti_call_click_tag = 0 ;
    // 使按钮能够被点击
    $('#' + window.sti_call_click_view_id).removeAttr("disabled");

    // 停止呼叫计时
    STI_GUI.stop_timing_call_duration();

    STI_GUI.set_call_status_txt('Terminated');

    $('#div-sti-call-dialog').remove();

    // JSSIP呼叫终止
    STI_JSSIP.call_terminated();
    if (playSound) {
      STI_GUI.play_sound('pound');
    }
  },

  // 播放声音文件
  play_sound : function (sound_file) {
    var soundPlayer = new Audio();
    soundPlayer.autoplay = true;
    soundPlayer.volume = 1;

    soundPlayer.setAttribute("src", "https://cs.kmindo.com:8443/pages/jssip/sounds/dialpad/" + sound_file + ".ogg");
    soundPlayer.play();
  },

  // 将号码解析成统一格式的号码
  msisdn_format : function (msisdn) {
    // 原号码
    console.log('old msisdn: ' + msisdn);

    // 替换异常字符串
    msisdn = msisdn.replace(new RegExp('-', 'g'), '').replace(new RegExp(' ', 'g'), '');
    // +62国家码开头
    if (msisdn.startsWith('+62')) {
      msisdn = msisdn.replace('+62', '0');
    }
    // 62开头
    else if (msisdn.startsWith('62')) {
      msisdn = msisdn.replace('62', '0');
    }
    // 其它非0开头的号码
    else if (!msisdn.startsWith('0')) {
      msisdn = '0' + msisdn;
    }

    // 如果是两个0开头转成一个0
    if (msisdn.startsWith('00')) {
      msisdn = msisdn.replace('00', '0');
    }

    // 转换后的正常号码
    console.log('changed msisdn: ', msisdn);

    return msisdn;
  }

};
