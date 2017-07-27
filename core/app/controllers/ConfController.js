app.controller("ConfController", function($scope, $http, $state, Upload){

	//LoadingInBaclup-BUtton
	$("#loadinbackup_button").prop("disabled", true);
	// Variable to store your files
	var new_data_from_file;
	var file_check = false;
	// Add events for file-upload
	$('input[type=file]').on('change', prepareUpload);
	$("#imgbackup_fail").hide();
	// Grab the files and set them to our variable
	function prepareUpload(event)
	{
	  datafile = event.target.files[0];
	  if (datafile) 
	  {
      	var r = new FileReader();
      	r.onload = function(e) 
      	{ 
	    	new_data_from_file = e.target.result;        	
      	}
      	r.readAsText(datafile);
      }

	  file_check = true;
	  $scope.loadBackupPassIn();
	 }

	//Schoolyear-Check-Var
	$scope.syfound = false;

	//Act Vear for correct Year
	var tempDate = new Date();
	$scope.actYear = tempDate.getFullYear();
	
	$("#inputerr").hide();
	$("#saveok").hide();
	$("#inputerrs").hide();
	$("#saveoks").hide();
	$("#saveokdump").hide();
	$("#saveerrdump").hide();
	$("#inputerrhol").hide();

	//inital function
	var init = function()	
	{
		//Userdata
		var data = {
			token : localStorage.getItem('user')
		}
		$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
		{	
			$scope.userdata = response;		
			$("#username").val($scope.userdata['username']);	
			$("#target").val($scope.userdata['synctarget']);			
			$("#token").val($scope.userdata['synctoken']);		

			//Initial Switch-Status for showing show_attendence or not
			stat_att = true;
			stat_mysql = true;
			stat_backup = true;
			stat_unitnote = true;
			if(response['show_attendence'] == 0) stat_att = false; 
			if(response['show_mysqlsync'] == 0) stat_mysql = false; 
			if(response['show_fastbackup'] == 0) stat_backup = false; 
			if(response['show_unitnote'] == 0) stat_unitnote = false; 
			
			//Switches for Settings
			//Show Workingscale 0-5
			$("[name='show_atten_switch']").bootstrapSwitch(
			{
				state : stat_att,
				onText : "An",
				offText : "Aus",
				//Change state in database
				onSwitchChange : function(event, state)
				{
					int_state = 0;
					if(state) int_state = 1;
					var data = {
						todo : 15,
						newstat : int_state
					};
					//Update new State
					$http.post("core/app/endpoint/userconf.php", data).success(function(response){						
					});
				}					
			});

			//Show MySQL-Sync
			$("[name='show_mysql_switch']").bootstrapSwitch(
			{
				state : stat_mysql,
				onText : "An",
				offText : "Aus",
				//Change state in database
				onSwitchChange : function(event, state)
				{
					int_state = 0;
					if(state) int_state = 1;

					var data = {
						todo : 21,
						newstat : int_state
					};
					//Show/Hide Buttons for quick change - database follows
					if(state)
					{
						$("#mysql_sync_show").show();
					}
					else 
					{
						$("#mysql_sync_show").hide();
					}
					//Update new State
					$http.post("core/app/endpoint/userconf.php", data).success(function(response){
						//Update LoggedScope-Data						
						$scope.updateLoggedData();
					});
				}					
			});

			//Show FastBackup
			$("[name='show_fastbackup_switch']").bootstrapSwitch(
			{
				state : stat_backup,
				onText : "An",
				offText : "Aus",
				//Change state in database
				onSwitchChange : function(event, state)
				{
					int_state = 0;
					if(state) int_state = 1;

					var data = {
						todo : 22,
						newstat : int_state
					};
					//Show/Hide Buttons for quick change - database follows
					if(int_state == 1)
					{
						$("#mysql_fastbackup").show();
					}
					else 
					{
						$("#mysql_fastbackup").hide();
					}
					//Update new State
					$http.post("core/app/endpoint/userconf.php", data).success(function(response){
						//Update LoggedScope-Data						
						$scope.updateLoggedData();
					});
				}					
			});

			//Show Unitnote
			$("[name='show_unitnote_switch']").bootstrapSwitch(
			{
				state : stat_unitnote,
				onText : "An",
				offText : "Aus",
				//Change state in database
				onSwitchChange : function(event, state)
				{
					int_state = 0;
					if(state) int_state = 1;

					var data = {
						todo : 23,
						newstat : int_state
					};					
					//Update new State
					$http.post("core/app/endpoint/userconf.php", data).success(function(response){
						//Update LoggedScope-Data						
						$scope.updateLoggedData();
					});
				}					
			});



		});


		//Holidays
		$scope.holfound = true;
		$http.post("core/app/endpoint/returnholidays.php").success(function(response)
	   	{			
	   		//Re-Format the Date				
	   		var index;
			for (index = 0; index < response.length; ++index) {
			    response[index]['start'] = createDateString(response[index]['start']);
			    response[index]['end'] = createDateString(response[index]['end']);	
			}
			if(index == 0) $scope.holfound = false;
			else $scope.holidays = response;				
		});	

		//Schoolyears
		$scope.syfound = false;
		var data = {
			todo : 8
		}
		$http.post("core/app/endpoint/userconf.php", data).success(function(response)
		{
			$scope.schoolyears = response;
			if(response.length > 0) 
			{
				$scope.syfound = true;										
			}
		});
	}
	init();

	//Functions

	//Create nice Date-String
	/*

	@param

		dateinfo - can be anything wich is compatible with new Date (timestamp, YYYY-MM-DD....)

	*/
	function createDateString(dateinfo)
	{
		var date = new Date(dateinfo);			    
		var day = "";
	    var month = "";
	    if(date.getDate() < 10) day = "0" + date.getDate();
	    else day = date.getDate();
	    if(date.getDate() < 10) day = "0" + date.getDate();
	    else day = date.getDate();
	    if(date.getMonth() + 1 < 10) month = "0" + parseInt(date.getMonth() + 1);
	    else month = parseInt(date.getMonth() + 1);	
	    return day + "." + month + "." + date.getFullYear()	
	}

	//Set End-Date to same Day as Start-Day
	$scope.updateEndDate = function()
	{
		var start_date = $("#date_start").val();
		$("#date_end").val(start_date);	
	}	

	//Show Modal
	$scope.newHoliday = function()
	{		
		$("#inputerrhol").hide();							
		$("#date_title").val("");		
		//Initial-Color - relaxed blue
		$("#date_start").val("");	
		$("#date_end").val("");
		$("#newholiday").modal('toggle');	
	}

	//Validate and Save new Holidays
	//Validate and save new Date
	/*
		IMPORTANT: Constant Time for allday-event without need funcion
		of the calendar!
	*/
	$scope.saveNewHoliday = function()
	{
		//Validate Data
		var data = {
			title : $("#date_title").val(),		
			start : $scope.getMilDate($("#date_start").val(), "00:00:01"),	
			end: 	$scope.getMilDate($("#date_end").val(), "23:59:59"),
			todo : 0
		}
		//Validate Timeareas and Inputs
		if(data['end'] < data['start'] || 
			data['title'] == "" || 
			$scope.valTextInput(data['title']) == false
		)
		{
			$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten und Bezeichnung angeben. Auf Sonderzeichen achten!";
			$("#inputerrhol").fadeIn();
		}	
		//All check ok - save new Date to Database		
		else
		{
			//Hide Modal
			$("#newholiday").modal('toggle');	
			//Save to Database
			$http.post("core/app/endpoint/holidays.php", data).success(function(response)
		   	{	
		   		//Reload Calender
		   		$('#calendar').fullCalendar('refetchEvents');
		   		init();
			});				
		}
	}


	//Delete a Holiday
	$scope.deleteHoliday = function(id)
	{
		//Validate Data
		var data = {
			id : id,
			todo : 2
		}
		$http.post("core/app/endpoint/holidays.php", data).success(function(response)
	   	{	
	   		//Reload Calender
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});			
	}

	//Mass Insert - getting API
	$scope.insertMassHol = function()
	{
		var year = $("#year").val();
		var land = $("#land").val();
		//Insert Holidays
		$http.post("http://api.smartnoob.de/ferien/v1/ferien/?bundesland="+land+"&jahr="+year).success(function(response)
	   	{	
	   		//Reload Calender
	   		var holidays = response['daten'];
	   		var index;
	   		for (index = 0; index < holidays.length; ++index) {
			    var data = {
					title : holidays[index]['title'],		
					start : holidays[index]['beginn']*1000,	
					end: 	holidays[index]['ende']*1000,
					todo : 0
				}	
				$http.post("core/app/endpoint/holidays.php", data).success(function(response){});
			}
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});
		
		//Insert Freedays		
		$http.post("http://api.smartnoob.de/ferien/v1/feiertage/?bundesland="+land+"&jahr="+year).success(function(response)
	   	{	

	   		//Reload Calender
	   		var holidays = response['daten'];
	   		var index;
			for (index = 0; index < holidays.length; ++index) {
			    var data = {
					title : holidays[index]['title'],		
					start : holidays[index]['beginn']*1000,	
					end: 	holidays[index]['ende']*1000,
					todo : 0
				}	
				$http.post("core/app/endpoint/holidays.php", data).success(function(response){});
			}
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});		
	}

	//Truncate Holiday-Table
	$scope.deleteMassHol = function()
	{
		var data = {
			todo : 3
		}	
		$http.post("core/app/endpoint/holidays.php", data).success(function(response){
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});
	}

	/*
		
		USERDATA

	*/

	//Global Functions
	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTextInputUsername = function(text)
	{
		if(!text.match(/^[a-z]+$/))
		return false;
		else return true;
	}

	//Change Password
	$scope.changePassword = function()
	{
		$("#actpasserr").hide();
		$("#newpasserr_1").hide();
		$("#newpasserr_2").hide();
		$("#passerrmess").hide();
		$("#password_old").val("");
		$("#password_new_1").val("");
		$("#password_new_2").val("");
		$("#changepassword").modal("toggle");
	}

	$scope.updateNewPassword = function()
	{
		var data = {
			actpass : $("#password_old").val(),
			newpass_1 : $("#password_new_1").val(),
			newpass_2 : $("#password_new_2").val(),
			todo : 1
		};
		//Normal Validate
		if(
			data['actpass'] == "" || 
			data['newpass_1'] == "" || 
			data['newpass_2'] == "" || 
			data['newpass_1'] != data['newpass_2'] ||
			!$scope.valTextInput(data['actpass']) ||
				!$scope.valTextInput(data['newpass_1']) ||
				!$scope.valTextInput(data['newpass_2'])
		)
		{
			$scope.passerrmess = "Fehler bei Eingabe. Sonderzeichen beachten! Passwörter müssen gleich sein.";
			$("#passerrmess").show();
		}
		else
		{
			//Checking for right Password
			$("#passerrmess").hide();
			//Classdata
			$http({
				method : "POST",
				data : data,
				url : "core/app/endpoint/userconf.php"
			}).then(
				function successCallback(response)
				{		
					//Update true - reset token	
					if(response['data']['passstat'] == true)
					{
						$("#changepassword").modal("toggle");						
						$("#changepassword").on('hidden.bs.modal', function (e) {
					    	$("#changepassword_confirm").modal("toggle");
					    });
					}	
					else
					{
						$scope.passerrmess = "Fehler bei Eingabe. Passwort falsch.";
						$("#passerrmess").show();
					}
				}
			);		
		}

	}

	$scope.updateUserdata = function()
	{
		var data = {
			username: $("#username").val(),
			oldusername : $scope.userdata['username'],
			todo : 0
		}
		//Validate
		if(
			data['username'] == "" || 
			$scope.valTextInputUsername(data['username']) == false 
		)
		{
			$scope.errmess = "Falsche Daten! Benutzername muss vergeben sein! Auf Sonderzeichen achten (nur a-z bei Benutzername).";
			$("#inputerr").fadeIn();
			$("#inputerr").delay(3000).fadeOut();
		}
		else
		{				
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){						
				if(response['err'] == 0)
				{
					$scope.errmess = "Benutzername bereits vergeben oder wurde nicht geändert.";
					$("#inputerr").fadeIn();
					$("#inputerr").delay(3000).fadeOut();
				}
				//Username updatetet - reset token and show message
				else
				{
					localStorage.setItem("user", response['newtoken']);
					$scope.okmess = "Daten aktualisiert! Anzeige oben aktualisiert sich bei Ansichtswechsel.";
					$("#inputerr").hide();
					$("#saveok").fadeIn();
					$("#saveok").delay(2000).fadeOut();
					init();
				}				
			});
		}
	}

	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTargetInput = function(text)
	{
		if(!text.match(/^[A-Za-z0-9!?_\-ßöäüÖÄÜ,.@()\r\n\:\/ ]+$/))
		return false;
		else return true;
	}

	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTokenInput = function(text)
	{
		if(!text.match(/^[A-Za-z0-9]+$/))
		return false;
		else return true;
	}
	/*

		SYNC

	*/
	$scope.updateSyncDetails = function()
	{
		var data = {
			target: $("#target").val(),
			token: $("#token").val(),
			username: $scope.userdata['username'],
			todo : 2
		}
		//Validate
		if( (data['target'] != "" && $scope.valTargetInput(data['target']) == false) ||
			data['token'] == "" || 
			$scope.valTokenInput(data['token']) == false
		)
		{
			$scope.errmess = "Token darf nicht leer sein. Auf Sonderzeichen achten!";
			$("#inputerrs").fadeIn();
			$("#inputerrs").delay(3000).fadeOut();
		}
		else
		{	
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){				
				$scope.okmess = "Daten gespeichert.";
				$("#inputerrs").hide();
				
				//Show Confirm-Window
			    bootbox.setDefaults({
		          /**
		           * @optional String
		           * @default: en
		           * which locale settings to use to translate the three
		           * standard button labels: OK, CONFIRM, CANCEL
		           */
		          locale: "de"
				});

				bootbox.dialog({
				  message: "Synchronisationsdaten aktualisiert. Seite muss neu geladen werden.",
				  title: "Daten aktualisiert.",
				  buttons: {			        
					  main: {
					    label: "Seite neu laden.",
					    className: "btn-primary",
				      	callback: function() {
					  	this.modal('hide');
					  	$state.go("logged.calendar");
				      }
				    }
				  }
				});		
			});	
		}
	}

	//Delete Sync-Data
	$scope.deleteSyncDetails = function()
	{
		var data = {todo : 5};
		$http.post("core/app/endpoint/userconf.php", data).success(
			function(response){

				bootbox.dialog({
				  message: "Synchronisationsdaten entfernt. Seite muss neu geladen werden.",
				  title: "Daten aktualisiert.",
				  buttons: {			        
					  main: {
					    label: "Seite neu laden.",
					    className: "btn-primary",
				      	callback: function() {
						  	this.modal('hide');
						  	$state.go("logged.calendar");
				      }
				    }
				  }
				});	
			}
		);
	}

	//Create a MySQL-Dump
	$scope.createDataDump = function()
	{
		var data = { todo : 5};
		$http.post("core/sync/backup.php", data).success(function(response){
			if(response['backstat'] == true)
			{				
				$scope.okmess = "Backup gespeichert. Datei sichern und bei Bedarf in die Datenbank importieren. Bei Problemen mail@holgertrampe.de!";
				$("#saveokdump").fadeIn();
				$("#saveokdump").delay(2000).fadeOut();	
			}
			else
			{
				$scope.errmess = "Backup NICHT gespeichert. Bitte Schreibrechte im Ordner Backup anpassen. Bei Problemen mail@holgertrampe.de!";
				$("#saveerrdump").fadeIn();
				$("#saveerrdump").delay(4000).fadeOut();	
			}			
		});	
	}

	/*

		SCHOOLYEAR
	
	*/
	$scope.newSchoolYear = function()
	{
		$("#syerr").hide();
		$("#syerrmess").hide();
		$("#sy_desc").val("");
		$("#new_sy").modal("toggle");
		$scope.changesy = false;
	}


	//New Schoolyear
	$scope.saveNewSy = function()
	{
		var data = {
			sy_desc : $("#sy_desc").val(),
			todo : 7
		}
		//Validate Schoolyear-Input
		if(data['sy_desc'] == "" && $scope.valTargetInput(data['sy_desc']) == false)
		{
			$scope.syerrmess_info = "Bitte Bezeichnung eingeben und auf Sonderzeichen achten.";
			$("#syerrmess").fadeIn();
			$("#syerrmess").delay(3000).fadeOut();			
		}
		//All OK - save new Schoolyear to database
		else
		{
			$("#new_sy").modal("toggle");
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){	
				//Reload Scope-Schoolyears				
				//Redirect to Calendar
				$('#new_sy').on('hidden.bs.modal', function (e) {
 					$state.go("logged.classes");
				})
				
			});
		}
	}

	//Update Schoolyear
	$scope.updateSchoolYear = function(id, name)
	{
		$("#syerr").hide();
		$("#syerrmess").hide();
		$("#sy_desc").val(name);
		$("#new_sy").modal("toggle");
		$scope.changesy = true;
		$scope.sy_id = id;
	}

	//Try Update SY
	$scope.updateSY = function()
	{
		var data = {
			sy_desc : $("#sy_desc").val(),
			id : $scope.sy_id,
			todo : 10
		}
		//Validate Schoolyear-Input
		if(data['sy_desc'] == "" && $scope.valTargetInput(data['sy_desc']) == false)
		{
			$scope.syerrmess_info = "Bitte Bezeichnung eingeben und auf Sonderzeichen achten.";
			$("#syerrmess").fadeIn();
			$("#syerrmess").delay(3000).fadeOut();			
		}
		//All OK - update SY
		else
		{
			$("#new_sy").modal("toggle");
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){	
				//Reload Scope-Schoolyears				
				//Redirect to Calendar
				$('#new_sy').on('hidden.bs.modal', function (e) {
 					$state.go("logged.classes");
				})				
			});
		}
	}

	//Activate Schoolyear
	$scope.activateSchoolYear = function(id)
	{
		var data = {
			id : id,
			todo : 11
		}
		$http.post("core/app/endpoint/userconf.php", data).success(function(response){	
			//Redirect to Calendar
			$state.go("logged.classes");
		});
	}

	//Delete Schoolyear
	$scope.deleteSchoolYear = function(id)
	{
		//Show Confirm-Window
	    bootbox.setDefaults({
          /**
           * @optional String
           * @default: en
           * which locale settings to use to translate the three
           * standard button labels: OK, CONFIRM, CANCEL
           */
          locale: "de"
		});			


	    //Getting Name of schoolyear
	    var data = {
			id : id,
			todo : 12
		}
		syname = "";
		$http.post("core/app/endpoint/userconf.php", data).success(function(response){	
			bootbox.dialog({
			  message: "Achtung! Schuljahr " + response['name'] + " inkl. Klassen, Schülern, Noten und Klassenterminen wird unwiederbringlich gelöscht. Fortfahren?",
			  title: "Schuljahr " + response['name'] + " löschen",
			  buttons: {
			    success: {
			      label: "Fortfahren",
			      className: "btn-danger",
			      callback: function() {
			        	//Validate Data
						var data = {
							id : id,
							todo : 13
						}
						$http.post("core/app/endpoint/userconf.php", data).success(function(response){
							init();	
						});
			      }
			    },		    
			    main: {
			      label: "Abbrechen",
			      className: "btn-success",
			      callback: function() {
			        this.modal('hide');
			      }
			    }
			  }
			});
		});		
	}


	//DO UPDATE
	$scope.doUpdate = function()
	{
		$("#update_close").prop('disabled', true);

		$scope.inet_check = false;
		$scope.write_check = false;
		$scope.maincheck = false;
		$scope.ver_check = false;
		$scope.ver_check_no = false;
		$scope.download_up = false;
		$scope.download_data = false;
		$scope.install = false;
		$scope.install_data = false;
		$scope.install_final = false;
		$scope.install_err = false;

		$("#update_modal").modal('toggle');

		//Check for Internetconnection
		if(navigator.onLine)
		{
			$scope.inet_check = true;
		}

		var data = {
			todo : 1
		};
		$http.post("core/app/endpoint/update.php", data).success(function(response){
			if(response['writing'] == true) $scope.write_check = true;
			else {
				$scope.install_err = true;
				$("#update_close").prop('disabled', false);
			}
			if($scope.write_check == true && $scope.inet_check == true)
			{
				$scope.maincheck = true;
				var data_up = { todo : 3};
				$http.post("core/app/endpoint/update.php", data_up).success(function(response){
					if(response['doUpdate'])
					{
						$scope.ver_check = true;
						$scope.download_up = true;

						var data_down = { todo : 2, cs : response['cs'], ver : response['ver']};
						$http.post("core/app/endpoint/update.php", data_down).success(function(response){
							if(response['stat'] == true)
							{
								$scope.download_data = true;
								$scope.install = true;
								var data_install = {todo : 4, ver : response['ver']};
								$http.post("core/app/endpoint/update.php", data_install).success(function(response){
									if(response['installstat'] == true)
									{
										$scope.install_data = true;
										$scope.install_final = true;
										$("#update_close").prop('disabled', false);
									}	
									else{
										$scope.install_data = true;
										$scope.install_err = true;
										$("#update_close").prop('disabled', false);
									}
								});
							}
						});
					}
					else
					{
						$scope.ver_check = true;
						$scope.ver_check_no = true;
						$("#update_close").prop("disabled", false);
					}
				});
			}
		});
	}


	//Manage Password for Dump-Cryption
	$scope.addPasswordDump = function()
	{
		$("#dirpasserr_1").hide();
		$("#dirpasserr_2").hide();
		$("#direrrmess").hide();		
		$("#dirpass1").val("");
		$("#dirpass2").val("");
		$("#addbackuppass").modal("toggle");
	}

	//SAve new Dir-Pass
	$scope.saveNewDirPass = function()
	{
		var data = {
			dirpass1 : $("#dirpass1").val(),
			dirpass2 : $("#dirpass2").val(),			
			todo : 16
		};
		//Normal Validate
		if(
			data['dirpass1'] == "" || 
			data['dirpass2'] == "" || 
			data['dirpass1'] != data['dirpass2'] ||
			!$scope.valTextInput(data['dirpass1']) ||
			!$scope.valTextInput(data['dirpass2']) 
		)
		{
			$scope.direrrmess = "Fehler bei Eingabe. Sonderzeichen beachten! Passwörter müssen gleich sein.";
			$("#direrrmess").fadeIn();
			$("#direrrmess").delay(3000).fadeOut();
		}
		else
		{
			//Save new Password for Backup
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){
				//If new Backup then call data from Database - this is just placeholder!
				$scope.userdata.backup_pass = "set";
				$("#addbackuppass").modal("toggle");
			});								
		}
	}


	//BACKUP PATH STUFF
	$scope.addBackupPath = function()
	{
		$scope.wr_check = false;
		$scope.sa_check = false;
		$scope.spath_final = false;
		$scope.install_err = false;
		$("#update_close").hide();
		
		//Try to save something in new path
		dirtarget = $("#dirtarget").val();

		if(dirtarget.length == 0)
		{
			var data = {
				todo : 20
			};	
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){
				dirtarget = $("#dirtarget").val("");
			});	
		}
		else
		{
			$("#backuppath").modal("toggle");
			var data = {
				path : dirtarget,
				todo : 18
			};
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){
				if(response['result'] == true)
				{
					$scope.wr_check = true;
					var data = {
						path : dirtarget,
						todo : 19
					};
					$http.post("core/app/endpoint/userconf.php", data).success(function(response){
						if(response['result'])
						{
							$scope.sa_check = true;
							$scope.spath_final = true;
							$("#update_close").show();						
						}
					});
				}
				else 
				{
					$scope.install_err = true;
					$("#update_close").show();
				}
			});
		}				
	}

	//Activate/Deactive Password-Backup-Button
	$scope.loadBackupPassIn = function()
	{
		password = $("#backup_passuser").val();		
		if(password.length != 0 && file_check == true)
		{
			$("#loadinbackup_button").prop("disabled", false);
		}
		else $("#loadinbackup_button").prop("disabled", true);
	}

	//BAKCUP LOADING
	$scope.loadinBackup = function()
	{	
		$scope.loading_backup_ok = false;
		$scope.loading_backup_fail = false;
		$scope.loading_backup_done = false;
		$scope.loading_backup_process = true;
		$("#loadinbackup_pass").modal("toggle");
		
		
		var data = {
			backupstring : new_data_from_file,
			password : password,
			todo : 17
		}
	
		$http.post("core/app/endpoint/userconf.php", data).success(function(response){
				//If new Backup then call data from Database - this is just placeholder!
				$scope.loading_backup_process = false;
				if(response['result'])
				{
					$scope.loading_backup_ok = true;
				}
				else
				{
					$scope.loading_backup_fail = true;					
				}
				$scope.loading_backup_done = true;
				//Go to Calendar if Backup complete - stay if something went wrong
				$('#loadinbackup_pass').on('hidden.bs.modal', function (e) {
 					if($scope.loading_backup_fail == false)
					{
 						$state.go("logged.calendar");
 					}
				});
				
		});	
		
	}

	//Add CalDav-Data - Modalcontrol
	$scope.addCalDavData = function()
	{
		//Cofnrimmodal
		$scope.loading_caldav_check = true;
		$scope.loading_done_ok = false;
		$scope.loading_done_fail = false;
		$scope.caldav_noint = false;
		$scope.inet_check = false;
		$("#close_caldavcheck").attr('disabled', true);

		$("#caldav_link").val("");
		$("#caldav_cal").val("");
		$("#caldav_user").val("");
		$("#caldav_pass").val("");
		$("#caldaverrmess").hide()
		$scope.caldaverrmess = "";
	
		//Show Modal
		$("#addcaldav").modal('toggle');		
	}

	//Validatemodalcontrol+
	function valCalDav()
	{
		//TODO - hier Daten und Modal basteln zum prüfen und dann in Datenbank speichern
		
		$scope.loading_caldav_check = true;
		$scope.loading_done_ok = false;
		$scope.loading_done_fail = false;
		$("#close_caldavcheck").attr('disabled', true);

		//Hide all unused divs and prpeare show/hide/stuff
		$("#loading_done_ok_process").hide();
		$("#loading_done_ok").hide();
		$("#caldav_inet").show();
		$("#caldav_inet_process").show();
		$("#caldav_inet_ok").hide();
		$("#caldav_inet_fail").hide();
		$("#caldav_cal_test").hide();
		$("#caldav_cal_ok").hide();
		$("#caldav_cal_fail").hide();
		$("#caldav_cal_final_ok").hide();
		
		$("#check_caldav").modal('show');
				
		//Check for Inet
		if(navigator.onLine)
		{
			$("#loading_done_ok").show();
			$("#loading_done_ok_process").hide();
			$("#caldav_inet_ok").show();
			//INET-OK - Check Cal-Access			
			$("#caldav_inet_process").hide();
			$("#caldav_cal_test").show();
			$("#caldav_cal_process").show();
			var data = { 
				todo : 5,
				link: $("#caldav_link").val(),
				calname : $("#caldav_cal").val(),
				user : $("#caldav_user").val(),
				pass : $("#caldav_pass").val()
			};
			$http.post("core/app/endpoint/caldavsync.php", data).success(function(response)
		   	{	
		   		//Error Calconnection
		   		if(response['message'] != true)
		   		{
			   		$("#close_caldavcheck").attr('disabled', false);
			   		$("#caldav_cal_fail").show();
			   		$("#caldav_cal_process").hide();			   		
			   	}
			   	else
			   	{
			   		$("#caldav_cal_process").hide();		
			   		$("#caldav_cal_ok").show();	
			   		$("#caldav_cal_final_ok").show();
			   		$("#close_caldavcheck").attr('disabled', false);	
			   		$('#check_caldav').on('hidden.bs.modal', function () {				
						$state.go("logged.calendar");    		
					});	
			   	}
			 });
		}
		//NO INET Show infos in Modal
		else					
		{
			$("#caldav_inet_process").hide();
			$("#caldav_inet_fail").show();
			$("#caldav_cal_process").hide();
			$("#close_caldavcheck").attr('disabled', false);
		}
		
	}

	//Validate and test Calendar - save by success
	$scope.saveCalDavAndTest = function()
	{
		var data = {
			caldav_link : $("#caldav_link").val(),
			caldav_cal :  $("#caldav_cal").val(),
			caldav_user : $("#caldav_user").val(),
			caldav_pass : $("#caldav_pass").val(),
			todo : 1
		};

		//Validate Data
		if(
			data['caldav_link'] == "" || $scope.valTextInput(data['caldav_link']) == false ||
			data['caldav_cal'] == "" || $scope.valTextInput(data['caldav_cal']) == false ||
			data['caldav_user'] == "" || $scope.valTextInput(data['caldav_user']) == false ||
			data['caldav_pass'] == "" || $scope.valTextInput(data['caldav_pass']) == false 
			)
		{
			//Error Found - do something
			$scope.caldaverrmess = "Fehler. Bitte valide Daten eingeben!";
			$("#caldaverrmess").fadeIn();
			$("#caldaverrmess").delay(3000).fadeOut();
		}
		else
		{
			//Data OK - close Modal and load Checking-Cal-Modal
			$("#addcaldav").modal('toggle');
			$('#addcaldav').on('hidden.bs.modal', function () {				
				valCalDav();	    		
			});	
		}

	}

	//Delete CalDav-Data
	$scope.deleteCalDavData = function()
	{
		var data = { todo : 6};
		$http.post("core/app/endpoint/caldavsync.php", data).success(function(response)
		{
			$state.go("logged.calendar");
		});

	}

	//Clear IMG-Files
	$scope.doClearImg = function()
	{
		$scope.deletecounter_img = 0;
		$("#progressimgclearing").modal("toggle");
		var data = { todo : 11};
		//Search for images and delete unliked images
		$http.post("core/app/endpoint/students.php", data).success(function(response)
		{
			//get image counter
			$scope.deletecounter_img = response['delcounter'];		
			$("#progressimgclearing").modal("toggle");		
			$('#progressimgclearing').on('hidden.bs.modal', function () {		
				$("#progressimgclearing_done").modal("toggle");   		
			});		
		});
	}

	//Create ZIP-Backupfile and give it to download
	$scope.createImgBackup = function()
	{
		$("#progressimgbackup").modal("toggle");
		var data = { todo : 12};
		//Search for images and delete unliked images
		$http.post("core/app/endpoint/students.php", data).success(function(response)
		{	
			console.log(response);
			$("#progressimgbackup").modal("toggle");	
			$('#progressimgbackup').on('hidden.bs.modal', function () {		
				if(response) $("#progressimgbackup_done").modal("toggle");
				else  $("#progressimgbackup_fail").modal("toggle");
			});		
		});
	}

	//Check for ZIP-File and disabled/enable Upload-Button
	$scope.prepareImgUploadFile = function(files)
	{
		//files = file to upload
		filename = files[0]['name'];
		filename_splitted = filename.split(".");
		if(filename_splitted[1] == "ZIP" || 
			filename_splitted[1] == "zip")
		{
			$("#imgbackup_fail").hide();
			$("#loadimgbackup").prop("disabled", false);
		}
		else
		{
			$("#imgbackup_fail").fadeIn();		
			$("#loadimgbackup").prop("disabled", true);
		}
	}

	//DO Upload BACKUP
	$scope.loadImgBackupFile = function()
	{
		//Show Loading-Modal
		$("#progressloadimgbackup").modal('toggle');
		filedata = $("#imgbackupfile").prop('files')[0];
		//name
		Upload.upload(
		{
			url: 'core/app/endpoint/img_backup.php',
			data: {				
				file: filedata
			}
		}).then(function(resp) 
		{
			console.log(resp);
			$("#progressloadimgbackup").modal("toggle");	
			$('#progressloadimgbackup').on('hidden.bs.modal', function () {		
				if(resp['data'][0]) $("#progressloadimgbackup_done").modal("toggle");
				else  $("#progressloadimgbackup_fail").modal("toggle");
			});	
		});		
	}
		/*
		Add Google Data
	
		*/
		$scope.addGoogleData = function()
		{
			$("#googlecaldaverrmess").hide();
			$("#google_cal").val("");
			$("#google_client").val("");
			$("#addgoogle").modal("toggle");
		}


		//Validate Data and save when ok
		$scope.saveGoogleData = function()
		{
			var data = {
				todo : 24,
				clientid : $("#google_client").val(),
				calid : $("#google_cal").val(),
				username : $scope.userdata['username']
			};
			//Validate
			if($scope.valTextInput(data['clientid']) == false ||
				$scope.valTextInput(data['calid']) == false
				)
			{
				//Val Fail - Show errmess
				$scope.googleerrmess = "Bitte Daten eingeben.";
				$("#googlecaldaverrmess").fadeIn();
			}
			else
			{
				//Val OK - Save and toggle modal
				$("#googlecaldaverrmess").hide();					
				$http.post("core/app/endpoint/userconf.php", data).success(function(response)
				{
					$("#addgoogle").modal("toggle");	
					$scope.userdata['google_clientid'] = data['clientid'];
					$scope.userdata['google_calendarid'] = data['calid'];
				});
			}
		}


		//Delete GoogleCalendar-Data
		$scope.deleteGoogleData = function()
		{
			var data = {
				todo : 25,
				username : $scope.userdata['username']
			};
			$http.post("core/app/endpoint/userconf.php", data).success(function(response)
			{
				$scope.userdata['google_clientid'] = "";
				console.log(response);
			});			
		}
})