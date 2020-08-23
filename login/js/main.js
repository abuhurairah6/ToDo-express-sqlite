function main() {
	let form_login = document.getElementById('form-login');
	let form_register = document.getElementById('form-register');
	let pass = document.getElementById('register-password');
	let pass_confirm = document.getElementById('register-password-confirm');

	form_login.addEventListener("submit", function(e) {
		e.preventDefault();
		if (form_login.checkValidity()) {
			login();
		}

		// To prevent from redirecting to form action's URL
		// form_login.classList.add('was-validated');
	});

	form_register.addEventListener("submit", function(e) {
		e.preventDefault();
		
		if (pass.value !== pass_confirm.value) {
			$("#password-not-match").show();
			// To prevent from redirecting to form action's URL
		} else if (form_register.checkValidity()) {
			$("#password-not-match").hide();
			register();
		}

		// form_register.classList.add('was-validated');
	});
}

function register() {
	let userid = document.getElementById('register-username');
	let pass = document.getElementById('register-password');

	$.ajax({
		type: 'POST',
		url: '/user/register',
		data: {
			'register-username': userid.value,
			'register-password': pass.value
		},
		success: function(res, status, xhr) {
			if (res.authenticate) {
				window.location = window.pathname;
			} else {
				// Throw exception
				switch(res.status) {
					case '11':
						// inv.innerHTML = 'Unexpected error, please try again later!';
						break;
				}
			}
		},
		error: function(xhr, status, error){
			console.log(error);
		}
    });
}

function login() {
	let userid = document.getElementById('login-username');
	let pass = document.getElementById('login-password');
	let inv = document.getElementById('login-invalid');

	$.ajax({
		type: 'POST',
		url: '/user/authenticate',
		data: {
			'login-username': userid.value,
			'login-password': pass.value
		},
		success: function(res, status, xhr) {
			if (res.authenticate) {
				window.location = window.pathname;
			} else {
				// Throw exception
				switch(res.status) {
					case '02':
						inv.innerHTML = 'User not found!';
						break;
					case '03':
						inv.innerHTML = 'Password is incorrect!';
						break;
				}

				$("#login-invalid").show();
			}
		},
		error: function(xhr, status, error){
			console.log(error);
		}
    });
}