

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
	
	$(".title").greenify().on("click", function() {
		mymnconfig.pushNotif({
			closeCond: 1000,
			title: "Hello",
			type: 'notice'
		});
	});

	$(".title2").greenify().on("click", function() {
		mymnconfig.pullGroupNotifs("test");
	});


    //<button id="add-common-notif">Add "Common" notification</button>
	$("#add-common-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Common Group notification",
			type: 'notice'
		});
	});

	//<button id="remove-common-group">Remove "Common" Group</button>
	$("#remove-common-group").on("click", function() {
		mymnconfig.pullGroupNotifs("common");
	});

	//<button id="add-test-group">Add "Test" Group</button>
	$("#add-test-group").on("click", function() {
		mymnconfig.createEmptyGroup({
			name: "test"
		});
	});
  
    //<button id="add-test-notification">Add "Test" Notification</button>
	$("#add-test-notification").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Test Group notification",
			type: "success",
			group: "test"
		});
	});

    //<button id="remove-test-group">Remove "Test" Group</button>
	$("#remove-test-group").on("click", function() {
		mymnconfig.pullGroupNotifs("test");
	});


    //<button id="add-greedy-group">Add "Greedy" Group</button>
	$("#add-greedy-group").on("click", function() {
		mymnconfig.createEmptyGroup({
			name: "greedy",
			greedy: true
		});
	});

    //<button id="add-notif-to-greedy-group">Add Element To "Greedy" Group</button>
	$("#add-notif-to-greedy-group").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Greedy Group notification",
			type: "warning",
			group: "greedy"
		});
	});

    //<button id="remove-greedy-group">Remove "Greedy" Group</button>
	$("#remove-greedy-group").on("click", function() {
		mymnconfig.pullGroupNotifs("greedy");
	});
	
	//<button type="button" class="btn btn-default" id="add-success-notif">Add "Success" Notification</button>
	$("#add-success-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Success",
			message: "Notification",
			type: "success"
		});
	});

    //<button type="button" class="btn btn-default" id="add-notice-notif">Add "Notice" Notification</button>
	$("#add-notice-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Notice",
			message: "Notification",
			type: "notice"
		});
	});

    //<button type="button" class="btn btn-default" id="add-warning-notif">Add "Warning" Notification</button>
	$("#add-warning-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Warning",
			message: "Notification",
			type: "warning"
		});
	});

    //<button type="button" class="btn btn-default" id="add-error-notif">Add "Error" Notification</button>
	$("#add-error-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: false,
			title: "Error",
			message: "Notification",
			type: "error"
		});
	});

	//<button type="button" class="btn btn-default" id="add-timeout-notif">Add Notification with Timeout</button>
	$("#add-timeout-notif").on("click", function() {
		mymnconfig.pushNotif({
			closeCond: 2000,
			title: "Notice",
			message: "Notification with Timeout",
			type: "notice"
		});
	});
});