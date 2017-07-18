

(function ( $ ) {
	
	var index = 0;
	var container = "#notifications";
	
	$.fn.pushNotifNotif = function(title, message) {
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
	
	var mymnconfig = new MNModule({
		container: "#notifications",
	    onNotifsNumberChange: function(number) {
		   console.info("Number of notifs = " + number);
		}
	});
	
	mymnconfig.pushNotif({
		closeCond: false,
		title: "",
		message: "Hey, this is a succes messsage. Keep going! ;)",
		type: 'success',
		icon: 'music'
	});
	mymnconfig.pushNotif({
		closeCond: false,
		type: 'success'
	});
	mymnconfig.pushNotif({
		closeCond: false,
		title: "Hello",
		type: 'notice'
	});
	
	
	mymnconfig.pushNotif({
		closeCond: false,
		title: "Hello",
		type: 'success',
		group: "test"
	});
	mymnconfig.pushNotif({
		closeCond: false,
		title: "Hello",
		type: 'success',
		group: "test"
	});
	mymnconfig.pushNotif({
		closeCond: false,
		title: "Hello",
		type: 'notice',
		group: "test"
	});

	// mymnconfig.pushNotif({
		// closeCond: 500,
		// title: "Hello",
		// type: 'success'
	// });

	// mymnconfig.pushNotif({
		// closeCond: 500,
		// title: "Hello",
		// type: 'warning'
	// });

	// mymnconfig.pushNotif({
		// closeCond: 500,
		// title: "Hello",
		// type: 'error'
	// });
	
	mymnconfig.createEmptyGroup({
	  name: "greedy",
	  greedy: true
	});
	
	mymnconfig.pushNotif({
		closeCond: false,
		title: "GREEDY 1",
		type: 'warning',
		group: 'greedy'
	});

	mymnconfig.pushNotif({
		closeCond: false,
		title: "GREEDY 2",
		type: 'warning',
		group: 'greedy'
	});

	mymnconfig.pushNotif({
		closeCond: false,
		title: "GREEDY 3",
		type: 'warning',
		group: 'greedy'
	});
	
	
	
	$(".title").greenify().on("click", function() {
		mymnconfig.pushNotif({
			closeCond: 1000,
			title: "Hello",
			type: 'notice'
		});
	});

	$(".title2").greenify().on("click", function() {
		mymnconfig.pullGroup("test");
	});
});
  
  

