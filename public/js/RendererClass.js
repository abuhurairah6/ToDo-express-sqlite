class RendererClass {
	populateModal(mode, id = null) {
		let form_main = document.getElementById('form-note');
		let form_msg = document.getElementById('form-note-msg');
		let form_weight = document.getElementById('form-note-weight');
		let form_submit = document.getElementById('form-note-submit');

		if (mode == 'create') {
			form_msg.value = null;
			form_weight.value = null;
			form_submit.innerHTML = 'Create Note';
			form_main.action = 'createNote?';
		} else if (mode == 'update' && id !== null) {
			let elem = document.getElementById(id);

			form_msg.value = elem.childNodes[0].innerHTML;
			form_weight.value = elem.attributes.weight;
			form_submit.innerHTML = 'Update Note';
			form_main.action = `updateNote?${id}`;
		}
	}

	createElem(json) {
		let parent = document.createElement('li');
		let note = document.createTextNode(json['NOTE_MSG']);

		let divLeft = document.createElement('div');
		divLeft.className = 'col-11 d-flex align-items-center';

		let divRight = document.createElement('div');
		divRight.className = 'col-1 d-flex justify-content-between align-items-center';

		parent.className = 'list-group-item d-flex list-group-item-success custom-element-append';
		parent.setAttribute('id', 'note-id-' + json['NOTE_ID']);
		// parent.attributes.id = json['NOTE_ID'];
		parent.attributes.weight = json['NOTE_WGT'];
		parent.attributes.actv = json['NOTE_ACTV'];

		let elemEdit = document.createElement('i');
		elemEdit.className = 'fa fa-edit custom-hover-icon';
		elemEdit.setAttribute('data-toggle', 'modal');
		elemEdit.setAttribute('data-target','#modal-note');
		elemEdit.setAttribute('onclick', `Renderer.populateModal('update', '${parent.id}')`);
		
		let elemDelete = document.createElement('i');
		elemDelete.className = 'fa fa-trash custom-hover-icon';
		elemDelete.setAttribute('onclick', `Processor.deleteNote('${parent.id}')`);

		divLeft.appendChild(note);
		divRight.appendChild(elemEdit);
		divRight.appendChild(elemDelete);
		parent.appendChild(divLeft);
		parent.appendChild(divRight);

		let root = document.getElementById('note-add');
		// document.getElementById('content-main').appendChild(elem);
		document.getElementById('content-main').insertBefore(parent, root);
	}

	updateElem(json) {
		let elem = document.getElementById('note-id-' + json[0]['NOTE_ID']);

		elem.childNodes[0].innerHTML = json[0]['NOTE_MSG'];
		elem.attributes.weight = json[0]['NOTE_WGT'];
		elem.attributes.actv = json[0]['NOTE_ACTV'];
	}

	deleteElem(id) {
		let elem = document.getElementById(id);

		elem.addEventListener('animationend', function() {
			elem.parentNode.removeChild(elem);
		});

		elem.className = elem.className + ' custom-element-remove';
	}

}