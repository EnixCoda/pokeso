<?php
$request_data = json_decode(file_get_contents('php://input'), true);

$amount = $request_data['amount'];

function get_apng_url($id) {
	$id = '000' . $id;
	$id_length_3 = substr($id, -3);
	$apng_url = '//poke.so/storage/apic/' . $id_length_3 . '.png';
	return $apng_url;
}

$apng_urls = array();
$i = 0;
while ($i < $amount) {
	array_push($apng_urls, get_apng_url(rand(1, 720)));
	$i++;
}

echo json_encode($apng_urls);
?>