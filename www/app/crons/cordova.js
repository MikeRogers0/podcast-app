document.addEventListener("deviceready", function(){

}, false);

document.addEventListener("searchbutton", function(){
	app.navigate('search', true);
}, false);

document.addEventListener("menubutton", function(){
	$('#menuLink').trigger('click');
}, false);

window.addEventListener("batterystatus", function(){

}, false);

document.addEventListener("pause", function(){
	// If it's paused, clear the player so it will not randomly start.
	if(!app.Player.isCurrentlyPlaying()){
		app.Player.renderBlank();
	}
}, false);