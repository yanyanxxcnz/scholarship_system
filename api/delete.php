<?php
/** api/delete.php - DELETE: removes one application. Only accepts POST. */
require '../db_connect.php';
require_post();

$d  = read_json_body();
$id = (int)($d['id'] ?? 0);

$stmt = $conn->prepare("DELETE FROM applications WHERE application_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    json_response(['success' => false, 'errors' => ['Application not found.']], 404);
}
json_response(['success' => true, 'message' => 'Application deleted.']);
