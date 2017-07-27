<?php
/*

Manage all Database-Stuff form public and logged

*/
class dbmod
{
	//Get DataCon
	private function getDataConn()
	{
		include("../../../gw-config.php");
		return $db;
	}

	//Get the salt
	private function getSalt()
	{
		include("../../.gw-salt");		
		return $salt;
	}

	//PASSWORD
	public function cryptPass($pass)
	{
		$cryptedPass = "";
		$salt = $this->getSalt();
		$cryptedPass = md5($pass.$salt);
		return $cryptedPass;
	}

	//Download data
	public function downloadData($sql)
	{
		$db = $this->getDataConn();
		$db->query($sql);
	}

	//Checking Login
	public function checkLogin($username, $password)
	{
		$db = $this->getDataConn();
		$sql = ("SELECT username, id FROM users WHERE username ='$username' and password='$password'");
		$result = $db->query($sql);
		return $result;
	}

	//Updating Random-Number in Database
	public function updateLogin($numb, $username)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET tempnumb='$numb' WHERE username = '$username'");
	}

	//Checking Authetifiaton
	public function checkingAuth()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM users";
		$result = $db->query($sql);
		return $result;
	}

	//Unlogg a User
	public function unlogUser($username)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET tempnumb=NULL WHERE username = '$username'";
		$db->query($sql);
	}

	//Update synctime for Single-User
	public function updateSyncTime($time)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctime='$time' WHERE id = 1";
		$db->query($sql);
	}

	//Delete Sync Data
	public function deleteSyncData()
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctarget = '', synctoken ='', synctime='' WHERE id = 1";
		$db->query($sql);
	}

	//Getting all Events
	public function getEvents()
	{
		
		$db = $this->getDataConn();
		$sql = "
			SELECT * FROM dates 
			";
		$result = $db->query($sql);
		return $result;
	}

	//Get Cats complete
	public function getCatsComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM cats";
		$result = $db->query($sql);
		return $result;
	}

	//FUNCTIONS DATE
	//Saving some data
	/*
	@param
		title
		short_info
		info
		start
		end		
		color
		type (0 - normale Date - 1 ClassDate with ClassID)
	*/
	public function saveNewDate($title, $short_info, $info, $start, $end, $color)
	{		
		$db = $this->getDataConn();
		$sql = "INSERT INTO dates (title, d_short, d_long, d_start, d_end, color) VALUES ('$title', '$short_info', '$info', '$start', '$end', '$color')";
		$db->query($sql);			
	}

	/*

			USERDATA

	*/
	public function checkExistingUsername($username)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) FROM users WHERE username = '$username'";
		$result = $db->query($sql);				
		return $result->fetch();
	}

	//Update Username and re-build token
	public function updateUsername($username, $old)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET username = '$username' WHERE username = '$old'";
		$db->query($sql);

		$sql = "SELECT username, tempnumb FROM users WHERE username = '$username'";
		$result = $db->query($sql);
		return $result->fetch();
	}

	//Update Password
	public function updatePassword($password)
	{
		$db = $this->getDataConn();
		$password = $this->cryptPass($password);
		$sql = "UPDATE users SET password = '$password' WHERE id = 1";
		$db->query($sql);
	}

	//Get Password
	public function getPass()
	{
		$db = $this->getDataConn();
		$sql = "SELECT password FROM users WHERE id = 1";
		$result = $db->query($sql);
		return $result->fetch()[0];
	}

	//Return on single data by ID	
	public function getSingleDate($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM dates WHERE id = '$id'";
		$result = $db->query($sql);				
		return $result->fetch();
	}

	//Delete single Date
	public function deleteDate($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM dates WHERE id = '$id'";
		$db->query($sql);				
	}

	//Update existing date
	public function UpdateDate($id, $title, $short_info, $info, $start, $end, $color)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE dates SET title = '$title', d_short = '$short_info', d_long = '$info', d_start = '$start', d_end = '$end', color = '$color' WHERE id = '$id'";
		$db->query($sql);	
	}

	/*
		CLASS AREA
	*/
	//Save new Class
	public function saveNewClass($name, $info, $color, $system, $syid)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO classes (name, info, color, system, w_mouth, w_written, schoolyear) VALUES ('$name', '$info', '$color', '$system', '50', '50', '$syid')";
		$db->query($sql);		
	}

	//Get all Classes
	public function getAllClasses($syid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classes WHERE schoolyear = '$syid' order by name ASC";		
		return $db->query($sql);				
	}

	public function getAllClassesSingle()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classes order by name ASC";		
		return $db->query($sql);
	}

	//Get all Classdates
	public function getAllClassDates()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classdates";		
		return $db->query($sql);	
	}

	//Delete a Class
	//Delete Class from dates (classes_id) and from classes
	public function delClass($id)
	{
		$db = $this->getDataConn();
		$sql = "
				DELETE FROM classdates WHERE classes_id = '$id';
				DELETE FROM students WHERE classes_id = '$id';
				DELETE FROM unitdata WHERE classes_id = '$id';
				DELETE FROM stunote WHERE classes_id = '$id';
				DELETE FROM note WHERE classes_id = '$id';
				DELETE FROM cats WHERE classes_id = '$id';
				DELETE FROM classes WHERE id = '$id'
			";
		$db->query($sql);
	}

	//Updtae Class Data
	public function updateClass($id, $name, $info, $color)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classes SET name = '$name', info = '$info', color = '$color' WHERE id = '$id'";
		$db->query($sql);
	}

	//get Single Class
	public function getSingleClass($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classes WHERE id = '$id'";		
		return $db->query($sql);
	}

	//Get UnitCount
	public function getSingleClassUnitCount($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) AS unitscount FROM classdates WHERE classes_id = '$id'";		
		return $db->query($sql)->fetch()['unitscount'];
	}

	//Units
	public function saveNewUnit($classid, $start, $end, $title)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO classdates (classes_id, title, c_start, c_end) VALUES ('$classid', '$title', '$start', '$end')";
		$db->query($sql);
	}

	//Get all Units for one class
	public function getAllClassUnits($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classdates WHERE classes_id = '$id' ORDER BY c_start ASC";		
		return $db->query($sql);
	}

	//Get all Units
	public function getUnits()
	{
		$db = $this->getDataConn();
		$sql = "SELECT classdates.id, classdates.title, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end, classes.color as color, classes.name as classname FROM classdates JOIN classes ON classdates.classes_id = classes.id JOIN schoolyear ON schoolyear.id = classes.schoolyear WHERE schoolyear.status = 1";
		$result = $db->query($sql);
		return $result;
	}

	//Get Pre-Unit
	public function getPreUnit($classid, $unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id FROM classdates WHERE c_end < (SELECT c_end FROM classdates WHERE id ='$unitid' AND classes_id = '$classid') AND classes_id = '$classid' ORDER BY c_end DESC LIMIT 1";

		return $db->query($sql);
	}

	//Get Single Classdates-Data
	public function getSingelClassDate($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classdates WHERE id = '$id'";
		return $db->query($sql)->fetch();
	}

	//Get complete StuNote
	public function getAllStuNoteComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote";		
		return $db->query($sql);
	}

	//Get all Unitdata COmplete
	//Get all Units for one class
	public function getAllUnitDataComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM unitdata";		
		return $db->query($sql);
	}

	//Get all Note
	public function getAllNoteComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note";		
		return $db->query($sql);
	}


	//Delete a Unit
	public function delUnit($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM unitdata WHERE classdates_id = '$id'; DELETE FROM classdates WHERE id = '$id'";
		$db->query($sql);
	}

	//Update a Unit
	public function updateUnit($id, $title, $short_info, $info)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classdates SET title = '$title', c_short = '$short_info', c_long = '$info' WHERE id = '$id'";
		$db->query($sql);
	}

	//get a single unit with Classinfo for Modal-Window and link to Classplan
	public function getUnitWithClass($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT classes.id as classid, classdates.id, classdates.title, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end, classes.name as classname, classes.system FROM classdates JOIN classes ON classdates.classes_id = classes.id WHERE classdates.id = '$id'";
		$result = $db->query($sql);
		return $result;
	}

	//Updae a time of a unit
	public function updateUnitTime($id, $start, $end)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classdates SET c_start = '$start', c_end = '$end' WHERE id = '$id'";
		$db->query($sql);
	}

	/*

		STUDENTS

	*/
	//Save new Student
	public function saveNewStudent($classid, $name, $prename)	
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO students (classes_id, name, prename) VALUES ('$classid', '$name', '$prename')";
		$db->query($sql);
	}

	//Save new Student
	public function saveNewStudentCopy($classid, $name, $prename, $info, $fotolink)	
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO students (classes_id, name, prename, info, fotolink) VALUES ('$classid', '$name', '$prename', '$info', '$fotolink')";
		$db->query($sql);
	}

	//Get all Students from one Class
	public function getAllStudentsClass($classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, name, prename, info, fotolink FROM students WHERE classes_id = '$classid' ORDER BY name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Get all Students from one class random
	public function getAllStudentsClassRandom($classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, name, prename, info, fotolink FROM students WHERE classes_id = '$classid' ORDER BY RAND()";
		$result = $db->query($sql);
		return $result;	
	}

	//Check if a student has a data-set for a unit
	public function checkForUnitStuData($unitid, $studentid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) AS unitsstu FROM unitdata WHERE classdates_id = '$unitid' AND students_id = '$studentid'";		
		return $db->query($sql)->fetch()['unitsstu'];
	}

	//Create inital Dataset
	public function newUnitStuData($unitid, $studentid, $attendance, $classid)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO unitdata (classdates_id, students_id, attendance, classes_id, note) VALUES ('$unitid', '$studentid', '$attendance', '$classid', 'NA')";
		$db->query($sql);
	}

	//Getting SUM UE
	public function getUnitSumUE($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(attendance) FROM unitdata WHERE classdates_id = '$unitid' AND attendance = '0' ";
		return $db->query($sql)->fetch()[0];
	}

	//Getting SUM SE
	public function getUnitSumSE($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(attendance) FROM unitdata WHERE classdates_id = '$unitid' AND attendance = '7' ";
		return $db->query($sql)->fetch()[0];
	}

	//Getting SUM E	
	public function getUnitSumE($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(attendance) FROM unitdata WHERE classdates_id = '$unitid' AND attendance = '1' ";
		return $db->query($sql)->fetch()[0];
	}

	//Get a Unit
	public function getUnit($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
		unitdata.id, students.id, students.fotolink, students.name, students.prename, unitdata.classdates_id, unitdata.students_id, unitdata.attendance, unitdata.tolate, unitdata.notice, unitdata.note  
		FROM unitdata JOIN students ON unitdata.students_id = students.id WHERE classdates_id = '$unitid' ORDER BY students.name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Updtae UnitAttendance
	public function upAtt($unitid, $studentid, $attendance)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET attendance = '$attendance' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Updtae the Time
	public function upTime($unitid, $studentid, $time)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET tolate = '$time' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Update Unit-Note
	public function upUnitNote($unitid, $studentid, $note)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET note = '$note' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Update Notice
	public function upNotice($unitid, $studentid, $notice)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET notice = '$notice' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Get all Students in Database
	public function getAllStudents()
	{
		$db = $this->getDataConn();
		$sql = "SELECT students.id as studentsid, classes.id as classid, students.name, students.prename, classes.name as classname FROM students JOIN classes ON students.classes_id = classes.id JOIN schoolyear ON classes.schoolyear = schoolyear.id WHERE schoolyear.status = 1 ORDER BY students.name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Get all Students in Database COMPLETE
	public function getAllStudentsComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM students";
		$result = $db->query($sql);
		return $result;
	}

	//Get single Student with Data from all Units
	public function getSingleStudent($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
			students.id, students.name, students.prename, students.fotolink, students.info,
			classes.name as classname, classes.id as classid
			FROM students 
			JOIN classes ON students.classes_id = classes.id 
			WHERE students.id = '$id'
			ORDER BY students.name ASC
			";
		$result = $db->query($sql);
		return $result;
	}

	//Get single Student with Data from all Units 
	public function getSingleStudentUD($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
			students.id, students.name, students.prename, students.fotolink, students.info,
			classes.name as classname, classes.id as classid, 
			unitdata.id as unitid, unitdata.attendance, unitdata.tolate, unitdata.notice,
            classdates.c_start as date_start, classdates.c_end as date_end, classdates.title as unittitle, unitdata.classdates_id as classdateid, unitdata.note
			FROM students 
			JOIN classes ON students.classes_id = classes.id 
			JOIN unitdata ON unitdata.students_id = students.id
			JOIN classdates ON classdates.id = unitdata.classdates_id
			WHERE students.id = '$id'
			ORDER BY classdates.c_start ASC
			";
		$result = $db->query($sql);
		return $result;
	}

	//Update a Student
	public function updateStudent($id, $name, $prename, $info)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE students SET name = '$name', prename = '$prename', info = '$info' WHERE id = '$id'";
		$db->query($sql);
	}

	//Update Student IMG-Link
	public function updateStudentImg($id, $imgpath)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE students SET fotolink = '$imgpath' WHERE id = '$id'";
		$db->query($sql);
	}

	//Delete a Student-IMG
	public function deleteStudentImg($id)
	{
		$db = $this->getDataConn();
		//Get img-path from database
		$sql = "SELECT fotolink FROM students WHERE id = '$id'";
		//Delete img-file
		$filename = $db->query($sql)->fetch()[0];
		unlink("../../../stuimg/".$filename);	
		//Update database
		$sql = "UPDATE students SET fotolink = '' WHERE id = '$id'";
		$db->query($sql);
	}

	//Get all Student-Images
	public function getAllImgLinks()
	{
		$db = $this->getDataConn();
		//Get img-path from database
		$sql = "SELECT fotolink FROM students";
		//Delete img-file
		$result = $db->query($sql);
		return $result;
	}

	/*

		HOLIDAYS

	*/
	public function saveNewHolidays($title, $start, $end)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO holidays (title, h_start, h_end) VALUES ('$title', '$start', '$end')";
		$db->query($sql);
	}

	
	//get all Holidays
	public function getHolidays()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM holidays ORDER BY h_start ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Delete a Holiday
	public function deleteHoliday($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM holidays WHERE id = '$id'";
		$db->query($sql);
	}

	//Truncate Holidays
	public function deleteAllHolidays()
	{
		$db = $this->getDataConn();
		$sql = "TRUNCATE holidays";
		$db->query($sql);
	}


	/*

		SYNC

	*/
	public function updateSyncData($username, $token, $target)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctarget = '$target', synctoken = '$token' WHERE username = '$username'";
		$db->query($sql);
	}

	//Get Token
	public function getToken($username)
	{
		$db = $this->getDataConn();
		$sql = "SELECT synctoken FROM users WHERE username = '$username'";
		$result = $db->query($sql);
		return $result->fetch();
	}

	/*
		NOTES

	*/
	public function updateWeight($classid, $weight, $kind)
	{
		$db = $this->getDataConn();
		if($kind == 0)	$sql = "UPDATE classes SET w_mouth = '$weight' WHERE id = '$classid'";
		if($kind == 1)	$sql = "UPDATE classes SET w_written = '$weight' WHERE id = '$classid'";
		$db->query($sql);
	}	

	//New Cat
	public function newCat($classid, $kind)
	{
		$db = $this->getDataConn();
		if($kind == 0)	$sql = "INSERT INTO cats (title, classes_id, weight, ocat) VALUES ('Neue Kategorie', '$classid', '100', 0)";
		if($kind == 1)	$sql = "INSERT INTO cats (title, classes_id, weight, ocat) VALUES ('Neue Kategorie', '$classid', '100', 1)";
		$db->query($sql);
	}

	//Get all Cats of one Class
	public function getAllCats($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM cats WHERE classes_id = '$id' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Name
	public function updateCatName($cat, $name)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE cats SET title = '$name' WHERE id = '$cat'";
		$db->query($sql);
	}


	//Weight
	public function updateCatWeight($cat, $weight)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE cats SET weight = '$weight' WHERE id = '$cat'";
		$db->query($sql);
	}

	//Delete a Cat
	public function deleteCat($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM note WHERE cats_id = '$id'; DELETE FROM cats WHERE id = '$id'";
		$db->query($sql);
	}

	//New Note
	public function newNote($classid, $kind)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO note (classes_id, upcat, title, weight, cats_id) VALUES ('$classid', '$kind', 'Neue Note', '100', 'NA')";
		$db->query($sql);
	}

	public function newNoteCat($classid, $kind, $catid)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO note (classes_id, upcat, title, weight, cats_id) VALUES ('$classid', '$kind', 'Neue Note', '100', '$catid')";
		$db->query($sql);
	}

	//Get Noten
	public function getNotes($classid, $cats)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note WHERE classes_id = '$classid' and cats_id = '$cats' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Del Note
	public function deleteNote($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM stunote WHERE note_id = '$id'; DELETE FROM note WHERE id = '$id'";
		$db->query($sql);
	}

	//Updtae Notename
	public function updateNotenName($note, $name)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE note SET title = '$name' WHERE id = '$note'";
		$db->query($sql);
	}

	//Update Notenweight
	public function updateNotenWeight($id, $weight)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE note SET weight = '$weight' WHERE id = '$id'";
		$db->query($sql);
	}

	//Get all notes by Categorie
	public function getAllNotesCat($catid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note WHERE cats_id = '$catid' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Get Data for ClassNote-View
	public function getClassNoteData($classid, $notenid)
	{
		$db = $this->getDataConn();
		$sql = 
		"
			SELECT classes.name as classname, note.title as title, classes.system FROM classes
			JOIN note 
			ON note.classes_id = classes.id
			WHERE note.classes_id = '$classid'
			AND note.id = '$notenid'
		";
		$result = $db->query($sql);
		return $result;
	}

	//Check if note exist

	public function getNote($studentid, $notenid, $classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote WHERE note_id = '$notenid' and students_id = '$studentid' AND classes_id = '$classid'";
		return $result = $db->query($sql);
	}

	//Create new Note
	public function newStuNote($studentid, $notenid, $classid, $numb, $info)
	{
		$db = $this->getDataConn();
		$sql = "
			INSERT INTO stunote (classes_id, note_id, students_id, note, info) 
			VALUES ('$classid', '$notenid', '$studentid', '$numb', '$info')";
		$db->query($sql);
	}

	//Update Note
	public function updateStuNote($notenid, $studentid, $note)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE stunote SET note = '$note' WHERE note_id = '$notenid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Update Notice
	public function updateStuNoteNotice($notenid, $studentid, $notice)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE stunote SET info = '$notice' WHERE note_id = '$notenid' and students_id = '$studentid'";
		$db->query($sql);
	}
	
	//Average
	public function getAllNotenAv($notenid)
	{		
		$db = $this->getDataConn();
		$sql = "SELECT AVG(note) FROM stunote WHERE note_id = '$notenid' and note != 'NA'";
		return $result = round($db->query($sql)->fetch()[0], 2);
		
	}

	//Get Note from a Student
	public function getNoteStudent($note, $studentid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote WHERE note_id = '$note' and students_id = '$studentid'";
		return $result = $db->query($sql);
	}

	//Dekete a Student
	public function deleteStudent($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM unitdata WHERE students_id = '$id'; DELETE FROM stunote WHERE students_id = '$id'; DELETE FROM students WHERE id = '$id'";
		$db->query($sql);
	}

	//Get all notes of one category
	public function getNotesOfCat($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT note.id FROM note WHERE note.cats_id = '$id'";
		return $result = $db->query($sql);
	}



	//Get max id of classes
	public function getMaxClassID()
	{
		$db = $this->getDataConn();
		$sql = "SELECT MAX(id) FROM classes";
		return $result = $db->query($sql);
	}


	//Get Token
	public function getSyncToken()
	{
		$db = $this->getDataConn();
		$sql = "SELECT synctoken FROM users";
		return $result = $db->query($sql)->fetch();
	}

	//SCHOOLEYEAR
	public function checkForSchoolyear()
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(id) FROM schoolyear";
		return $result = $db->query($sql)->fetch();
	}
	//Save new Schoolyear
	//Always active!
	public function saveNewSy($sy_desc)
	{
		$db = $this->getDataConn();
		//Set all other Schoolyears to status = 0
		$db->query("UPDATE schoolyear SET status = 0 WHERE status = 1");

		//Save new Schoolyear
		$sql = "INSERT INTO schoolyear (name, status) 
				VALUES ('$sy_desc', 1)";
		$db->query($sql);	


	}

	//Getting all Schoolyears
	public function getAllSy()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM schoolyear ORDER BY name ASC";
		return $result = $db->query($sql);
	}

	//Getting all Schoolyears without active one
	public function getAllSyWA()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM schoolyear WHERE status = 0 ORDER BY name ASC";
		return $result = $db->query($sql);
	}

	//Return active Schoolyear
	public function getActiveSY()
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, name FROM schoolyear WHERE status = 1";
		return $result = $db->query($sql)->fetch();		
	}

	//Update Schoolyear
	public function updateSY($id, $sy_desc)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE schoolyear SET name = '$sy_desc' WHERE id = '$id'");
	}

	//Activate Schoolyear
	public function activateSY($id)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE schoolyear SET status = 0 WHERE status = 1");
		$db->query("UPDATE schoolyear SET status = 1 WHERE id = '$id'");
	}

	//Returns a Schoolyear
	public function getSY($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, name FROM schoolyear WHERE id = '$id'";
		return $result = $db->query($sql)->fetch();	
	}

	//Delete a Schoolyear
	public function deleteSY($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM schoolyear WHERE id = '$id'";
		$db->query($sql);	
	}	

	//Get Schoolyears complete (FOR SYNC)
	public function getSYComplete()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM schoolyear";
		$result = $db->query($sql);
		return $result;
	}

	//Update Database
	public function updateDB($sql)
	{
		//Create MYSQLI-COnnection with Extra-Include
		include("../../../gw-config.php");
		$conn = new mysqli($host, $db_user, $db_pass, $db_name);
		$conn->multi_query($sql);
	}

	//Get Version
	public function getVer()
	{
		$db = $this->getDataConn();
		$sql = "SELECT version FROM users WHERE id = 1";
		return $result = $db->query($sql)->fetch()['version'];	
	}

	//Update Version
	public function updateVer($ver)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET version = '$ver' WHERE id = 1");
	}

	//Change Show Attendence
	public function changeShowAtt($new_stat)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET show_attendence = '$new_stat'");	
	}

	//Change Show MySQLSync
	public function changeShowMySQL($new_stat)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET show_mysqlsync = '$new_stat'");	
	}

	//Change Show FastBackup
	public function changeShowFastBackup($new_stat)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET show_fastbackup = '$new_stat'");	
	}

	//Change Show FastBackup
	public function changeShowUnitNote($new_stat)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET show_unitnote = '$new_stat'");	
	}

	//BACKUP-INFORMATIONS
	public function saveBackupPass($dirpass1)
	{
		$db = $this->getDataConn();
		$dirpass1 = $this->cryptPass($dirpass1);
		$sql = "UPDATE users SET backup_pass = '$dirpass1'";
		$db->query($sql);
	}

	//Load a Backup-.String and Decrypt it
	public function uploadBackup($backupstring, $password)
	{
		$string = $backupstring;
		
		$salt = $this->getSalt();
		$key = md5($password.$salt);
		
		$res = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($string), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));

		
		$check = false;
		//Check for correct Decryption (First 8 Letters always same)
		if(substr($res,0,8) == "#GRADELI")
		{
			$check = true;
			$db = $this->getDataConn();
			$db->query($res);
			$check = true;
		}
		return $check;
	}

	//Save Backuppath
	public function saveBackupPath($path)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET backup_path = '$path'");	
	}

	//Save Backuppath
	public function getBackupPath()
	{
		$db = $this->getDataConn();
		return $db->query("SELECT backup_path FROM users")->fetch();	
	}

	//Rremove Backuppath
	public function removeBackupPath()
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET backup_path = ''");	
	}

	//Update CalDav-Data - CRYPTED
	public function updateCalDavData($link, $calname, $user, $pass)
	{
		$key = substr($this->getSalt(), 0, 16);
		$link = trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $link, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
		$calname = trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $calname, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
		$user = trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $user, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
		$pass = trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $pass, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
		$db = $this->getDataConn();
		$sql = "UPDATE users SET caldav_link = '$link', caldav_cal = '$calname', caldav_user = '$user', caldav_pass = '$pass'";
		$db->query($sql);
	}

	//Retrun CalDav-Data ENCRYPTED
	public function getCalDavData()
	{
		$db = $this->getDataConn();
		$sql = "SELECT caldav_link, caldav_cal, caldav_user, caldav_pass FROM users";
		$result = $db->query($sql)->fetch();
		$key = substr($this->getSalt(), 0, 16);
		$result['caldav_link'] = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($result['caldav_link']), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
		$result['caldav_cal'] = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($result['caldav_cal']), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
		$result['caldav_user'] = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($result['caldav_user']), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
		$result['caldav_pass'] = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($result['caldav_pass']), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
		$result[0] ="";
		$result[1] ="";
		$result[2] ="";
		$result[3] ="";
		return $result;		
	}

	//Delete CALDAV-Data
	public function deleteCalDavData()
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET caldav_link = '', caldav_cal = '', caldav_user = '', caldav_pass = ''";
		$db->query($sql);
	}

	//Return Unit Pre-And-For of one Unit
	public function getPreByUnit($id, $classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, c_start, c_end, title FROM classdates WHERE classes_id = '$classid' AND c_start > (SELECT c_start FROM classdates WHERE id = '$id') ORDER BY c_start ASC LIMIT 1";
		return $db->query($sql);
	}

	//Return Unit Pre-And-For of one Unit
	public function getForByUnit($id, $classid)
	{
		$db = $this->getDataConn();
		
		$sql = "SELECT id, c_start, c_end, title FROM classdates WHERE classes_id = '$classid' AND c_start < (SELECT c_start FROM classdates WHERE id = '$id') ORDER BY c_start DESC LIMIT 1";
		return $db->query($sql);
	}

	//Delete Dates Until a specific Time
	public function deleteDateUntil($time)
	{
		$db = $this->getDataConn();
		$sql = $db->prepare("DELETE FROM dates WHERE d_start <= '$time'");
		$sql->execute();
		//$db->query($sql);
		//Return Deleted Dates
		return $sql->rowCount();
	}

	//Get ALl classdates for active schoolyear
	public function getClassDatesForActSchoolyear()
	{
		$db = $this->getDataConn();
		
		$sql = "select classdates.id, classdates.title, classes.name, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end from classdates join classes on classdates.classes_id = classes.id join schoolyear on schoolyear.id = classes.schoolyear where schoolyear.status = '1'";
		return $db->query($sql);	
	}

	//Get Single normal Event
	public function getEventById($id)
	{
		$db = $this->getDataConn();
		$sql = "
			SELECT * FROM dates WHERE id = '$id' 
			";
		$result = $db->query($sql);
		return $result;
	}
	//Get single holidys
	public function getHolidaysById($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM holidays WHERE id = '$id'";
		$result = $db->query($sql);
		return $result;
	}

	//get single classdate
	public function getClassDatesById($id)
	{
		$db = $this->getDataConn();
		
		$sql = "select classdates.id, classdates.title, classes.name, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end from classdates join classes on classdates.classes_id = classes.id where classdates.id = '$id'";
		return $db->query($sql);	
	}

	//Update Google Calendar-Data
	public function updateGoogleData($clientid, $calid, $username)
	{
		$db = $this->getDataConn();
		
		$db->query("UPDATE users SET google_calendarid='$calid', google_clientid = '$clientid' WHERE username = '$username'");
	}

	//Delete Google Calendar-Data
	public function deleteGoogleData($username)
	{
		$db = $this->getDataConn();		
		$db->query("UPDATE users SET google_calendarid='', google_clientid = '' WHERE username = '$username'");
	}

	


}
?>