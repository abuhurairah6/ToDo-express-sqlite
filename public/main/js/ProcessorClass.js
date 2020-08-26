class ProcessorClass {
	queryNote() {
		$.ajax({
			type: 'GET',
			url: '/api',
			success: function(res, status, xhr) {
				for (let i = 0; i <= res['notes'].length - 1; i++) {
					Renderer.createElem(res['notes'][i]);
				}
				Renderer.updateUser(res['user']);
			},
			error: function(xhr, status, error){
				console.log(error);
			}
	    });
	}

	createNote() {
		let form_main = document.getElementById('form-note');
		let form_msg = document.getElementById('form-note-msg');
		// let form_weight = document.getElementById('form-note-weight');
		let form_submit = document.getElementById('form-note-submit');
		
		$.ajax({
			type: 'POST',
			url: '/api/insert',
			data: {
				'form_msg': form_msg.value
				// 'form_weight': form_weight.value
			},
			success: function(res, status, xhr) {
				for (let i = 0; i <= res.length - 1; i++) {
					Renderer.createElem(res[i]);
				}
				form_main.reset();
			},
			error: function(xhr, status, error){
				console.log(error);
			}
	    });
	}

	updateNote(id, form = true) {
		let form_id = id.split('-')[2];
		let form_msg = form ? document.getElementById('form-note-msg').value : document.getElementById(id).attributes.msg;
		// let form_weight = form ? document.getElementById('form-note-weight').value : document.getElementById(id).attributes.weight;
		let form_actv = form ? 'Y': document.getElementById(id).attributes.actv === 'Y' ? 'N' : 'Y';
		
		$.ajax({
			type: 'POST',
			url: '/api/update',
			data: {
				'form_id': form_id,
				'form_msg': form_msg,
				// 'form_weight': form_weight,
				'form_actv': form_actv
			},
			success: function(res, status, xhr) {
				Renderer.updateElem(res);
			},
			error: function(xhr, status, error){
				console.log(error);
			}
	    });
	}

	deleteNote(id) {
		if (confirm('Are you sure you want to delete?')){
			let form_id = id.split('-')[2];

			$.ajax({
				type: 'POST',
				url: '/api/delete',
				data: {
					'form_id': form_id
				},
				success: function(res, status, xhr) {
					Renderer.deleteElem(id);
				},
				error: function(xhr, status, error){
					console.log(error);
				}
		    });
		}
	}

	logout() {
		let btn = document.getElementById('logout-submit');
		renderLoading(btn);

		$.ajax({
			type: 'POST',
			url: '/user/logout',
			success: function(res, status, xhr) {
				if (res.unauth) {
					window.location = window.pathname;
				} else {
					console.log(res.status);
					renderReset(btn, 'LOGOUT');
				}
			},
			error: function(xhr, status, error){
				console.log(error);
				renderReset(btn, 'LOGOUT');
			}
	    });
	}
}