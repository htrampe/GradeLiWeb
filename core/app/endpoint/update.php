<?php
/*

	UPDATE INFOS

*/
$data = json_decode(file_get_contents("php://input"));
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
$toSide = [];

//Check for writing
if($data->todo == 1)
{
	$testing = fopen("testing.txt", "w");
	if(file_exists("testing.txt"))
	{
		fclose($testing);
		$toSide['writing'] = true;
		unlink("testing.txt");
	}
	else $toSide['writing'] = false;		
}
//Download new Data and validate download
elseif($data->todo == 2)
{
	//Downlad CORE 
	$core = "../../../gw_".$data->ver.".zip";
	$err = "";
	file_put_contents($core, fopen("http://www.holgertrampe.de/gradeliwebdata/updates/gw_".$data->ver.".zip", 'r'));
	$cs = $data->cs;
	$ver = $data->ver;
	
	if(md5_file($core) != $cs)
	{				
		$err = "Herunterladen der Quelldateien fehlerhaft.";
		$toSide['stat'] = false;		
		exit();
	}
	else
	{		
		$toSide['stat'] = true; 
		$toSide['ver'] = $ver;
	}	
}
//Check for never version
elseif($data->todo == 3)
{
	//get version
	$ver_local = $dbmod->getVer();

	//Compare
	$json = file_get_contents('http://www.holgertrampe.de/gradeliwebdata/getactver.php');
	$obj = json_decode($json);
	$ver_server['ver'] = $obj->ver;

	if($ver_server['ver'] > $ver_local){
		$toSide['doUpdate'] = true;
		$toSide['cs'] = $obj->cs;	
		$toSide['ver'] = $obj->ver;
	} 
	else $toSide['doUpdate'] = false;	
}
//EXTRACT VERIFIED ZIP
elseif($data->todo == 4)
{
	//Install Core
	$core = "../../../gw_".$data->ver.".zip";
	$zipcore = new ZipArchive;
	if($zipcore->open($core) == "true"){
		$zipcore->extractTo("../../../");
		$zipcore->close();
		unlink($core);
		//Update Database
		if(file_exists("../../../update.sql"))
		{
			$dbmod->updateDB(file_get_contents("../../../update.sql"));
			$dbmod->updateVer($data->ver);
			unlink("../../../update.sql");
			$toSide['installstat'] = true;	
		}
		else $toSide['installstat'] = false;		
	}
	else{
		$toSide['installstat'] = false;	
		unlink($core);
		exit();	
	}
}
echo json_encode($toSide);



?>