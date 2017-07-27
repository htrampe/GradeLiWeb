<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));

for($i = 0; $i < sizeof($data); $i++)
{
	$class = $dbmod->getSingleClass($data[$i]->classid)->fetch();
	$dbmod->saveNewClass(
		$data[$i]->name,
		$class['info'], 
		$class['color'], 
		$class['system'],
		$data[$i]->syid
	);

	//Get Max id of classes - last inserted class
	$new_classid = $dbmod->getMaxClassID()->fetch()[0];	

	//Get all Students of act class
	$students = $dbmod->getAllStudentsClass($data[$i]->classid);

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
?>