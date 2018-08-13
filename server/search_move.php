<?php
	$request_data=json_decode(file_get_contents('php://input'),true);

	//Connect DB
	include 'db_con.php';

	function add_and(&$query,&$empty){
		if (!$empty) {
			$query = $query.' AND ';
		}
		$empty=false;
	}

	//make query
	$query_empty=true;
	$sql_query="SELECT * FROM MOVE WHERE ";
	if ($request_data['selected_type_id']>0) {
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' TYPE='.$request_data['selected_type_id'].' ';
	}

	if ($request_data['selected_kind_id']>0) {
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' KIND='.$request_data['selected_kind_id'].' ';
	}

	add_and($sql_query,$query_empty);
	if ($request_data['is_100percent_kill']) {
		$sql_query = $sql_query.' POWER=-1 ';
	}
	else{
		$sql_query = $sql_query.' POWER>='.$request_data['power_min'].' AND POWER<='.$request_data['power_max'].' ';
	}

	add_and($sql_query,$query_empty);
	if ($request_data['is_100percent_accurate']) {
		$sql_query = $sql_query.' accuracy=-1 ';
	}
	else{
		$sql_query = $sql_query.' accuracy>='.$request_data['accuracy_min'].' AND accuracy<='.$request_data['accuracy_max'].' ';
	}

	add_and($sql_query,$query_empty);
	$sql_query = $sql_query.' pp>='.$request_data['pp_min'].' AND pp<='.$request_data['pp_max'].' ';
	if ($sql_result=mysqli_query($con,$sql_query)) {
		$result=mysqli_fetch_all($sql_result,MYSQLI_ASSOC);
		mysqli_free_result($sql_result);
		echo json_encode($result);
	}
	else{
		error_log(mysqli_error($con).' Query:'.$sql_query);
	}

	mysqli_close($con);
?>