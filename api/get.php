<?php
/** api/get.php?id=5 - returns ONE application (used to pre-fill the edit form). */
require '../db_connect.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $conn->prepare("SELECT * FROM applications WHERE application_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$app = $stmt->get_result()->fetch_assoc();

if (!$app) {
    json_response(['success' => false, 'errors' => ['Application not found.']], 404);
}
json_response(['success' => true, 'application' => $app]);
