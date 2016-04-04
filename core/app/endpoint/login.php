<?php

	
	require_once '../model/class.dbmod.inc.php';
	$dbmod = new dbmod();
	
	$username = "";
	$password = "";
	//Convert LoginInfo to an array
	$data = json_decode(file_get_contents("php://input"));
	$toSide['stat'] = "login_false";

	if(isset($data->password) and isset($data->username))
	{
		$username = $data->username;
		$password = $data->password;	
	}
	else
	{
		$username = "";
		$password = "";
	}
	
	$checking = $dbmod->checkLogin($username, $dbmod->cryptPass($password));	
	$checking = $checking->fetchAll();
	
	//Return Username to site if found
	//If not return 0
	//Login True
	
	if(sizeof($checking) == 1)
	{
		//Authentification
		//RND-Nummer
		$numb = rand(1,999999999);
		//Numb to Database
		$toSide['update'] = $dbmod->updateLogin($numb, $username);		
		//Hash
		$hash = hash('ripemd160', $username.$numb);
		$toSide = [];
		$toSide['hash'] = $hash;
		$toSide['stat'] = "login_true";
		echo json_encode($toSide);	
	}
	else echo json_encode($toSide);
?>