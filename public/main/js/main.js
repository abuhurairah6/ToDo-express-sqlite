/*
	Global objects/helpers init
*/

var Processor = new ProcessorClass();
var Renderer = new RendererClass();

function main() {
	Processor.queryNote();

	let form_main = document.getElementById('form-note');

	form_main.addEventListener("submit", function(e) {
		// To prevent from redirecting to form action's URL
		e.preventDefault();

		let func = form_main.action;
		let regex = /(update|create).*/g;
		let params = regex.exec(func)[0].split('?');
		
		// Runs function dynamically base on form's action, only accepts one argument
		Processor[params[0]](params[1]);
		$('#modal-note').modal('hide');
	});
}