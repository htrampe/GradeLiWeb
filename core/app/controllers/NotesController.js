app.controller("NotesController", function($scope, $http, $state, $stateParams){

	var classid = $stateParams.classid;

	var init = function()
	{
		var data = { 
			id : classid, 
			todo : 7
		};
		//Classdata
		$http.post("core/app/endpoint/class_orga.php", data).success(function(response){
			$scope.classdata = response;		
			//Adding Cats Mouth
			var index = 0;		
			while(response['cats'][index] != undefined)
			{				
				$("#catname_" + response['cats'][index]['id']).val(response['cats'][index]['title']);								
				index = index + 1;
			}		

			//Noten
			var index = 0;		
			while(response['noten'][index] != undefined)
			{					
				$("#noten_" + response['noten'][index]['id']).val(response['noten'][index]['title']);								
				index = index + 1;
			}		
		});	
	}
	init();

	//Update Weight Mouth and Written
	$scope.updateWeight = function(kind)
	{		
		var data = "";
		//Update Mouth
		if(kind == 0)
		{
			data = 
			{
				weight : $("#w_mouth").val(),
				classid : classid,
				todo : 0			
			}
		}
		//Update Written
		else if(kind == 1)
		{
			data = 
			{
				weight : $("#w_written").val(),
				classid : classid,
				todo : 1			
			}	
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){

		});	
	}

	//New Categorie
	$scope.newCat = function(kind)
	{
		//0 = Mouth
		//1 = Written
		var data = "";
		//Update Mouth
		if(kind == 0)
		{
			data = 
			{
				classid : classid,
				todo : 2			
			}
		}
		//Update Written
		else if(kind == 1)
		{
			data = 
			{
				classid : classid,
				todo : 3			
			}	
		}		
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			init();
		});
	}

	//Update a Categorie
	$scope.changeCat = function(id, kind)
	{
		//0 - change name
		//1 - change weight
		var data = "";
		//Cat-Name
		if(kind == 0)
		{
			if($("#catname_" + id).val() == "" || 
				($("#catname_" + id).val() != "" &&$scope.valTextInput($("#catname_" + id).val()) != false)
				)
			{
				data = 
				{
					cat : id,
					name : $("#catname_" + id).val(),				
					todo : 4			
				}
			}
			else
			{
				init();
			}
		}
		//CAt-Weight
		else if(kind == 1)
		{
			data = 
			{
				cat : id,
				weight : $("#catweight_" + id).val(),
				todo : 5			
			}	
		}		
		$http.post("core/app/endpoint/notes.php", data).success(function(response){});
	}

	//Delete a Cat
	$scope.delCat = function(id)
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
		  message: "Achtung! Kategorie inkl. aller Noten und Noten der Schüler löschen. Kann nicht rückgängig gemacht werden!",
		  title: "Kategorie löschen",
		  buttons: {
		    success: {
		      label: "Fortfahren",
		      className: "btn-danger",
		      callback: function() {
		        	//Delete every stunote with this category
					var data = {todo : 16, id : id};
					$http.post("core/app/endpoint/notes.php", data).success(function(response){			
						var index;		   		
				   		for (index = 0; index < response.length; ++index)
						{
							var data = {todo : 17, notenid : response[index]['id']};
							$http.post("core/app/endpoint/notes.php", data).success(function(response){});
						}		
					});

					var data = {todo : 6, id : id};
					$http.post("core/app/endpoint/notes.php", data).success(function(response){
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


	//New Note
	$scope.newNote = function(kind)
	{
		var data = {
			classid : classid,
			kind : kind,
			todo : 7
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			init();
		});
	}

	//New Note
	$scope.newNoteCat = function(kind, catid)
	{
		var data = {
			classid : classid,
			catid : catid,
			kind : kind,
			todo : 11
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			init();
		});
	}

	//Note delete
	$scope.delNote = function(id)
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
		  message: "Achtung! Note inkl. Notendaten der Schüler unwiederbringlich löschen!",
		  title: "Note löschen",
		  buttons: {
		    success: {
		      label: "Fortfahren",
		      className: "btn-danger",
		      callback: function() {
		        	var data = {todo : 8, id : id};
					$http.post("core/app/endpoint/notes.php", data).success(function(response){
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

	//Change NoteName
	$scope.changeNoteName = function(id)
	{
		if($("#noten_name_" + id).val() == "" ||
			($("#noten_name_" + id).val() && $scope.valTextInput($("#noten_name_" + id).val()) != false)
			)
		{
			data = 
			{
				note : id,
				name : $("#noten_name_" + id).val(),				
				todo : 9			
			}
			$http.post("core/app/endpoint/notes.php", data).success(function(response){});
		}
		else
		{
			init();
		}
	}

	//Update NoteWeight
	$scope.updateNoteWeight = function(id)
	{
		data = 
		{
			note : id,
			weight : $("#noten_weight_" + id).val(),				
			todo : 10			
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){});
	}

	//Manage NOte
	$scope.manageNote = function(notenid)
	{
		$state.go("logged.classnot", {classid:classid, notenid:notenid});	
	}


})