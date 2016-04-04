//Hook Angular
var app = angular.module("GradeLiWeb", ["ui.router", "ngTable", "chart.js"]);

app.config(function($stateProvider){

	//Public State
	$stateProvider		
		//First State and check for loggin every time when a state is called
		.state("public", {
			url:"",	
			controller: "PublicController",
			abstract: true,			
			templateUrl: "core/views/public.html"				
		})
		//Classes-Overview		
		.state("public.nolog", {
			url:"",
			views: {
				"top_nav": { templateUrl: "core/views/top_nav_public.html"},
				"content": { templateUrl: "core/views/nolog_public.html"}
			}			
		})	
		//If a User is logged
		.state("logged", {
			url:"/",		
			controller: "LoggedController",			
			abstract: true,			
			templateUrl: "core/views/logged.html"				
		})	
		//Calenderview		
		.state("logged.calendar", {
			url:"l/cal/",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_calendar.html", controller: "DateController" }
			}
		})				
		//Classes		
		.state("logged.classes", {
			url:"l/classes/",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_classes.html", controller: "ClassesConfController" }
			}
		})
				//Config		
		.state("logged.classview", {
			url:"l/cv/:classid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_classview.html", controller: "ClassViewController" }
			}
		})		
		//Config		
		.state("logged.config", {
			url:"l/config/",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_config.html", controller: "ConfController" }
			}
		})				
		.state("logged.studentclassview", {
			url:"l/cs/:classid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_cs.html", controller: "ClassStudentController" }
			}
		})	
		.state("logged.attendance", {
			url:"l/at/:unitid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_at.html", controller: "AttendanceController" }
			}
		})
		.state("logged.students", {
			url:"l/su/",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_student.html", controller: "StudentController" }
			}
		})
		.state("logged.singlestu", {
			url:"l/sl/:studentid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_singlestu.html", controller: "SingleStudentController" }
			}
		})
		.state("logged.notes", {
			url:"l/n/:classid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_notes.html", controller: "NotesController" }
			}
		})
		.state("logged.classnot", {
			url:"l/cln/:classid/:notenid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_manno.html", controller: "ManageNotesController" }
			}
		})		
		.state("logged.massunits", {
			url:"l/nms/:classid",
			views:{
				"top_nav": { templateUrl: "core/views/logged/top_nav_logged.html", controller: "TopNavLoggedController"},
				"content": { templateUrl: "core/views/logged/logged_massunits.html", controller: "MassUnitsController" }
			}
		})
});

