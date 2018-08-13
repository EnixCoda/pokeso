<?php
$request_data = json_decode(file_get_contents('php://input'), true);

//Connect DB
include 'db_con.php';

$sql_query = 'SELECT * FROM ability WHERE
 	ability.id IN (SELECT ability1 FROM poke_basic WHERE id=' . $request_data['id'] . ')
OR  ability.id IN (SELECT ability2 FROM poke_basic WHERE id=' . $request_data['id'] . ')
OR  ability.id IN (SELECT ability3 FROM poke_basic WHERE id=' . $request_data['id'] . ')
';

$sql_result = mysqli_query($con, $sql_query);

$result = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
mysqli_free_result($sql_result);

echo json_encode($result);
mysqli_close($con);
?>