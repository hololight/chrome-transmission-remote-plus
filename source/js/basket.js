function addTorrent(file) {
	var dirs = (localStorage.dLocation === 'dlcustom') ? JSON.parse(localStorage.dirs) : [];

	parseTorrent(file, function(torrent) {
		if (torrent !== null) {
			chrome.windows.create({ 'url': 'downloadTorrent.html', 'type': 'popup', 'width': 852, 'height': 583 }, function(window) {
				encodeFile(file, function(data) {
					chrome.tabs.sendMessage(window.tabs[0].id, { 'torrent': torrent, 'data': data, 'dirs': dirs });
				});
			});
		} else {
			alert('This isn\'t a torrent file.')
		}
	});
}

function drop(e) {
	var files = e.dataTransfer.files;

	if (files.length > 5) {
		alert('Select no more than 5 files!');
	} else {
		for (var i = 0, file; file = files[i]; ++i) {
			if (file.fileSize > 200000) {
				alert('File too large! Are you sure it\'s a torrent?');
				continue;
			}

			addTorrent(file);
		}  
	}

	e.stopPropagation();
	e.preventDefault();
}

function discard(e) {
	e.stopPropagation();
	e.preventDefault();
}

(function () {
	var dropbox = $('#dropbox');

	window.onUnload = function () {
		chrome.browserAction.setBadgeText({ text: '' });
	};

	dropbox.addEventListener('dragenter', discard, false);
	dropbox.addEventListener('dragover', discard, false);
	dropbox.addEventListener('drop', drop, false);

	dropbox.addEventListener('click', function (e) {
		$('#hFile').click();
	}, false);
})();
