<?php

	//Connect DB
	include 'db_con.php';

	$pokemon=array();

	//Starts from 0, make pokemon[i].id==id
	$tmp=array();
	$tmp['id']='0';
	$tmp['name']='?';
	array_push($pokemon,$tmp);

	$sql_query='SELECT id,name FROM poke_basic ORDER BY id+0 ASC';
	$sql_result=mysqli_query($con,$sql_query);
	while ($row=mysqli_fetch_array($sql_result)) {
		$tmp=array();
		$tmp['id']=$row['id'];
		$tmp['name']=$row['name'];
		array_push($pokemon,$tmp);
	}
	mysqli_free_result($sql_result);

	echo json_encode($pokemon);
	mysqli_close($con);

?>