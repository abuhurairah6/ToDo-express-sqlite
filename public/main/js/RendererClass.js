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

			form_msg.value = elem.childNodes[1].innerHTML;
			form_weight.value = elem.attributes.weight;
			form_submit.innerHTML = 'Update Note';
			form_main.action = `updateNote?${id}`;
		}
	}

	createElem(json) {
		let parent = document.createElement('li');
		let parentClass = 'list-group-item d-flex custom-element-append';
		parent.setAttribute('id', 'note-id-' + json['NOTE_ID']);
		// parent.attributes.id = json['NOTE_ID'];
		parent.attributes.msg = json['NOTE_MSG'];
		parent.attributes.weight = json['NOTE_WGT'];
		parent.attributes.actv = json['NOTE_ACTV'];
		
		let note = document.createTextNode(json['NOTE_MSG']);

		let divLeft = document.createElement('label');
		divLeft.className = 'd-flex justify-content-between align-items-center m-1';

		let divCenter = document.createElement('div');
		let centerClass = 'flex-grow-1 m-1';

		let divRight = document.createElement('div');
		divRight.className = 'd-flex justify-content-between align-items-center m-1';

		let elemCheck = document.createElement('input');
		elemCheck.setAttribute('type','checkbox');
		elemCheck.setAttribute('onclick', `Processor.updateNote('${parent.id}', false)`);

		let elemEdit = document.createElement('i');
		elemEdit.className = 'fa fa-edit custom-hover-icon m-1';
		elemEdit.setAttribute('data-toggle', 'modal');
		elemEdit.setAttribute('data-target','#modal-note');
		elemEdit.setAttribute('onclick', `Renderer.populateModal('update', '${parent.id}')`);
		
		let elemDelete = document.createElement('i');
		elemDelete.className = 'fa fa-trash custom-hover-icon';
		elemDelete.setAttribute('onclick', `Processor.deleteNote('${parent.id}')`);

		divLeft.appendChild(elemCheck);
		divCenter.appendChild(note);
		divRight.appendChild(elemEdit);
		divRight.appendChild(elemDelete);
		
		parent.appendChild(divLeft);
		parent.appendChild(divCenter);
		parent.appendChild(divRight);

		let root = document.getElementById('note-add');

		if (json['NOTE_ACTV'] === 'Y') {
			parent.className = parentClass + ' list-group-item-primary';
			divCenter.className = centerClass;
			document.getElementById('content-main').insertBefore(parent, root);
		} else {
			parent.className = parentClass + ' list-group-item-success';
			divCenter.className = centerClass + ' text-muted';
			elemCheck.setAttribute('checked', '');
			document.getElementById('history-main').appendChild(parent);
		}
	}

	updateElem(json) {
		let elem = document.getElementById('note-id-' + json[0]['NOTE_ID']);

		elem.childNodes[1].innerHTML = json[0]['NOTE_MSG'];
		elem.attributes.msg = json[0]['NOTE_MSG'];
		elem.attributes.weight = json[0]['NOTE_WGT'];

		if (elem.attributes.actv != json[0]['NOTE_ACTV']) {
			this.deleteElem(elem.id);
			this.createElem(json[0]);
		}
		
		elem.attributes.actv = json[0]['NOTE_ACTV'];
	}

	deleteElem(id) {
		let elem = document.getElementById(id);

		elem.addEventListener('animationend', function() {
			elem.parentNode.removeChild(elem);
		});

		elem.className = elem.className + ' custom-element-remove';
	}

	updateUser(userid) {
		let elem = document.getElementById('header-user');

		elem.innerHTML = 'HI ' + userid;
	}
}