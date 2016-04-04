<?php

	require_once '../model/class.dbmod.inc.php';
	$dbmod = new dbmod();
	$token = "";
	$toSide =[];
	//Convert LoginInfo to an array
	$data = json_decode(file_get_contents("php://input"));
	
	if(isset($data->token))
	{
		$token = $data->token;		
	}
	$toSide['stat'] = "failed";

	$checking = $dbmod->checkingAuth();
	//Find Combination of Username and tempnumb to compare the token  to auth the logged-user by server
	while ($row = $checking->fetch()) {
		if(hash('ripemd160', $row['username'].$row['tempnumb']) == $token)
		{
			$username = $row['username'];
			//Comb found - remove numb and send rmdone
			$dbmod->unlogUser($username);
			$toSide['stat'] = "rmdone";			
		}
    }
    //Return stat to auth user
    echo json_encode($toSide);
?>