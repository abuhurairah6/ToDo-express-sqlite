/*
	Global objects/helpers init
*/

var Processor = new ProcessorClass();
var Renderer = new RendererClass();

function main() {
	Processor.queryNote();

	let modal_note = document.getElementById('modal-note');

	modal_note.addEventListener("submit", function(e) {
		e.preventDefault();
	});
}