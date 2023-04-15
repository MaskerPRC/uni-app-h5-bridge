function downloadAttendanceRecords() {
    $.ajax({
        url: ctxPath+"/attendanceRecordsTemp/admin/downloadAttendanceRecords",
        type:"post",
        dataType:"json",
        crossDomain: false,
        async : false,
        success: function(data) {
           if (data.success){
               var path = data.obj.path;
               downloadFiles(path,data.obj.cloudToken) ;
               console.log(data.obj.cloudToken);
           }
        },
        error: function () {
            alert("请求出现异常！");
        }
    });
}

//下载文件夹
function downloadFiles(fileNames, vToken){
    vToken = vToken || token;
    var fileConnector =  "http://yunpan.webtrn.cn/cloud/operation";
    url = fileConnector + '/trainingdownload?dirname=/&basenames='+ encodeURIComponent(fileNames) + '&token=' + vToken;
    downloadURL(url);
}

//下载单个文件
function downloadFile(token, path){
    var fileConnector =  "http://yunpan.webtrn.cn/cloud/operation",
        url = fileConnector + '/trainingdownload?path=' + encodeURIComponent(path) + '&token=' + token;
    downloadURL(url);
}

//下载弹出框
function downloadURL(url) {
    if(navigator.userAgent.indexOf("MSIE 8.0")>0){   //是IE8
        window.location.href=url;
    }else{
        try {
            var hiddenIFrameID = 'hiddenDownloader',
                iframe = document.getElementById(hiddenIFrameID);
            if (iframe === null) {
                iframe = document.createElement('iframe');
                iframe.id = hiddenIFrameID;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            iframe.src = url;
            iframe.onload = function () {
                alert("文件路径不合法！");
            };
        } catch (e) {
            alert("错误的文件不能下载！");
        }
    }
}

