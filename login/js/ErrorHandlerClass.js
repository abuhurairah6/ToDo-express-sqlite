class ErrorHandlerClass {

	processError(res, element) {
		switch(res.status) {
			case '02':
				element.innerHTML = 'Username already in use!';
				break;

			case '03':
				element.innerHTML = 'User not found!';
				break;

			case '04':
				element.innerHTML = 'Password is incorrect!';
				break;

			case '11':
				element.innerHTML = 'Unexpected error, please try again later!';
				break;
		}
	}
}