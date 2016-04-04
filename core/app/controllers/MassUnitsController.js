app.controller("MassUnitsController", function($scope, $http, $state, $stateParams, $document)
{	
	//Class ID
	classid = $stateParams.classid;

	//Scope for showing datas
	$scope.newdates = "";
	$("#actdates").html("<strong>Keine Stunden angelegt</strong>");
	/*
		CALENDAR
	*/
	//Loading Calendar
	loadCal();

	//Function to load calendar
   	function loadCal()
   	{
   		$('#calendar').fullCalendar({
			//Language
			lang: 'de',	
			//Weekview inital
	   		defaultView: 'agendaWeek',
	   		//TimeZone
	   		timezone : "local",
	   		//No all-day-slot
			allDaySlot : false,
			//Minimum-TIme
			minTime: "07:00:00",
			maxTime: "22:00:00",
			//Time scrolled to...
			scrollTime: "07:00:00",
			//Hide Weekend
			hiddenDays: [0,6],
			dayClick: function(date, jsEvent, view, resourceObj) 
			{
				addNewDate(date);
    		},
    		eventClick : function(event, jsEvent, view){
    			$('#calendar').fullCalendar( 'removeEvents' , [ event['_id'] ] );
    			$('#calendar').fullCalendar('render');  
    			saveScopeDate();  			
    		},
    		eventResize : function()
    		{
    			saveScopeDate();
    		},    		
    		eventDrop : function()
    		{    			
    			saveScopeDate();
    		},
			//Header-Infos for extra-buttons
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			slotDuration : "00:05:00",
			scrollTime : "08:00:00"
        });
   	}

   	//Functions for next/prev/today Calendar to update next-week-date (settet on friday)
	$('.fc-prev-button').click(function(){
	   $("#date_weekend").val($scope.createDateStringInputDate($("#calendar").fullCalendar('getDate') + 345600000));
	});

	$('.fc-next-button').click(function(){
	   $("#date_weekend").val($scope.createDateStringInputDate($("#calendar").fullCalendar('getDate') + 345600000));
	});

	$('.fc-today-button').click(function(){
	   $("#date_weekend").val($scope.createDateStringInputDate($("#calendar").fullCalendar('getDate') + 345600000));
	});


	//Loading Scope with Class-Data
	var init = function()
	{	
		//TopNavService.renderTopNav($scope, $http);
		var data = { todo : 0, id : classid };
		$http.post("core/app/endpoint/class_orga.php", data).success(function(response){
			$scope.classdata = response;			
		});		

		$("#date_weekend").val($scope.createDateStringInputDate($("#calendar").fullCalendar('getDate') + 345600000));	

	}
	init();

	/*
	
		OnClick New Date

	*/
	function addNewDate(date)
	{
		var startDate = new Date(date['_d']);
		starttime = startDate.getTime();
		endtime = startDate.getTime() + 5400000;


		var myEvent = {
		  title:"Neue Stunde",
		  allDay: false,
		  editable: true,
		  start: starttime,
		  end : endtime,
		  color : "green"
		};

		$('#calendar').fullCalendar( 'renderEvent', myEvent);
		saveScopeDate();
	
	}

	//Save all Dates in a scope array with date, start and end
	function saveScopeDate()
	{
		$("#actdates").html("");
		var dates_cal = $('#calendar').fullCalendar( 'clientEvents' );

		var index = 0;
		var dates = [];
		for(index = 0; index < dates_cal.length; index++)
		{
			dates[index] = {
				start :	new Date(dates_cal[index]['start']['_d']).getTime(),
				end :	new Date(dates_cal[index]['end']['_d']).getTime()
			}
			
			//Generate nice Date and Time-Overview at the End of the Calendar
			var start_date = new Date(dates[index]['start']);
			var end_date = new Date(dates[index]['end']);

			var hour_start = start_date.getHours();
			var min_start = start_date.getMinutes();
			if(hour_start < 10) hour_start = "0" + start_date.getHours();
			if(min_start < 10) min_start = "0" + start_date.getMinutes();

			var hour_end = end_date.getHours();
			var min_end = end_date.getMinutes();
			if(hour_end < 10) hour_end = "0" + end_date.getHours();
			if(min_end < 10) min_end = "0" + end_date.getMinutes();

			//Weekday
			var day = start_date.getDay();

			switch(day)
			{
				case 1: day = "Montag";
				break;
				case 2: day = "Dienstag";
				break;
				case 3: day = "Mittwoch";
				break;
				case 4: day = "Donnerstag";
				break;
				case 5: day = "Freitag";
				break;
			}

			var end_date = new Date(dates[index]['end']);
			$("#actdates").html($("#actdates").html() + "<strong>" + 
				parseInt(index + 1) + ". " + 
				day + ", von " + hour_start + ":" + min_start +
				" bis " + hour_end + ":" + min_end + "</strong><br />"
			);

		}

		if(dates_cal.length == 0)
		{
			$("#actdates").html("<strong>Keine Stunden angelegt</strong>");	
			$("#savenewdates").prop("disabled", true);
		} 
		else
		{
			$("#savenewdates").prop("disabled", false);
		}

		$scope.dates_to_save = dates;
	}

	//Save new Dates
	/*
		in $scope.dates_to_save are MILLISECONDS saved - so just save them to database
	*/
	$scope.saveNewDatesFinal = function()
	{
		var index = 0;
		//Getting Week-Data
		var week_end = new Date($("#date_weekend").val()).getTime();

		//For Each hour add new date to database
		for(index = 0; index < $scope.dates_to_save.length; index++)
		{
			//Generate data
			var data = {
				start : $scope.dates_to_save[index]['start'],
				end : $scope.dates_to_save[index]['end'],
				week_end : week_end,
				todo : 8,
				classid : classid
			}
			//Sending to database
			$http.post("core/app/endpoint/class_orga.php", data); 
		}		

		$state.go("logged.classview", {classid:classid});	
	}

	//Remove all Dates
	$scope.removeAllDates = function()
	{
		$('#calendar').fullCalendar( 'removeEvents' );
		$('#calendar').fullCalendar( 'render' );
		saveScopeDate();
	}

	//To ClassOverview
	$scope.toOverview = function()
	{
		$state.go("logged.classview", {classid:classid});		
	}
});