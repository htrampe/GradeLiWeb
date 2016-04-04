<?php

	require_once '../model/class.dbmod.inc.php';
	$dbmod = new dbmod();

	$toSide = [];

	//Gives the Schoolname as String
	$toSide['schoolname'] = utf8_encode("GradeLiWeb");//Data-Array for returning data to side

	//Username
	$token = "";
	
	//Convert LoginInfo to an array
	$data = json_decode(file_get_contents("php://input"));
	
	if(isset($data->token))
	{
		$token = $data->token;		
	}
	
	$checking = $dbmod->checkingAuth();
	//Find Combination of Username and tempnumb to compare the token  to auth the logged-user by server
	while ($row = $checking->fetch()) {
		if(hash('ripemd160', $row['username'].$row['tempnumb']) == $token)
		{
			//Comb found - send ok
			$toSide['username'] = $row['username'];		
			$toSide['synctarget'] = $row['synctarget'];
			$toSide['synctoken'] = $row['synctoken'];
		}
    }
	echo json_encode($toSide);	
?>