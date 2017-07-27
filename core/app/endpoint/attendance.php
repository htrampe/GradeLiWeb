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
	//NOTE: Is set in dbmod.inc as "NA"

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
		$toSide[$counter]['note'] = $row['note'];
		$toSide[$counter]['tolate'] = $row['tolate'];
		$counter++;
	}

	//Getting Sum UE
	$toSideCounts['sum_ue'] = $dbmod->getUnitSumUE($data->unitid);

	//Getting Sum E	
	$toSideCounts['sum_e'] = $dbmod->getUnitSumE($data->unitid);

	//Getting Sum SE
	$toSideCounts['sum_se'] = $dbmod->getUnitSumSE($data->unitid);

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
//Update the Time
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
//Getting Pre-Unit
elseif($data->todo == 6)
{
	//IF false --> no unit exist
	$sourceunitid = $dbmod->getPreUnit($data->classid, $data->unitid)->fetch();
	if($sourceunitid != false)
	{
		//True - Unit exist - Copy data in actual unit
		//Loading Unit-Data from Pre-Unit and Update Directly
		$units = $dbmod->getUnit($sourceunitid['id']);
		$counter = 0;
		while($row = $units->fetch())
		{
			$dbmod->upAtt($data->unitid, $row['students_id'], $row['attendance']);
			$dbmod->upNotice($data->unitid, $row['students_id'], $row['notice']);
		}

		$toSide['result'] = $dbmod->getSingelClassDate($sourceunitid['id']);
	}
	else $toSide['result'] = false;

	echo json_encode($toSide);
}
//Check if a Pre-Unit exist
elseif($data->todo == 7)
{
	//IF false --> no unit exist
	$sourceunitid = $dbmod->getPreUnit($data->classid, $data->unitid)->fetch();
	if($sourceunitid != false)
	{
		$toSide['result'] = $dbmod->getSingelClassDate($sourceunitid['id']);
	}
	else $toSide['result'] = false;

	echo json_encode($toSide);
}
//Update a Note in a Unit
elseif($data->todo == 8)
{
	$dbmod->upUnitNote($data->unitid, $data->studentid, $data->note);
}
//Getting Unit-ID and short Infos from actual id
elseif($data->todo == 9)
{
	$toSide[0] = $dbmod->getPreByUnit($data->id, $data->classid)->fetch();
	$toSide[1] = $dbmod->getForByUnit($data->id, $data->classid)->fetch();
	echo json_encode($toSide);
}
?>