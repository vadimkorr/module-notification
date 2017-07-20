$(function() {
	/* create new Module */
	var myMNModule = new MNModule({
		container: "#notifications",
	    onNotifsNumberChange: function(number) {
		   console.info("Number of notifs = " + number);
		},
		direction: "fromTop"
	});	
	
	/* create Notifications */
	myMNModule.pushNotif({
		title: "Hello!",
		message: "and Welcome ;)",
		type: "notice",
		closeCond: 5000,
	});

	myMNModule.pushNotif({
		message: "Click buttons to push/pull the notifications",
		type: "success",
		closeCond: 7000
	});

    /* handlers */
    //<button id="add-common-notif">Add "Common" notification</button>
	$("#add-common-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Common Group notification",
			type: 'notice'
		});
	});

	//<button id="remove-common-group">Remove "Common" Group</button>
	$("#remove-common-group").on("click", function() {
		myMNModule.pullGroupNotifs("common");
	});

	//<button id="add-test-group">Add "Test" Group</button>
	$("#add-test-group").on("click", function() {
		myMNModule.createEmptyGroup({
			name: "test"
		});
	});
  
    //<button id="add-test-notification">Add "Test" Notification</button>
	$("#add-test-notification").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Test Group notification",
			type: "success",
			group: "test"
		});
	});

    //<button id="remove-test-group">Remove "Test" Group</button>
	$("#remove-test-group").on("click", function() {
		myMNModule.pullGroupNotifs("test");
	});


    //<button id="add-greedy-group">Add "Greedy" Group</button>
	$("#add-greedy-group").on("click", function() {
		myMNModule.createEmptyGroup({
			name: "greedy",
			greedy: true
		});
	});

    //<button id="add-notif-to-greedy-group">Add Element To "Greedy" Group</button>
	$("#add-notif-to-greedy-group").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Greedy Group notification",
			type: "warning",
			group: "greedy"
		});
	});

    //<button id="remove-greedy-group">Remove "Greedy" Group</button>
	$("#remove-greedy-group").on("click", function() {
		myMNModule.pullGroupNotifs("greedy");
	});
	
	//<button type="button" class="btn btn-default" id="add-success-notif">Add "Success" Notification</button>
	$("#add-success-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Success",
			message: "Notification",
			type: "success"
		});
	});

    //<button type="button" class="btn btn-default" id="add-notice-notif">Add "Notice" Notification</button>
	$("#add-notice-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Notice",
			message: "Notification",
			type: "notice"
		});
	});

    //<button type="button" class="btn btn-default" id="add-warning-notif">Add "Warning" Notification</button>
	$("#add-warning-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Warning",
			message: "Notification",
			type: "warning"
		});
	});

    //<button type="button" class="btn btn-default" id="add-error-notif">Add "Error" Notification</button>
	$("#add-error-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: false,
			title: "Error",
			message: "Notification",
			type: "error"
		});
	});

	//<button type="button" class="btn btn-default" id="add-timeout-notif">Add Notification with Timeout</button>
	$("#add-timeout-notif").on("click", function() {
		myMNModule.pushNotif({
			closeCond: 2000,
			title: "Notice",
			message: "Notification with Timeout",
			type: "notice"
		});
	});

	//<button type="button" class="btn btn-default" id="remove-all">Remove all notifications</button>
	$("#remove-all").on("click", function() {
		myMNModule.pullAll();
	});
	
	
	/* DEMONSTRAING THE DIRECTIONS */
	var dirFromTopMNModule = new MNModule({
		container: "#notifications-from-top",
	    onNotifsNumberChange: function(number) {
		   console.info("Number of notifs = " + number);
		},
		direction: "fromTop"
	});	

	//<button type="button" class="btn btn-success" id="add-success-notif-from-top-dir">Add "Success" Notification</button>
	$("#add-success-notif-from-top-dir").on("click", function() {
		dirFromTopMNModule.pushNotif({
			closeCond: false,
			message: "Success",
			type: "success"
		});
	});

	//<button type="button" class="btn btn-default" id="add-timeout-notif-from-top-dir">Add Notification with Timeout</button>
    $("#add-timeout-notif-from-top-dir").on("click", function() {
		dirFromTopMNModule.pushNotif({
			closeCond: 2000,
			message: "Notice",
			type: "notice"
		});
	}); 

	var dirFromBottomMNModule = new MNModule({
		container: "#notifications-from-bottom",
	    onNotifsNumberChange: function(number) {
		   console.info("Number of notifs = " + number);
		},
		direction: "fromBottom"
	});
	
	//<button type="button" class="btn btn-success" id="add-success-notif-from-bottom-dir">Add "Success" Notification</button>
	$("#add-success-notif-from-bottom-dir").on("click", function() {
		dirFromBottomMNModule.pushNotif({
			closeCond: false,
			message: "Success",
			type: "success"
		});
	});
	
	//<button type="button" class="btn btn-default" id="add-timeout-notif-from-bottom-dir">Add Notification with Timeout</button>
    $("#add-timeout-notif-from-bottom-dir").on("click", function() {
		dirFromBottomMNModule.pushNotif({
			closeCond: 2000,
			message: "Notice",
			type: "notice"
		});
	});

});