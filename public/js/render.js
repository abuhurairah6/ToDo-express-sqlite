function populateModal(id) {
	let elem = document.getElementById(id);

	let form_main = document.getElementById('form-main-edit');
	let form_notes = document.getElementById('form-notes-edit');
	let form_weight = document.getElementById('form-weight-edit');
	let form_submit = document.getElementById('form-submit-edit');

	form_notes.value = elem.childNodes[0].innerHTML;
	form_weight.value = elem.attributes.weight;
	form_submit.setAttribute('onclick', `updateNote('${id}')`);
}

function updateElem(json) {
	let elem = document.getElementById('note-id-' + json[0]['NOTE_ID']);

	elem.childNodes[0].innerHTML = json[0]['NOTE_MSG'];
	elem.attributes.weight = json[0]['NOTE_WGT'];
	elem.attributes.actv = json[0]['NOTE_ACTV'];
}

function deleteElem(id) {
	let elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);
}

function renderElems(json) {
	for (let i = 0; i <= json.length - 1; i++) {
		let parent = document.createElement('li');
		let note = document.createTextNode(json[i]['NOTE_MSG']);

		let divLeft = document.createElement('div');
		divLeft.className = 'col-11';

		let divRight = document.createElement('div');
		divRight.className = 'col-1 d-flex justify-content-between align-items-center';

		parent.className = 'list-group-item d-flex justify-content-between list-group-item-success';
		parent.setAttribute('id', 'note-id-' + json[i]['NOTE_ID']);
		// parent.attributes.id = json[i]['NOTE_ID'];
		parent.attributes.weight = json[i]['NOTE_WGT'];
		parent.attributes.actv = json[i]['NOTE_ACTV'];

		let elemEdit = document.createElement('i');
		elemEdit.className = 'fa fa-edit custom-hover-icon';
		elemEdit.setAttribute('data-toggle', 'modal');
		elemEdit.setAttribute('data-target','#update-modal');
		elemEdit.setAttribute('onclick', `populateModal('${parent.id}')`);
		
		let elemDelete = document.createElement('i');
		elemDelete.className = 'fa fa-trash custom-hover-icon';
		elemDelete.setAttribute('onclick', `deleteNote('${parent.id}')`);

		divLeft.appendChild(note);
		divRight.appendChild(elemEdit);
		divRight.appendChild(elemDelete);
		parent.appendChild(divLeft);
		parent.appendChild(divRight);

		let root = document.getElementById('note-add');
		// document.getElementById('content-main').appendChild(elem);
		document.getElementById('content-main').insertBefore(parent, root);
	}
}