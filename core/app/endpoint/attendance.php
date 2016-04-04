<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];


//Get data of unit and student ONLY TO CHECK IF EXIST
/*
@param

	unitid : units id 
	studentid : students id

*/
if($data->todo == 0)
{	

	$result = $dbmod->checkForUnitStuData($data->unitid, $data->studentid);	
	$toSide['count'] = $result;
	$toSide['stuid'] = $data->studentid;

	echo json_encode($toSide);
}
//Create inital data-set
/*

@param

	unitid : units id 
	studentid : students id
	//attendance-initial is 4 for middle-good-work
	attendance : 4,

*/
elseif($data->todo == 1)
{
	$dbmod->newUnitStuData($data->unitid, $data->studentid, $data->attendance, $data->classid);	
}
//Getting all Data from one unit for complete class
elseif($data->todo == 2)
{
	$units = $dbmod->getUnit($data->unitid);
	$counter = 0;
	while($row = $units->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['students_id'] = $row['students_id'];
		$toSide[$counter]['classdates_id'] = $row['classdates_id'];
		$toSide[$counter]['notice'] = $row['notice'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['prename'] = $row['prename'];
		$toSide[$counter]['img'] = $row['fotolink'];
		$toSide[$counter]['attendance'] = $row['attendance'];
		$toSide[$counter]['tolate'] = $row['tolate'];
		$counter++;
	}

	//Getting Sum UE
	$toSideCounts['sum_ue'] = $dbmod->getUnitSumUE($data->unitid);

	//Getting Sum E	
	$toSideCounts['sum_e'] = $dbmod->getUnitSumE($data->unitid);

	echo json_encode(array($toSide, $toSideCounts));
}
/*

	Update Unit-Attendance
	unitid : classdatesid, 
	studentid : studentid,
	attendance : newvalue,
	todo: 3

*/
elseif($data->todo == 3)
{
	$dbmod->upAtt($data->unitid, $data->studentid, $data->attendance);
}
//Updtae the Time
elseif($data->todo == 4)
{
	$dbmod->upTime($data->unitid, $data->studentid, $data->time);
}
//Update a notice
/*

	
	studentid : studentid,
	classdates_id : classdates_id,
	notice : notice,			
	
*/
elseif($data->todo == 5)
{
	$dbmod->upNotice($data->classdates_id, $data->studentid, $data->notice);
}
?>