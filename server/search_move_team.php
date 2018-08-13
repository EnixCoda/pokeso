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
		$sql_query = $sql_query.' TYPE='.$request_data['selected_type_id'].' ';
		$query_empty=false;
	}

	if ($request_data['selected_kind_id']>0) {
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' KIND='.$request_data['selected_kind_id'].' ';
	}

	if ($request_data['is_100percent_kill']) {
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' POWER=-1 ';
	}
	else{
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' POWER>='.$request_data['power_min'].' AND POWER<='.$request_data['power_max'].' ';
	}

	if ($request_data['is_100percent_accurate']) {
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' accuracy=-1 ';
	}
	else{
		add_and($sql_query,$query_empty);
		$sql_query = $sql_query.' accuracy>='.$request_data['accuracy_min'].' AND accuracy<='.$request_data['accuracy_max'].' ';
	}

	add_and($sql_query,$query_empty);
	$sql_query = $sql_query.' pp>='.$request_data['pp_min'].' AND pp<='.$request_data['pp_max'].' ';

	$sql_query='SELECT * FROM ('.$sql_query.') AS m WHERE m.id IN (SELECT move_id FROM learn_set WHERE poke_id='.$request_data['poke_id'].')';

	$sql_result=mysqli_query($con,$sql_query);
	$result=[];
	while ($row = mysqli_fetch_array($sql_result)) {
		array_push($result, $row);
	}

	echo json_encode($result);
	mysqli_close($con);
?>