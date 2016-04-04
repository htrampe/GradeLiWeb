<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));

$toSide = [];


/* NOTEN FUNCTON 

	Returns all final notes of a Student in an array
	written_nf - final in written
	mouth_nf - final motuh
	nf - final note over all

	@param
		dbmod - databaseconnection
		classid - id of class
		studentid - id of student
*/
function getNoten($dbmod, $classid, $studentid)
{
	$classdata = $dbmod->getSingleClass($classid)->fetch();
	$toSide['id'] = $classdata['id'];
	$toSide['w_mouth'] = $classdata['w_mouth'];
	$toSide['w_written'] = $classdata['w_written'];
	$toSide['unitcount'] = $dbmod->getSingleClassUnitCount($classid);

	//Get all Cats
	$toSide['cats'] = [];	
	$cats = $dbmod->getAllCats($classid);
	$counter = 0;
	while($row = $cats->fetch())
	{
		$toSide['cats'][$counter]['id'] = $row['id'];
		$toSide['cats'][$counter]['weight'] = $row['weight'];
		$toSide['cats'][$counter]['ocat'] = $row['ocat'];

		$weight = 0;
		$note = 0;

		//Get All notes for this cat
		$note_cats = $dbmod->getAllNotesCat($row['id']);
		$notecounter = 0;
		while($sndrow = $note_cats->fetch())
		{
			$toSide['cats'][$counter]['notes'][$notecounter]['id'] = $sndrow['id'];
			$toSide['cats'][$counter]['notes'][$notecounter]['weight'] = $sndrow['weight'];
			$toSide['cats'][$counter]['notes'][$notecounter]['upcat'] = $sndrow['upcat'];

			$temp_note = $dbmod->getNoteStudent($toSide['cats'][$counter]['notes'][$notecounter]['id'], $studentid)->fetch();
			$toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] = $temp_note['note'];
			if($toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] != 'NA')
			{
				$weight += $toSide['cats'][$counter]['notes'][$notecounter]['weight'];
				$note += $toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] * $toSide['cats'][$counter]['notes'][$notecounter]['weight'];	
			}			
			$notecounter++;
		}
		if($weight > 0)
		{
			$toSide['cats'][$counter]['note_final'] = round(($note / $weight), 2);			
		}
		else $toSide['cats'][$counter]['note_final'] = 0;
		
		$counter++;
	}

	$weight = 0;
	$note = 0;

	//Notes without down-cat
	$toSide['noten']['mouth']['note'] = 0;
	$toSide['noten']['mouth']['weight'] = 0;
	$toSide['noten']['written']['note'] = 0;
	$toSide['noten']['written']['weight'] = 0;
	$toSide['noten']['final'] = "";
	$noten = $dbmod->getNotes($classid, 'NA');
	$counter = 0;
	while($row = $noten->fetch())
	{
		$toSide['noten'][$counter]['id'] = $row['id'];
		$toSide['noten'][$counter]['weight'] = $row['weight'];
		$toSide['noten'][$counter]['upcat'] = $row['upcat'];
		//Note
		$temp_note = $dbmod->getNoteStudent($toSide['noten'][$counter]['id'], $studentid)->fetch();
		$toSide['noten'][$counter]['note']['note'] = $temp_note['note'];
		
		//Mouth
		if($toSide['noten'][$counter]['upcat'] == 0)
		{
			if($toSide['noten'][$counter]['note']['note'] != "NA")
			{
				$toSide['noten']['mouth']['note'] += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
				$toSide['noten']['mouth']['weight'] += $toSide['noten'][$counter]['weight'];
			}			
		}
		//Written
		if($toSide['noten'][$counter]['upcat'] == 1)
		{
			if($toSide['noten'][$counter]['note']['note'] != "NA")
			{	
				$toSide['noten']['written']['note'] += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
				$toSide['noten']['written']['weight'] += $toSide['noten'][$counter]['weight'];
			}			
		}		

		$note += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
		$weight += $toSide['noten'][$counter]['weight'];
		$counter++;
	}

	for($i = 0; $i < sizeof($toSide['cats']); $i++)
	{
		if($toSide['cats'][$i]['ocat'] == 0)
		{
			$toSide['noten']['mouth']['note'] += $toSide['cats'][$i]['note_final'] * $toSide['cats'][$i]['weight'];
			$toSide['noten']['mouth']['weight'] += $toSide['cats'][$i]['weight'];
		}
		if($toSide['cats'][$i]['ocat'] == 1)
		{
			$toSide['noten']['written']['note'] += $toSide['cats'][$i]['note_final'] * $toSide['cats'][$i]['weight'];
			$toSide['noten']['written']['weight'] += $toSide['cats'][$i]['weight'];
		}
	}

	$toSide['mouth_nf'] = 0;
	$toSide['written_nf'] = 0;

	if($toSide['noten']['mouth']['weight'] != 0)
	{
		$toSide['mouth_nf'] = round(($toSide['noten']['mouth']['note'] / $toSide['noten']['mouth']['weight']), 2);
	}
	if($toSide['noten']['written']['weight'] != 0)
	{
		$toSide['written_nf'] = round(($toSide['noten']['written']['note'] / $toSide['noten']['written']['weight']), 2);	
	}
	//Momently final note
	$toSide['nf'] = round((($toSide['mouth_nf'] * $toSide['w_mouth']) + ($toSide['written_nf'] * $toSide['w_written'])) / ($toSide['w_written'] + $toSide['w_mouth']), 2);
	return $toSide;
}




//Get all Students from one class
if($data->todo == 0)
{	
	$students = $dbmod->getAllStudentsClass($data->classid);
	$counter = 0;
	while($row = $students->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['prename'] = $row['prename'];	
		$toSide[$counter]['img'] = $row['fotolink'];			
		$counter++;
	}
	echo json_encode(array($toSide, $counter));
}
//Save new Student - todo 1
/*

	@param
		name - name
		prename - prename
		classid - classid

*/
elseif($data->todo == 1)
{
	$dbmod->saveNewStudent($data->classid, $data->name, $data->prename);	
}
//Loading all Students for overview
elseif($data->todo == 2)
{
	$students = $dbmod->getAllStudents();
	$counter = 0;
	while($row = $students->fetch())
	{
		$toSide[$counter]['studentsid'] = $row['studentsid'];
		$toSide[$counter]['classid'] = $row['classid'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['prename'] = $row['prename'];
		$toSide[$counter]['classname'] = $row['classname'];		
		$counter++;
	}
	echo json_encode($toSide);
}
//Get single Student
elseif($data->todo == 3)
{
	$student = $dbmod->getSingleStudent($data->studentid)->fetch();
	$toSide['ue']['count'] = 0;
	$toSide['e']['count'] = 0;
	$toSide['m'] = 0;
	$toSide['mm'] = 0;
	$toSide['o'] = 0;
	$toSide['p'] = 0;
	$toSide['pp'] = 0;
	$toSide['time'] = 0;
	$toSide['units'] = "";
	$counter = 0;

	$toSide['id'] = $student['id'];
	$toSide['classid'] = $student['classid'];
	$toSide['img'] = $student['fotolink'];
	$toSide['name'] = $student['name'];
	$toSide['info'] = $student['info'];
	$toSide['prename'] = $student['prename'];
	$toSide['classname'] = $student['classname'];	

	$unitdata = $dbmod->getSingleStudentUD($data->studentid);

	while($row = $unitdata->fetch())
	{
		$toSide['time'] = $toSide['time'] + $row['tolate'];

		//Date and Time
		$start = new DateTime();
		$start->setTimestamp(($row['date_start'] / 1000));
		
		switch($row['attendance']){
			case 0: {
				$toSide['ue']['count']++;
				$toSide['ue'][$counter]['id'] = $row['unitid'];
				$toSide['ue'][$counter]['date_start'] = $start->format("d.m.Y");
				$toSide['ue'][$counter]['title'] = $row['unittitle'];
				$toSide['ue'][$counter]['classdateid'] = $row['classdateid'];
			}
			break;
			case 1: {
				$toSide['e']['count']++;
				$toSide['e'][$counter]['id'] = $row['unitid'];
				$toSide['e'][$counter]['date_start'] = $start->format("d.m.Y");
				$toSide['e'][$counter]['title'] = $row['unittitle'];
				$toSide['e'][$counter]['classdateid'] = $row['classdateid'];
			}
			break;
			case 2: $toSide['mm']++;
			break;
			case 3: $toSide['m']++;
			break;
			case 4: $toSide['o']++;
			break;
			case 5: $toSide['p']++;
			break;
			case 6: $toSide['pp']++;
			break;
		}
		$toSide['units'][$counter]['id'] = $row['unitid'];
		$toSide['units'][$counter]['notice'] = $row['notice'];
		$toSide['units'][$counter]['date_start'] = $start->format("d.m.Y");
		$toSide['units'][$counter]['title'] = $row['unittitle'];
		$counter++;

	}
	echo json_encode($toSide);
}
//Get all Data for a Class
elseif($data->todo == 4)
{
	$students = $dbmod->getAllStudentsClass($data->classid);
	$classdata = $dbmod->getSingleClass($data->classid)->fetch();

	$toSide['w_mouth'] = $classdata['w_mouth'];
	$toSide['w_written'] = $classdata['w_written'];


	$counter = 0;
	$toSide = "";
	while($row = $students->fetch())
	{
		$student = $dbmod->getSingleStudent($row['id'])->fetch();
		$toSide[$counter]['ue']['count'] = 0;
		$toSide[$counter]['e']['count'] = 0;
		$toSide[$counter]['m'] = 0;
		$toSide[$counter]['mm'] = 0;
		$toSide[$counter]['o'] = 0;
		$toSide[$counter]['p'] = 0;
		$toSide[$counter]['pp'] = 0;
		$toSide[$counter]['time'] = 0;
		$toSide[$counter]['units'] = "";

		$toSide[$counter]['id'] = $student['id'];
		$toSide[$counter]['name'] = $student['name'];
		$toSide[$counter]['img'] = $student['fotolink'];
		$toSide[$counter]['prename'] = $student['prename'];

		//Noten
		$toSide[$counter]['noten_final'] = getNoten($dbmod, $data->classid, $student['id']);

		$unitdata = $dbmod->getSingleStudentUD($row['id']);

		while($sndrow = $unitdata->fetch())
		{
			
			$toSide[$counter]['time'] = $toSide[$counter]['time'] + $sndrow['tolate'];

			switch($sndrow['attendance']){
				case 0: {
					$toSide[$counter]['ue']['count']++;
				}
				break;
				case 1: {
					$toSide[$counter]['e']['count']++;
				}
				break;
				case 2: $toSide[$counter]['mm']++;
				break;
				case 3: $toSide[$counter]['m']++;
				break;
				case 4: $toSide[$counter]['o']++;
				break;
				case 5: $toSide[$counter]['p']++;
				break;
				case 6: $toSide[$counter]['pp']++;
				break;
			}
		}	
		$counter++;	
	}
	echo json_encode(array($toSide, $counter));
}
//Update Studentsdata
elseif($data->todo == 5)
{
	$dbmod->updateStudent($data->id, $data->name, $data->prename, $data->foto, $data->info);	
}
//Select and Calculate the Notes
elseif($data->todo == 6)
{
	$classdata = $dbmod->getSingleClass($data->id)->fetch();
	$toSide['id'] = $classdata['id'];
	$toSide['w_mouth'] = $classdata['w_mouth'];
	$toSide['w_written'] = $classdata['w_written'];
	$toSide['name'] = $classdata['name'];
	$toSide['info'] = $classdata['info'];
	$toSide['color'] = $classdata['color'];
	$toSide['unitcount'] = $dbmod->getSingleClassUnitCount($data->id);

	//Get all Cats
	$toSide['cats'] = [];	
	$cats = $dbmod->getAllCats($data->id);
	$counter = 0;
	while($row = $cats->fetch())
	{
		$toSide['cats'][$counter]['id'] = $row['id'];
		$toSide['cats'][$counter]['title'] = $row['title'];
		$toSide['cats'][$counter]['weight'] = $row['weight'];
		$toSide['cats'][$counter]['ocat'] = $row['ocat'];

		$weight = 0;
		$note = 0;

		//Get All notes for this cat
		$note_cats = $dbmod->getAllNotesCat($row['id']);
		$notecounter = 0;
		while($sndrow = $note_cats->fetch())
		{
			$toSide['cats'][$counter]['notes'][$notecounter]['id'] = $sndrow['id'];
			$toSide['cats'][$counter]['notes'][$notecounter]['title'] = $sndrow['title'];
			$toSide['cats'][$counter]['notes'][$notecounter]['weight'] = $sndrow['weight'];
			$toSide['cats'][$counter]['notes'][$notecounter]['upcat'] = $sndrow['upcat'];

			$temp_note = $dbmod->getNoteStudent($toSide['cats'][$counter]['notes'][$notecounter]['id'], $data->studentid)->fetch();
			$toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] = $temp_note['note'];
			$toSide['cats'][$counter]['notes'][$notecounter]['note']['info'] = $temp_note['info'];			
			if($toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] != 'NA')
			{
				$weight += $toSide['cats'][$counter]['notes'][$notecounter]['weight'];
				$note += $toSide['cats'][$counter]['notes'][$notecounter]['note']['note'] * $toSide['cats'][$counter]['notes'][$notecounter]['weight'];	
			}			
			$notecounter++;
		}
		if($weight > 0)
		{
			$toSide['cats'][$counter]['note_final'] = round(($note / $weight), 2);			
		}
		else $toSide['cats'][$counter]['note_final'] = 0;
		
		$counter++;
	}

	$weight = 0;
	$note = 0;

	//Notes without down-cat
	$toSide['noten']['mouth']['note'] = 0;
	$toSide['noten']['mouth']['weight'] = 0;
	$toSide['noten']['written']['note'] = 0;
	$toSide['noten']['written']['weight'] = 0;
	$toSide['noten']['final'] = "";
	$noten = $dbmod->getNotes($data->id, 'NA');
	$counter = 0;
	while($row = $noten->fetch())
	{
		$toSide['noten'][$counter]['id'] = $row['id'];
		$toSide['noten'][$counter]['title'] = $row['title'];
		$toSide['noten'][$counter]['weight'] = $row['weight'];
		$toSide['noten'][$counter]['upcat'] = $row['upcat'];
		//Note
		$temp_note = $dbmod->getNoteStudent($toSide['noten'][$counter]['id'], $data->studentid)->fetch();
		$toSide['noten'][$counter]['note']['note'] = $temp_note['note'];
		$toSide['noten'][$counter]['note']['info'] = $temp_note['info'];

		//Mouth
		if($toSide['noten'][$counter]['upcat'] == 0)
		{
			if($toSide['noten'][$counter]['note']['note'] != "NA")
			{
				$toSide['noten']['mouth']['note'] += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
				$toSide['noten']['mouth']['weight'] += $toSide['noten'][$counter]['weight'];
			}			
		}
		//Written
		if($toSide['noten'][$counter]['upcat'] == 1)
		{
			if($toSide['noten'][$counter]['note']['note'] != "NA")
			{
				$toSide['noten']['written']['note'] += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
				$toSide['noten']['written']['weight'] += $toSide['noten'][$counter]['weight'];
			}			
		}
		

		$note += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
		$weight += $toSide['noten'][$counter]['weight'];
		$counter++;
	}

	for($i = 0; $i < sizeof($toSide['cats']); $i++)
	{
		if($toSide['cats'][$i]['ocat'] == 0)
		{
			$toSide['noten']['mouth']['note'] += $toSide['cats'][$i]['note_final'] * $toSide['cats'][$i]['weight'];
			$toSide['noten']['mouth']['weight'] += $toSide['cats'][$i]['weight'];
		}
		if($toSide['cats'][$i]['ocat'] == 1)
		{
			$toSide['noten']['written']['note'] += $toSide['cats'][$i]['note_final'] * $toSide['cats'][$i]['weight'];
			$toSide['noten']['written']['weight'] += $toSide['cats'][$i]['weight'];
		}
	}

	$toSide['mouth_nf'] = 0;
	$toSide['written_nf'] = 0;

	if($toSide['noten']['mouth']['weight'] != 0)
	{
		$toSide['mouth_nf'] = round(($toSide['noten']['mouth']['note'] / $toSide['noten']['mouth']['weight']), 2);
	}
	if($toSide['noten']['written']['weight'] != 0)
	{
		$toSide['written_nf'] = round(($toSide['noten']['written']['note'] / $toSide['noten']['written']['weight']), 2);	
	}

	
	//Momently final note
	$toSide['nf'] = round((($toSide['mouth_nf'] * $toSide['w_mouth']) + ($toSide['written_nf'] * $toSide['w_written'])) / ($toSide['w_written'] + $toSide['w_mouth']), 2);

	//$toSide['noten']['note_final'] = round(($note / $weight), 2);

	echo json_encode($toSide);
}
//Delete a Student
elseif($data->todo == 7)
{
	$dbmod->deleteStudent($data->studentid);
}
?>