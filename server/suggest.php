<?php
$request_data = json_decode(file_get_contents('php://input'), true);
$suggestion = $request_data;
file_put_contents('suggestions/' . date('YmdHis') . '.json', json_encode($suggestion));
?>