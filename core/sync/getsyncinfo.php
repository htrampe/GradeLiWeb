<?php
header("Access-Control-Allow-Origin: *");

//Getting Databaseobject
require_once("../../gw-config.php");

//SYNC FUNCTIONS
//Get Token
function getLastSync($db)
{
	$sql = "SELECT synctime FROM users WHERE id = 1";
	$result = $db->query($sql);
	return $result->fetch()[0];
}

$toSide['time'] = getLastSync($db);

echo json_encode($toSide)

?>