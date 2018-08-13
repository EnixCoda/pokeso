<?php
function get_apng_url($id) {
	$id = '000' . $id;
	$id_length_3 = substr($id, -3);
	$apng_url = '//poke.so/storage/apic/' . $id_length_3 . '.png';
	return $apng_url;
}
?>