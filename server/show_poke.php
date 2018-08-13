<?php
$request_data = json_decode(file_get_contents('php://input'), true);

//Connect DB
include 'db_con.php';
include 'get_apng_url.php';

$id = $request_data['id'];

$this_poke = array();
$this_poke['id'] = $id;
$sql_query = 'SELECT id,name,type1,type2 FROM poke_basic WHERE id=' . $id;
if ($sql_result = mysqli_query($con, $sql_query)) {
	$this_poke = mysqli_fetch_all($sql_result, MYSQLI_ASSOC)[0];
	mysqli_free_result($sql_result);
} else {
	error_log(mysqli_error($con) . ' Query:' . $sql_query);
}

$base_stats = array();
$sql_query = 'SELECT * FROM base_stats WHERE id=' . $id;
if ($sql_result = mysqli_query($con, $sql_query)) {
	$row = mysqli_fetch_array($sql_result);
	$list_abbrev = array('hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd');
	for ($i = 0; $i < 6; $i++) {
		array_push($base_stats, $row[$list_abbrev[$i]]);
	}
	$this_poke['base_stats'] = $base_stats;
	mysqli_free_result($sql_result);
} else {
	error_log(mysqli_error($con) . ' Query:' . $sql_query);
}

$sql_query = 'SELECT name,description FROM ability WHERE' .
' ability.id = ( SELECT ability1 FROM poke_basic WHERE id=' . $id . ')' .
' OR ability.id = ( SELECT ability2 FROM poke_basic WHERE id=' . $id . ')' .
' OR ability.id = ( SELECT ability3 FROM poke_basic WHERE id=' . $id . ')';
if ($sql_result = mysqli_query($con, $sql_query)) {
	$abilities = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
	$this_poke['abilities'] = $abilities;
	mysqli_free_result($sql_result);
} else {
	error_log(mysqli_error($con) . ' Query:' . $sql_query);
}

$this_poke['apng'] = get_apng_url($id);

echo json_encode($this_poke);
mysqli_close($con);
?>