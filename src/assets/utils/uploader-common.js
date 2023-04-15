function initUploader(uploadUrl, buttonId, containerId, maxFileSize, fileExtensions, chunkSize, params, fileDataName){
	
	var rtimes = 'html5,flash,silverlight,html4';
	var isIE = navigator.userAgent.toLowerCase().match(/ie/) != null;
	if (isIE) {
		rtimes = 'flash';
	}
	var uploader = new plupload.Uploader({
		runtimes: rtimes,
		browse_button: buttonId, 
		container: document.getElementById(containerId),
		url: uploadUrl,
		chunk_size: chunkSize,
		multipart: true,
		multi_selection: false,
		chunks: true,
		directory: false,
		file_data_name: fileDataName || 'entity.resourceContent',
		multipart_params: params,
		filters: {
			max_file_size: maxFileSize,
			max_file_count: 1,
			mime_types : [{title : "文件列表", extensions : fileExtensions }]
		},
		flash_swf_url: ctxPath + '/resources/js/common/uploader/Moxie.swf',
		silverlight_xap_url: ctxPath + '/resources/js/common/uploader/Moxie.xap'
	});
	
	uploader.init();
	
	return uploader;
}