<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));

$toSide = array();


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
		$toSide['cats'][$counter]['title'] = $row['title'];

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
			$toSide['cats'][$counter]['notes'][$notecounter]['title'] = $sndrow['title'];


			$temp_note = $dbmod->getNoteStudent($toSide['cats'][$counter]['notes'][$notecounter]['id'], $studentid)->fetch();
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
	$noten = $dbmod->getNotes($classid, 'NA');
	$counter = 0;
	while($row = $noten->fetch())
	{
		$toSide['noten'][$counter]['id'] = $row['id'];
		$toSide['noten'][$counter]['weight'] = $row['weight'];
		$toSide['noten'][$counter]['upcat'] = $row['upcat'];
		$toSide['noten'][$counter]['title'] = $row['title'];
		//Note
		$temp_note = $dbmod->getNoteStudent($toSide['noten'][$counter]['id'], $studentid)->fetch();		
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

		if($toSide['noten'][$counter]['note']['note'] != "NA"){
			$note += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
			$weight += $toSide['noten'][$counter]['weight'];			
		}
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
	$toSide['se']['count'] = 0;
	$toSide['e']['count'] = 0;
	$toSide['m'] = 0;
	$toSide['mm'] = 0;
	$toSide['o'] = 0;
	$toSide['p'] = 0;
	$toSide['pp'] = 0;
	$toSide['note'] = 0;
	$toSide['time'] = 0;
	$toSide['units'] = array();
	$counter = 0;

	$toSide['id'] = $student['id'];
	$toSide['classid'] = $student['classid'];
	$toSide['img'] = $student['fotolink'];
	$toSide['name'] = $student['name'];
	$toSide['info'] = $student['info'];
	$toSide['prename'] = $student['prename'];
	$toSide['classname'] = $student['classname'];	

	$unitdata = $dbmod->getSingleStudentUD($data->studentid);

	$notecounter = 0;

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
			case 7: {
				$toSide['se']['count']++;
				$toSide['se'][$counter]['id'] = $row['unitid'];
				$toSide['se'][$counter]['date_start'] = $start->format("d.m.Y");
				$toSide['se'][$counter]['title'] = $row['unittitle'];
				$toSide['se'][$counter]['classdateid'] = $row['classdateid'];
			}
			break;
		}


		//Notecounter and adding Note
		if($row['note'] != 'NA')
		{
			$notecounter++;
			$toSide['note'] = ($toSide['note'] + $row['note']) / $notecounter;
		}


		$toSide['units'][$counter]['id'] = $row['unitid'];
		$toSide['units'][$counter]['notice'] = $row['notice'];
		$toSide['units'][$counter]['date_start'] = $start->format("d.m.Y");
		$toSide['units'][$counter]['title'] = $row['unittitle'];
		$counter++;

	}
	//Add Notecounter
	$toSide['notecounter'] = $notecounter;
	$toSide['note'] = round($toSide['note'], 1);
	$toSide['note'] = str_replace(".", ",", $toSide['note']);
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
	$toSide = array();
	$sum_average = 0;
	while($row = $students->fetch())
	{
		$student = $dbmod->getSingleStudent($row['id'])->fetch();
		$toSide[$counter] = array();
		$toSide[$counter]['ue']['count'] = 0;
		$toSide[$counter]['e']['count'] = 0;
		$toSide[$counter]['se']['count'] = 0;
		$toSide[$counter]['m'] = 0;
		$toSide[$counter]['mm'] = 0;
		$toSide[$counter]['o'] = 0;
		$toSide[$counter]['p'] = 0;
		$toSide[$counter]['pp'] = 0;
		$toSide[$counter]['note'] = 0;
		$toSide[$counter]['time'] = 0;
		$toSide[$counter]['sum_tolate'] = 0;
		$toSide[$counter]['units'] = "";

		$toSide[$counter]['id'] = $student['id'];
		$toSide[$counter]['name'] = $student['name'];
		$toSide[$counter]['img'] = $student['fotolink'];
		$toSide[$counter]['prename'] = $student['prename'];

		$notecounter = 0;
		//Noten
		$toSide[$counter]['noten_final'] = getNoten($dbmod, $data->classid, $student['id']);

		//Average Final-Sum-Note
		$sum_average = $sum_average + $toSide[$counter]['noten_final']['nf'];

		$unitdata = $dbmod->getSingleStudentUD($row['id']);

		while($sndrow = $unitdata->fetch())
		{
			
			$toSide[$counter]['time'] = $toSide[$counter]['time'] + $sndrow['tolate'];
			if($sndrow['tolate'] > 0) $toSide[$counter]['sum_tolate']++;
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
				case 7: {
					$toSide[$counter]['se']['count']++;
				}
				break;
			}
			//Notecounter and adding Note
			if($sndrow['note'] != 'NA')
			{
				$notecounter++;
				$toSide[$counter]['note'] = ($toSide[$counter]['note'] + $sndrow['note']) / $notecounter;
			}

		}	
		$toSide[$counter]['notecounter'] = $notecounter;
		$toSide[$counter]['note'] = round($toSide[$counter]['note'], 1);
		$toSide[$counter]['note'] = str_replace(".", ",", $toSide[$counter]['note']);

		$counter++;	
	}
	$sum_average = 0;
	if($counter > 0){
		$sum_average = round(($sum_average / $counter), 2);	
	}	
	echo json_encode(array($toSide, $counter, $sum_average));
}
//Update Studentsdata
elseif($data->todo == 5)
{
	$dbmod->updateStudent($data->id, $data->name, $data->prename, $data->info);	
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
		
		if($toSide['noten'][$counter]['note']['note'] != "NA"){
			$note += $toSide['noten'][$counter]['note']['note'] * $toSide['noten'][$counter]['weight'];
			$weight += $toSide['noten'][$counter]['weight'];			
		}
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
//Get All Students from one CLass in Random Order
elseif($data->todo == 8)
{	
	$students = $dbmod->getAllStudentsClassRandom($data->classid);
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
//Upload foto-file
elseif($data->todo == 9)
{
	//Update Img-Link
	$dbmod->updateStudentImg($data->id, $data->imgpath);	
}
//Delete Student-IMG and delete link in database
elseif($data->todo == 10)
{
	$dbmod->deleteStudentImg($data->id);
}
//Clear Student-Imgaes
elseif($data->todo == 11)
{
	$deletecounter = 0;
	//Load all images
	$dirdata = scandir("../../../stuimg/"); 

	//Load Database-Imagenames
	$stuimages = $dbmod->getAllImgLinks();
	$fotolinks = array();
	while($row = $stuimages->fetch())
	{
		if($row[0] != NULL || ($row[0] != "" && strlen($row[0] > 0))){
			array_push($fotolinks, $row[0]);
		}		
	}
	for($i = 2; $i < sizeof($dirdata); $i++)
	{
		if($dirdata[$i] != "holder.png")
		{
			$found = false;
			for($k = 0; $k < sizeof($fotolinks); $k++)
			{
				if($fotolinks[$k] == $dirdata[$i]) $found = true;
			}
			//Img found - next img
			if(!$found) 
			{			
				unlink("../../../stuimg/".$dirdata[$i]);
				$deletecounter++;
			}
		}
	}
	$toSide["delcounter"] = $deletecounter;
	echo json_encode($toSide);
}
//Create IMG-Backup
elseif($data->todo == 12)
{
	//Get DB-Backup-Link
	$backuppath = $dbmod->getBackupPath()[0];
	$backuppath = str_replace("GG_SEP_DATA_TEMP", DIRECTORY_SEPARATOR, $backuppath);

	if($backuppath == "") $backuppath = "../../../backup/";

	$zip = new ZipArchive;
    $download = $backuppath.'gradeli_studentimages_backup.zip';
    //Try create new zip-archive - create by default
    try{
    	$zip->open($download, ZipArchive::CREATE);
    }
    catch(IOException $e)
    {
    	$zip->open($download, ZipArchive::OVERWRITE);	
    }

    foreach (glob("../../../stuimg/*.*") as $file) { /* Add appropriate path to read content of zip */
        $zip->addFile($file);
    }
    $zip->close();

    $toSide = [];

    if(file_exists($backuppath.'gradeli_studentimages_backup.zip'))
    {
    	$toSide[0] = true;
    } else $toSide[0] = false;

    echo json_encode($toSide);
}

?>