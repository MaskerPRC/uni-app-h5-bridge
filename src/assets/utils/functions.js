var closeTimeLong = 2;
/**
 * 
 * @param msg 提示信息
 * @param isSuccess 是否成功
 * @param closeTime 提示框关闭的时间长度 单位为秒
 * @param closeCallBack 提示框关闭时的回调函数
 * @param direction 提示框出现的方向 左上(left-top),上(top), 右上(right-top),右下(right-bottom),下(bottom),左下(left-bottom),左('left')。
 */
function myMsg(msg, isSuccess, closeTime, closeCallBack, direction) {
	layer.msg(msg, closeTime ? closeTime : closeTimeLong, {
		type: isSuccess ? 1 : 3,
		rate: direction ? direction : 'top',
		shade: [ 0 ]
	}, function() {
		closeCallBack ? closeCallBack() : null;
	});
};

function alertTips(tips) {
	myMsg(tips, true, 2, null, null);
}

function _error(tips) {
	myMsg(tips, false, 2, null, null);
}

function _warn(tips) {
	myMsg(tips, true, 3, null, null);
}

function _tip(tips) {
	myMsg(tips, true, 2, null, null);
}

/**
 * 关闭弹出窗
 */
function closeWin() {
	window.opener = null;
	window.open("", "_self");
	window.close();
};

/**
 * 打开新窗口
 * @param action url
 * @param param 参数{"a":a", "b":"b"}.json对象
 * @param type 请求方法类型 POST GET
 */
function openNewWin(action, param, type) {
	var _FORM = document.createElement('form');
	document.body.appendChild(_FORM);
	_FORM.action = action;
	_FORM.method = type;
	_FORM.target = '_blank';
	for ( var name in param) {
		var input = document.createElement("input");
		input.name = name;
		input.value = param[name];
		$(input).css("display", "none");
		_FORM.appendChild(input);
	}
	_FORM.submit();
};

/**
 * 询问框
 * @param msg 询问信息
 * @param yesFunction 点击确定时回调函数
 * @param noFuntion 点击取消的回调函数
 * @param direction 弹出框的弹出方向
 */
function myConfirm(msg, yesFunction, noFunction, direction) {

	$.layer({
		shade: [ 0 ],
		dialog: {
			msg: msg,
			btns: 2,
			type: 4,
			rate: direction ? direction : 'top',
			btn: [ '确定', '取消' ],
			yes: function() {
				if (yesFunction) {
					yesFunction();
					layer.closeAll();
				}
				;
			},
			no: function() {
				if (noFunction) {
					noFunction();
				}
			}
		}
	});
};

/**
 * 
 * @param msg 提示信息
 * @param object jquery选择器
 * @param duration 持续时长，单位为秒，如果为false,则为3秒
 * @param maxWidth 最大宽度，如果为false，则为185
 */
function myTips(msg, object, duration, maxWidth) {
	layer.tips(msg, object, {
		style: [ 'background-color:#78BA32; color:#fff', '#78BA32' ],
		maxWidth: maxWidth ? maxWidth : 185,
		time: duration ? duration : 3
	});
};

/**
 * 提示等待的方法
 * @param duration 时间长度 单位为秒，如果传false,则一直不消失
 */
function myLoad(duration) {
	layer.load(duration ? duration : -1);
};

/**
 * 执行ajax post请求
 * @param url 请求地址
 * @param data 请求参数
 * @param callback1 请求成功的回调函数
 * @param callback2 请求失败的回调函数
 * @param async 是否异步
 */
function doAjax(url, data, callback1, callback2, async) {
	$.ajax({
		url: url,
		async: async,
		type: "POST",
		dataType: "json",
		data: data,
		success: callback1,
		error: callback2
	});
};

/**
 * 删除隐藏的IDialog
 */
function clearHiddenIDialog() {
	$("div.i-dialog:hidden").remove();
	$("div.i-dialog-lock:hidden").remove();
};

/**
 * trim
 * 
 * @param string
 * @returns
 */
function trimString(string) {
	if (string) {
		return string.replace(/(^\s*)|(\s*$)/g, "");
	}
	return string;
};

$("textarea[maxlength]").keyup(function() {
	var area = $(this);
	var max = parseInt(area.attr("maxlength"), 10); // 获取maxlength的值
	if (max > 0) {
		if (area.val().length > max) { // textarea的文本长度大于maxlength
			area.val(area.val().substr(0, max)); // 截断textarea的文本重新赋值
		}
	}
});

//yyyy-MM-dd
function timeFormat(time) {
	var datetime = new Date();
	datetime.setTime(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	
	return year + "-" + month + "-" + date;
	
};

//yyyy-MM-dd hh:mm:ss
function timeFormatDate(time) {
	var datetime = new Date();
	datetime.setTime(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hours = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second  = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	
	return year + "-" + month + "-" + date + " " + hours + ":"+ minute + ":" + second;
};

// 复制的字符处理问题
$("textarea[maxlength]").blur(function() {
	var area = $(this);
	var max = parseInt(area.attr("maxlength"), 10); // 获取maxlength的值
	if (max > 0) {
		if (area.val().length > max) { // textarea的文本长度大于maxlength
			area.val(area.val().substr(0, max)); // 截断textarea的文本重新赋值
		}
	}
});

/**
 * 设置input光标位置
 * 
 */
$.fn.setCursorPosition = function(position) {
	if (this.lengh == 0)
		return this;
	return $(this).setSelection(position, position);
};
/**
 * 设置input文本选择
 * 
 */
$.fn.setSelection = function(selectionStart, selectionEnd) {
	if (this.lengh == 0)
		return this;
	input = this[0];

	if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	} else if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}

	return this;
};
/**
 * 设置input文本光标到最后
 * 
 */
$.fn.focusEnd = function() {
	this.setCursorPosition(this.val().length);
};

// StringBuffer类以实现字符串高性能拼接
function StringBuffer() {
	this.__strings__ = [];
};
StringBuffer.prototype.append = function(str) {
	this.__strings__.push(str);
};
StringBuffer.prototype.toString = function() {
	return this.__strings__.join('');
};