<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];


//Update MouthWeight
if($data->todo == 0)
{	
	$dbmod->updateWeight($data->classid, $data->weight, 0);	
}
//Update MouthWeight
elseif($data->todo == 1)
{	
	$dbmod->updateWeight($data->classid, $data->weight, 1);	
}
//New Categorie - MOUTH
elseif($data->todo == 2)
{	
	$dbmod->newCat($data->classid, 0);	
}
//New Categorie - WRITTEN
elseif($data->todo == 3)
{	
	$dbmod->newCat($data->classid, 1);	
}
//Update Cat-Name
//Update Name
elseif($data->todo == 4)
{
	$dbmod->updateCatName($data->cat, $data->name);	
}
elseif($data->todo == 5)
{
	$dbmod->updateCatWeight($data->cat, $data->weight);	
}
//Delete a cat
elseif($data->todo == 6)
{
	$dbmod->deleteCat($data->id);		
}
//New Note
elseif($data->todo == 7)
{
	$dbmod->newNote($data->classid, $data->kind);	
}
//Del note
elseif($data->todo == 8)
{
	$dbmod->deleteNote($data->id);		
}
//Change Notenname
elseif($data->todo == 9)
{
	$dbmod->updateNotenName($data->note, $data->name);	
}
//Notenweight
elseif($data->todo == 10)
{
	$dbmod->updateNotenWeight($data->note, $data->weight);
}
//new Note with Cat
elseif($data->todo == 11)
{
	$dbmod->newNoteCat($data->classid, $data->kind, $data->catid);	
}
//Get Classdata and Notedata for NoteSingleView
elseif($data->todo == 12)
{
	$classnotedata = $dbmod->getClassNoteData($data->classid, $data->notenid)->fetch();	

	//Calculate Average of all Notes
	$toSide['average'] = $dbmod->getAllNotenAv($data->notenid);

	$toSide['classname'] = $classnotedata['classname'];
	$toSide['system'] = $classnotedata['system'];
	$toSide['title'] = $classnotedata['title'];
}
//Loading Students
elseif($data->todo == 13)
{
	$students = $dbmod->getAllStudentsClass($data->classid);

	$toSide['system'] = $dbmod->getSingleClass($data->classid)->fetch()['system'];

	//System 0-15
	if($toSide['system'] == 0)
	{
		$toSide['score'] = "";
		$toSide['score']['na'] = 0;
		for($i = 0; $i <= 15; $i++)
		{
			$toSide['score'][$i] = 0;
		}
	}
	//System 0-6
	elseif($toSide['system'] == 1)
	{
		$toSide['score'] = "";
		$toSide['score']['na'] = 0;
		for($i = 0; $i <= 6; $i++)
		{
			$toSide['score'][$i] = 0;
		}
	}

	$counter = 0;
	while($row = $students->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['prename'] = $row['prename'];	
		$toSide[$counter]['img'] = $row['fotolink'];		
		$toSide[$counter]['note'] = false;
		
		//Checking for note - otherwise create a note
		$tempnote = $dbmod->getNote($row['id'], $data->notenid, $data->classid)->fetch();
		if($tempnote != false)
		{
			//Return Note
			$toSide[$counter]['note']['id'] = $tempnote['id'];
			$toSide[$counter]['note']['note'] = $tempnote['note'];
			$toSide[$counter]['note']['info'] = $tempnote['info'];
			//Adding Socre to points
			if($tempnote['note'] != "NA") $toSide['score'][$tempnote['note']]++;
			else $toSide['score']['na']++;
		}
		else
		{
			//New Note in Database and give it back incl. new id!!! - HIGHEST SELECT MAX(ID) FROM tablename
			$dbmod->newStuNote($row['id'], $data->notenid, $data->classid, "NA", "");
			$toSide[$counter]['note']['id'] = $dbmod->getNote($row['id'], $data->notenid, $data->classid)->fetch()['id'];
			$toSide[$counter]['note']['note'] = "NA";
			$toSide['score']['na']++;
			$toSide[$counter]['note']['info'] = "";
		}
		$counter++;
	}
	$toSide['stucounter'] = $counter;
}
//Updtae Note
/*

		note : note
		studentid : studentid,
		notenid : notenid,
		
*/
elseif($data->todo == 14)
{
	$dbmod->updateStuNote($data->notenid, $data->studentid, $data->note);
}
//Update Notice
/*
	notice : $("#notice_" + studentid).val(),
	studentid : studentid,
	notenid : notenid,	

*/
elseif($data->todo == 15)
{
	$dbmod->updateStuNoteNotice($data->notenid, $data->studentid, $data->notice);
}
//Delete all StuNotes of one category
elseif($data->todo == 16)
{
	//Get all StuNotes from this Category
 	$stunotes = $dbmod->getNotesOfCat($data->id);

 	$counter = 0;
 	while($row = $stunotes->fetch())
 	{
 		$toSide[$counter]['id'] = $row['id'];
 		$counter++;
 	}
}
//Delete a stunote by notenid
elseif($data->todo == 17)
{
	$dbmod->deleteNote($data->notenid);		
}
//Loading Notes for new NG-Table
//Loading Students
elseif($data->todo == 18)
{
	$students = $dbmod->getAllStudentsClass($data->classid);
	$counter = 0;
	while($row = $students->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['prename'] = $row['prename'];	
		$toSide[$counter]['img'] = $row['fotolink'];		
		$toSide[$counter]['note'] = false;
		//Checking for note - otherwise create a note
		$tempnote = $dbmod->getNote($row['id'], $data->notenid, $data->classid)->fetch();
		if($tempnote != false)
		{
			//Return Note
			$toSide[$counter]['note']['id'] = $tempnote['id'];
			$toSide[$counter]['note']['note'] = $tempnote['note'];
			$toSide[$counter]['note']['info'] = $tempnote['info'];
		}
		else
		{
			//New Note in Database and give it back incl. new id!!! - HIGHEST SELECT MAX(ID) FROM tablename
			$dbmod->newStuNote($row['id'], $data->notenid, $data->classid, "NA", "");
			$toSide[$counter]['note']['id'] = $dbmod->getNote($row['id'], $data->notenid, $data->classid)->fetch()['id'];
			$toSide[$counter]['note']['note'] = "NA";
			$toSide[$counter]['note']['info'] = "";
		}
		$counter++;
	}
}



echo json_encode($toSide);


?>