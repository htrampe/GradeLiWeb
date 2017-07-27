<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];
//Save new Class - todo == 0
/*
@param 

	data - content:
		name : 	Classname		
		info: 	Info
		color : Class-Color
		todo :	0 --> Type of todo
*/
if($data->todo == 0)
{
	//Save new Class
	$dbmod->saveNewClass($data->name, $data->info, $data->color, $data->system, $data->syid);
}
//Load all Classes
elseif($data->todo == 1)
{
	$classes = $dbmod->getAllClasses($dbmod->getActiveSY()['id']);
	$counter = 0;
	while($row = $classes->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['name'] = $row['name'];
		$toSide[$counter]['info'] = $row['info'];
		$toSide[$counter]['color'] = $row['color'];
		$toSide[$counter]['system'] = $row['system'];
		$counter++;
	}

	echo json_encode($toSide);
}
//Delete a Class
elseif($data->todo == 2)
{
	$dbmod->delClass($data->id);
}
//Update Class-Data
elseif($data->todo == 3)
{
	//Save new Class
	$dbmod->updateClass($data->id, $data->name, $data->info, $data->color);
}
//Copy a Class
elseif($data->todo == 4)
{
	//Get act class
	$class = $dbmod->getSingleClass($data->classid)->fetch();
	$dbmod->saveNewClass(
		$class['name']." (KOPIE)", 
		$class['info'], 
		$class['color'], 
		$class['system'],
		$class['schoolyear']
	);

	//Get Max id of classes - last inserted class
	$new_classid = $dbmod->getMaxClassID()->fetch()[0];
	

	//Get all Students of act class
	$students = $dbmod->getAllStudentsClass($data->classid);

	while($row = $students->fetch())
	{
		$dbmod->saveNewStudentCopy(
			$new_classid, 
			$row['name'], 
			$row['prename'], 
			$row['info'], 
			$row['fotolink']);
	}
}
//Load all Classes for sepcific Schoolyear
elseif($data->todo == 5)
{
	$classes = $dbmod->getAllClasses($data->syid);
	$counter = 0;
	while($row = $classes->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['name'] = $row['name'];
		$counter++;
	}
	echo json_encode($toSide);
}
//Copy a Class into new Schoolyear WITH new name
elseif($data->todo == 6)
{
	$i = 0;
	//while($data->[$i] != 'todo')
	//{
	//	$i++;
		
	//}
	echo json_encode("Auf gehts");
	//Get act class
	/*
	$class = $dbmod->getSingleClass($data->classid)->fetch();
	$dbmod->saveNewClass(
		$data->name,
		$class['info'], 
		$class['color'], 
		$class['system'],
		$data->syid
	);

	//Get Max id of classes - last inserted class
	$new_classid = $dbmod->getMaxClassID()->fetch()[0];	

	//Get all Students of act class
	$students = $dbmod->getAllStudentsClass($data->classid);

	while($row = $students->fetch())
	{
		$dbmod->saveNewStudentCopy(
			$new_classid, 
			$row['name'], 
			$row['prename'], 
			$row['info'], 
			$row['fotolink']);
	}
	*/
}
?>