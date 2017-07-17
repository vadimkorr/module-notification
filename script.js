

(function ( $ ) {
	
	var index = 0;
	var container = "#notifications";
	
	$.fn.putNotif = function(title, message) {
		var template = "<p>"+title+"</p><span>" + message + "</span>";
		
		$( template ).appendTo( container );
		
	};
 
    var shade = "#00FF00";
 
    $.fn.greenify = function() {
        this.css( "color", shade );
        return this;
    };
 
}( jQuery ));


$(function() {
	
	var mymnconfig = new MNConfig({
		container: "#notifications"
	});
	
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'success'
	});
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'success'
	});
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'info'
	});
	
	
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'success',
		group: "test"
	});
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'success',
		group: "test"
	});
	mymnconfig.put({
		closeCond: false,
		title: "Hello",
		type: 'info',
		group: "test"
	});

	mymnconfig.put({
		closeCond: 500,
		title: "Hello",
		type: 'success'
	});

	mymnconfig.put({
		closeCond: 500,
		title: "Hello",
		type: 'warning'
	});

	mymnconfig.put({
		closeCond: 500,
		title: "Hello",
		type: 'danger'
	});
	
	
	
	$(".title").greenify().on("click", function() {
		mymnconfig.put({
			closeCond: 1000,
			title: "Hello",
			type: 'info'
		});
	});

	$(".title2").greenify().on("click", function() {
		mymnconfig.pullGroup("test");
	});
});
  
  

