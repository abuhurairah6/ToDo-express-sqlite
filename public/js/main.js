function main() {
	$.ajax({
      type: 'GET',
      url: '/api',
      success: function(res, status, xhr) {
        for (let i = 0; i <= res.length - 1; i++) {
          // console.log(res[i]['NOTE_MSG']);
          let elem = document.createElement('li');
          let note = document.createTextNode(res[i]['NOTE_MSG']);
          
          elem.className = 'list-group-item';
          elem.attributes.id = res[i]['NOTE_ID'];
          elem.attributes.weight = res[i]['NOTE_WGT'];
          elem.attributes.actv = res[i]['NOTE_ACTV'];
          elem.appendChild(note);
          
          let parent = document.getElementById('note-add');
          // document.getElementById('content-main').appendChild(elem);
          document.getElementById('content-main').insertBefore(elem, parent);
        }
      },
      error: function(xhr, status, error){
        console.log(error);
      }
    });
}

function reqGET() {
	$.ajax({
		type: 'POST',
		url: 'api',
		success: function(res, status, xhr){
			console.log(res);
		},
		error: function(xhr, status, error){
			console.log(error);
		}
	});
};