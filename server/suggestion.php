<?php
	$request_data=json_decode(file_get_contents('php://input'),true);

	//Connect DB
	include 'db_con.php';
	$title=$request_data['title'];
	$content=$request_data['content'];
	$sql_query='INSERT INTO sug VALUES (\''.$title.'\',\''.$content.'\')';
	$result=mysqli_query($con,$sql_query);
	mysqli_close($con);
?>