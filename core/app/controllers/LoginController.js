app.controller("LoginController", function($scope, $http, $state, $document)
{	
	//Functions
	$scope.loginUser = function (){
		
		//Getting the ErrMessage-Area and LoginInputs
		var loginInfoErr = $document.find('#loginInfoErr');
		var usernameInput = $document.find('#username');
		var passwordInput = $document.find('#password');
		//Try to Login a user
		try {
			//Getting the logging-Info
			//Check against dropping
			if($scope.loginInfo.username.match(/^[a-z]+$/) && $scope.loginInfo.password.match(/^[A-Za-z0-9!?_]+$/))
			{
				var data = {
					username : $scope.loginInfo.username,
					password : $scope.loginInfo.password
				}

				$http.post("core/app/endpoint/login.php", data).success(function(response){	
					
					//Login Succesfully	
					if(response['stat'] == 'login_true')
					{
						//LocalStorage save user
						localStorage.setItem("user", response['hash']);
						//Hide the login-Window	and when its hide go to logged-state
						$("#loginMod").modal('toggle');
						$("#loginMod").on('hidden.bs.modal', function () {
							$state.go("logged.calendar");
						});
					}
					//Response "loLogin" = wrong user-data	or not complete filled login-form	
					else 
					{	
						//Prepare ErrMessage
						loginInfoErr.html("Falsche Daten!");					
						passwordInput.val('');
						//Show Error-Message and stay there
						loginInfoErr.fadeIn();					
					}					
				});				
			}
			else
			{
				loginInfoErr.fadeIn();
				loginInfoErr.html("Bitte valide Daten eingeben!");		
			}
		}
		//On ErrresetLoginModor show ErrMessage in Div
		catch (e)
		{
			loginInfoErr.fadeIn();
			loginInfoErr.html("Bitte Daten eingeben!");			
		}
	};
});