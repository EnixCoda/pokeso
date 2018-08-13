<?php
$db_name = "localhost";
$user = "root";
$psw = "0303";
$db_table = "pokedb";
/*
$db_name = SAE_MYSQL_HOST_M;
$user = SAE_MYSQL_USER;
$psw =SAE_MYSQL_PASS;
$db_table = SAE_MYSQL_DB;
 */

$con = mysqli_connect($db_name, $user, $psw, $db_table);

if (mysqli_connect_errno($con)) {
	error_log("Failed to connect to MySQL: " . mysqli_connect_error());
	exit();
}

?>