app.controller("TopNavLoggedController", function($scope, $http, $state){
	
	//Get Time of an Unit
	function createDateTimeString(dateinfo)
	{

		var date = new Date(parseInt(dateinfo));				
		var hours = "";
		var minutes = "";			
		if(date.getHours() < 10) hours = "0" + date.getHours();
	    else hours = date.getHours();
	    if(date.getMinutes() < 10) minutes = "0" + date.getMinutes();
	    else minutes = date.getMinutes();	    
	    return hours + ":" + minutes;
	}
	
	
	var init = function () {
		var data = {
			token : localStorage.getItem('user')
		}
		try 
		{
			$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
		   	{	
		   		try{
					$scope.loggeddata = response;																	
				}
				catch(e)
				{				
					response = 0;
				}		
			});	
		}
		catch(e)
		{
			response = 0;
		}		
		//Reload ClassData
		$scope.loadingClassDataMenue();
	};	
	init();


	//Sending data to server for synching
	function sendingData(target, token, username, sql)
	{
		var req = {
		 method: 'POST',
		 url: target + "core/sync/upload.php",		 
		 headers: {
		   'Content-Type': undefined
		 },
		 data: { token: token, username: username , sql : sql }
		};		
		//Sending
		$http(req).then(function(response){});
	}

	//Loading data from server
	function loadingData(target, token, username)
	{
		var req = {
		 method: 'POST',
		 url: target + "core/sync/download.php",		 
		 //url: "sync/download.php",
		 headers: {
		   'Content-Type': undefined
		 },
		 data: { token: token, username: username }
		};	
		
		$scope.progmess = "Daten heruntergeladen...";
		//$("#progmod").modal('toggle');
		$scope.progvalue = 10;
					
		//Loading Data
		$http(req).then(function(response){
			
			var data = { todo : 4, sql : response['data']['sql']};
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){			

				$scope.progmess = "Daten heruntergeladen. Aktuelle Daten entsprechen jetzt Serverdaten.";
				$scope.progvalue = 100;
				setTimeout(function () {							
				  	$("#progmod").modal('toggle');
				  	$state.go("logged.calendar");
				}, 2500);
			});
		});
	}

	//Synchronisation
	$scope.upload = function()
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


		var target = $scope.loggeddata['synctarget'];
		var token = $scope.loggeddata['synctoken'];
		var username = $scope.loggeddata['username'];

		//Get Last Serversyncdate
		var synctime = "";
		var req = {
		 method: 'POST',
		 url: target + "core/sync/getsyncinfo.php",		 
		 headers: {
		   'Content-Type': undefined
		 }		 
		};		
		//Sending
		$http(req).then(function(response){			
			if(response['data']['time'] != "")
			{
				$scope.time_sync = response['data']['time'];
				bootbox.dialog({
				  message: "Achtung! Daten auf Server vom " + $scope.createDateString(parseInt($scope.time_sync*1000)) + " " + createDateTimeString(parseInt($scope.time_sync*1000)) + ". Überschreiben mit aktuellem Stand?",
				  title: "Synchronisation - Daten auf Server überschreiben",
				  buttons: {
				    success: {
				      label: "Fortfahren",
				      className: "btn-success",
				      callback: function() {
				        	//waitingDia.show('Daten werden hochgeladen. Bitte warten.');
							$scope.progmess = "Daten werden verarbeitet...";
							$scope.progvalue = 10;
							$("#progmod").modal('show');
							var data = { todo: 3};

							$http.post("core/app/endpoint/userconf.php", data).success(function(response){			
								//Sending data								
								sendingData(target, token, username, response['sql']);																		
							}).finally(function(){						
								//View info - wait 2 snd and close window
								$scope.progmess = "Daten hochgeladen. Upload abgeschlossen. Daten auf dem Server jetzt aktuell.";
								$scope.progvalue = 100;
								//Close watingo modal
								setTimeout(function () {							
								  	$("#progmod").modal('toggle');
								}, 2500);
							});
				      }
				    },		    
				    main: {
				      label: "Abbrechen",
				      className: "btn-primary",
				      callback: function() {
				        this.modal('toggle');
				      }
				    }
				  }
			});
			}
			else
			{
				bootbox.dialog({
				  message: "Server unerreichbar. Adresse und Token korrekt eingetragen?",
				  title: "Fehler bei Synchronisation",
				  buttons: {
				    main: {
				      label: "Schliessen",
				      className: "btn-primary",
				      callback: function() {
				        this.modal('toggle');
				      }
				    }
				  }
				});
			};
		}, function errorCallback(response) {
			bootbox.dialog({
			  message: "Server unerreichbar. Adresse und Token korrekt eingetragen?",
			  title: "Fehler bei Synchronisation",
			  buttons: {
			    main: {
			      label: "Schliessen",
			      className: "btn-primary",
			      callback: function() {
			        this.modal('toggle');
			      }
			    }
			  }
			});
		});		
	}

	//Download Data from Server
	$scope.download = function()
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


		var target = $scope.loggeddata['synctarget'];
		var token = $scope.loggeddata['synctoken'];
		var username = $scope.loggeddata['username'];

		//Get Last Serversyncdate
		var synctime = "";
		var req = {
		 method: 'POST',
		 url: target + "core/sync/getsyncinfo.php",		 
		 headers: {
		   'Content-Type': undefined
		 }		 
		};		
		//Sending
		$http(req).then(function(response){
			$scope.time_sync = response['data']['time'];
			if(response['data']['time'] != "")
			{
				bootbox.dialog({
				  message: "Achtung! Daten vom Server vom " + $scope.createDateString(parseInt($scope.time_sync*1000)) + " " + createDateTimeString(parseInt($scope.time_sync*1000)) + ". Lokale Daten überschreiben?",
				  title: "Synchronisation - Lokale Daten mit Serverdaten überschreiben",
				  buttons: {
				    success: {
				      label: "Fortfahren",
				      className: "btn-success",
				      callback: function() {
							loadingData(target, token, username);
				      }
				    },		    
				    main: {
				      label: "Abbrechen",
				      className: "btn-primary",
				      callback: function() {
			
				        this.modal('toggle');
				      }
				    }
				  }
				});
			}
			else 
			{
				bootbox.dialog({
				  message: "Server unerreichbar. Adresse und Token korrekt eingetragen?",
				  title: "Fehler bei Synchronisation",
				  buttons: {
				    main: {
				      label: "Schliessen",
				      className: "btn-primary",
				      callback: function() {
				        this.modal('toggle');
				      }
				    }
				  }
				});
			}
		}, function errorCallback(response) {
			bootbox.dialog({
			  message: "Server unerreichbar. Adresse und Token korrekt eingetragen?",
			  title: "Fehler bei Synchronisation",
			  buttons: {
			    main: {
			      label: "Schliessen",
			      className: "btn-primary",
			      callback: function() {
			        this.modal('toggle');
			      }
			    }
			  }
			});
		});	
	}

})