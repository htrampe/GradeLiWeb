app.controller("ClassesConfController", function($scope, $http, $state){

	//Functions
	/*

		INITIAL CLASS LOADING

	*/
	//Loading Scope with Class-Data
	var init = function()
	{	
		//TopNavService.renderTopNav($scope, $http);
		var data = { todo : 1 };
		$http.post("core/app/endpoint/classes.php", data).success(function(response){
			$scope.classes = response;
			//TopNavService.renderTopNav($scope, $http);
		});			

	}
	init();

	/*
		Class-Modal-Functions
		Located in views/logged/logged_classes.html

	*/
		//Show Modal
		$scope.newClass = function(id)
		{		
			$scope.classTodo = false;
			$("#inputerr").hide();

			//No ID set - just toggle empty new-class-modal
			if(id == undefined)
			{				
				$("#class_name").val("");		
				$("#class_info").val("");		
				//Initial-Color - relaxed blue
				$("#class_color").val("#68A1BD");						
			}			
			$("#newclass").modal('toggle');	
		}

		//Validate and save new Class
		$scope.saveNewClass = function()
		{
			//Validate Data
			var data = {
				name : 	$("#class_name").val(),		
				info: $("#class_info").val(),		
				color: $("#class_color").val(),
				system: $("#notesystem").val(),
				todo : 0
			}
			
			//Validate Inputs
			if(data['name'] == "" || 
				$scope.valTextInput(data['name']) == false ||				
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)				
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Sonderzeichen achten!";
				$("#inputerr").fadeIn();
			}	
			//All check ok - save new Class to Database		
			else
			{
				//Save to Database
				$http.post("core/app/endpoint/classes.php", data).success(function(response){
					init();
				});							
				//New Loading Scope-Data
				init();
				//Hide Modal
				$("#newclass").modal('toggle');
			}
		}


		//Delete Class
		$scope.doDeleteClass = function(id)
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

			bootbox.dialog({
			  message: "Achtung! Klasse wird inkl. aller enthaltenen Schüler, Noten und Einheiten gelöscht und kann nicht wiederhergestellt werden. ",
			  title: "Klasse löschen",
			  buttons: {
			    success: {
			      label: "Fortfahren",
			      className: "btn-danger",
			      callback: function() {
			        	//Validate Data
						var data = {
							id : id,
							todo : 2
						}
						$http.post("core/app/endpoint/classes.php", data).success(function(response){
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
			
			
		}

		//Update a Class
		$scope.doUpdateClass = function(id)
		{
			//Validate Data
			var data = {
				id : id,
				name : 	$("#class_name_" + id).val(),		
				info: $("#class_info_" + id).val(),		
				color: $("#class_color_" + id).val(),
				todo : 3
			}
			
			//Validate Inputs
			if(data['name'] == "" || 
				$scope.valTextInput(data['name']) == false ||				
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)				
			)
			{
				$scope.errmess = "Falsche Daten! Titel angeben und Sonderzeichen beachten!";
				$("#inputerr_" + id).fadeIn();
				$("#inputerr_" + id).delay(4000).fadeOut();
			}	
			//All check ok - save new Class to Database		
			else
			{
				//Save to Database
				$http.post("core/app/endpoint/classes.php", data).success(function(response){
					//New Loading Scope-Data	
					$scope.okmess = "Daten gespeichert.";
				   	$("#saveok").fadeIn();
					$("#saveok").delay(2000).fadeOut();
					init();	
				});	
			}
			
		}

		//Switching to ClassView
		/*
		@param
				id : Class ID

		*/
		$scope.watchClassPlan = function(id)
		{
			$state.go("logged.classview", {classid:id});	
		}

		//Switching to StudentClassView
		$scope.studentClass = function(id)
		{
			
			$state.go("logged.studentclassview", {classid: id});
		}

		//Copy class
		/*
			
			COPY ONLY STUDENTS, INFOS, FOTOLINKS and CLASSDATA Link name, color, system and info

			NO NOTES/UNITS etc. will be copyied!!!

		*/
		$scope.copyClass = function(classid)
		{
			var data = {todo:4, classid : classid};
			$http.post("core/app/endpoint/classes.php", data).success(function(response){
				//New Loading Scope-Data					
				init();	
			});
		}
})