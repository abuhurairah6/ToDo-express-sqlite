function renderLoading(btn) {
	let btn_load = document.createElement('div');
	let btn_access = document.createElement('span');

	btn_load.setAttribute('class','spinner-border');
	btn_load.setAttribute('role','status');

	btn_access.setAttribute('class','sr-only');
	btn_access.setAttribute('value','Loading...');

	btn.innerHTML = '';
	btn_load.appendChild(btn_access);
	btn.appendChild(btn_load);
}

function renderReset(btn, html) {
	btn.removeChild(btn.childNodes[0]);
	btn.innerHTML = html;
}