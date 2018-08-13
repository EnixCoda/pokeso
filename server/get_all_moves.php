<?php
$request_data = json_decode(file_get_contents('php://input'), true);
if ($request_data['range'] != 'all') {
	echo 'invalid request';
	return;
}
//Connect DB
include 'db_con.php';

$sql_query = "SELECT * FROM MOVE";
if ($sql_result = mysqli_query($con, $sql_query)) {
	$result = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
	mysqli_free_result($sql_result);
	echo json_encode($result);
} else {
	error_log(mysqli_error($con) . ' Query:' . $sql_query);
}

mysqli_close($con);
?>