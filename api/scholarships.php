<?php
/** api/scholarships.php - returns the scholarship list for the form dropdown. */
require '../db_connect.php';

$result = $conn->query("SELECT scholarship_id, name, sponsor FROM scholarships ORDER BY name");
json_response(['success' => true, 'scholarships' => $result->fetch_all(MYSQLI_ASSOC)]);
