<?php
$request_data = json_decode(file_get_contents('php://input'), true);

include 'db_con.php';

$query_empty = true;
$sql_query = "SELECT TABLE0.poke_id AS id FROM ";

$count = 0;
foreach ($request_data['selected_moves'] as $value) {
	if (!$query_empty) {
		$sql_query = $sql_query . ' JOIN ';
	}
	$sql_query = $sql_query . '(SELECT * FROM LEARN_SET WHERE move_id=' . $value . ') AS TABLE' . $count;
	if (!$query_empty) {
		$sql_query = $sql_query . ' ON TABLE' . ($count - 1) . '.poke_id=TABLE' . $count . '.poke_id';
	}
	$query_empty = false;
	$count += 1;
}

$sql_query = 'SELECT * FROM poke_basic WHERE id IN (' . $sql_query . ')';

$define_poke_type = $request_data['define_poke_type'];
$selected_poke_type1 = $request_data['selected_poke_type1'];
$selected_poke_type2 = $request_data['selected_poke_type2'];
if ($define_poke_type) {
	switch ($selected_poke_type2) {
	case -1:
		$sql_query = $sql_query . ' AND type1=' . $selected_poke_type1 . ' AND type2=0';
		break;
	case 0:
		$sql_query = $sql_query . ' AND (type1=' . $selected_poke_type1 . ' OR type2=' . $selected_poke_type1 . ')';
		break;
	default:
		$sql_query = $sql_query . ' AND ((type1=' . $selected_poke_type1 . ' AND type2=' . $selected_poke_type2 . ') OR (type1=' . $selected_poke_type2 . ' AND type2=' . $selected_poke_type1 . '))';
		break;
	}
}

$define_poke_ability = $request_data['define_poke_ability'];
$selected_poke_ability = $request_data['selected_poke_ability'];
if ($define_poke_ability && $selected_poke_ability > 0) {
	$sql_query .= ' AND ' . $selected_poke_ability . ' IN (ability1, ability2, ability3)';
}

$sql_query = $sql_query . ' ORDER BY id+0';
if ($sql_result = mysqli_query($con, $sql_query)) {
	$result = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
	echo json_encode($result);
	mysqli_free_result($sql_result);
} else {
	error_log(mysqli_error($con) . '  Query:' . $sql_query);
}

mysqli_close($con);
?>