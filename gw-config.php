<?php 

//CREDENTIALS FOR DATABSE
$host = "HOST";
$db_user ="USER";
$db_pass = "PASS";
$db_name = "DATABASE";

$db = new PDO("mysql:host=".$host.";dbname=".$db_name.';charset=utf8', $db_user, $db_pass);
?>