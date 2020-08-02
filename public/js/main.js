function main() {
	queryNote();

	let form_new = document.getElementById('form-main-new');
	let form_edit = document.getElementById('form-main-edit');

	form_new.addEventListener("submit", function(e) {
		e.preventDefault();
	})

	form_edit.addEventListener("submit", function(e) {
		e.preventDefault();
	})
}

function queryNote() {
	$.ajax({
		type: 'GET',
		url: '/api',
		success: function(res, status, xhr) {
			renderElems(res);
		},
		error: function(xhr, status, error){
			console.log(error);
		}
    });
}

function insertNote() {
	let form_main = document.getElementById('form-main-new');
	let form_notes = document.getElementById('form-notes-new').value;
	let form_weight = document.getElementById('form-weight-new').value;
	
	$.ajax({
		type: 'POST',
		url: '/api/insert',
		data: {
			'form_notes': form_notes,
			'form_weight': form_weight
		},
		success: function(res, status, xhr) {
			renderElems(res);
			form_main.reset();
		},
		error: function(xhr, status, error){
			console.log(error);
		}
    });
}

function deleteNote(id) {
	if (confirm('Are you sure you want to delete?')){
		let form_id = id.split('-')[2];

		$.ajax({
			type: 'POST',
			url: '/api/delete',
			data: {
				'form_id': form_id
			},
			success: function(res, status, xhr) {
				deleteElem(id);
			},
			error: function(xhr, status, error){
				console.log(error);
			}
	    });
	}
}

function updateNote(id) {
	let form_id = id.split('-')[2];
	let form_notes = document.getElementById('form-notes-edit').value;
	let form_weight = document.getElementById('form-weight-edit').value;
	let form_actv = 'Y';
	
	$.ajax({
		type: 'POST',
		url: '/api/update',
		data: {
			'form_id': form_id,
			'form_notes': form_notes,
			'form_weight': form_weight,
			'form_actv': form_actv
		},
		success: function(res, status, xhr) {
			updateElem(res);
		},
		error: function(xhr, status, error){
			console.log(error);
		}
    });
}