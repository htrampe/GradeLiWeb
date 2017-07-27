<?php

//Return a String of ten characters
function getRndFileName()
{
	return substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), 0, 10);
}


//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();

$done = true;	
$toSide[0] = false;
$found = true;
$new_file_name = "";
//Create random filename and check, if name is setted
do
{
	$new_file_name = getRndFileName();
	$toSide[0] = $new_file_name;
	$dirdata = scandir("../../../stuimg/"); 

	for($i = 0; $i < sizeof($dirdata); $i++)
	{
		$temp_name = explode(".", $dirdata[$i])[0];
		if($temp_name == $new_file_name)
		{
			$found = true;
		} 
		else $found = false;
	}
}while($found);

//Move uploaded file to stuimg-dir
try
{
	move_uploaded_file($_FILES['file']['tmp_name'], "../../../stuimg/".$new_file_name.".jpg");
}
catch(IOException $e)
{
	$done = false;
	$toSide[3] = $e;
}

//check copy
if($done)
{
	if(!file_exists("../../../stuimg/".$new_file_name.".jpg"))
	{
		$done = false;
	}
}

$toSide[1] = false;
if($done)
{
	$toSide[1] = true;
}

//Return stat
echo json_encode($toSide);
?>