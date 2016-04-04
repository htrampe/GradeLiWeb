<?php 

//CREDENTIALS FOR DATABSE
$host = "HOST";
$db_user ="USER";
$db_pass = "PASS";
$db_name = "DATABASE";

//CREDENTIALS FOR DATABSE DELETE FOR COMMIT
$host = "localhost";
$db_user ="root";
$db_pass = "zero543";
$db_name = "gradeliweb_dev";

$db = new PDO("mysql:host=".$host.";dbname=".$db_name.';charset=utf8', $db_user, $db_pass);
?>