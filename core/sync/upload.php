<?php
header("Access-Control-Allow-Origin: *");

//Getting Databaseobject
require_once("../application/.kp_config");

//SYNC FUNCTIONS
//Get Token
function getToken($username, $db)
{
	$sql = "SELECT synctoken FROM users WHERE username = '$username'";
	$result = $db->query($sql);
	return $result->fetch();
}

$toSide['stat'] = false;
$data = json_decode(file_get_contents("php://input"));

if(isset($data->token))
{	
	
	//Getting Token from Database and check for same data
	if(strcmp((getToken($data->username, $db)[0]), $data->token) == 0)
	{
		//TOKEN OK - SYNC DATA
		$toSide['stat'] = true;
		//Query
		$db->query($data->sql);		
		//Save new Classes
		echo json_encode($toSide);	
	}
	else echo json_encode($toSide);		
}
else
{
	echo json_encode($toSide);
}

?>