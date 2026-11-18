<?php
/**
 * api/save.php - CREATE (INSERT) and UPDATE in one file.
 * If the JSON body has an "id" greater than 0 it updates that record, otherwise it inserts a new one.
 */
require '../db_connect.php';
require_post();

$d = read_json_body();
$errors = validate_application($d, $conn);
if ($errors) {
    json_response(['success' => false, 'errors' => $errors], 422);
}

$sid    = (int)$d['scholarship_id'];
$name   = trim($d['student_name']);
$email  = trim($d['email']);
$course = trim($d['course']);
$year   = (int)$d['year_level'];
$gpa    = (float)$d['gpa'];
$status = $d['status'];
$id     = (int)($d['id'] ?? 0);

if ($id > 0) {
    $chk = $conn->prepare("SELECT 1 FROM applications WHERE application_id = ?");
    $chk->bind_param("i", $id);
    $chk->execute();
    if (!$chk->get_result()->fetch_row()) {
        json_response(['success' => false, 'errors' => ['Application not found.']], 404);
    }
    $stmt = $conn->prepare(
        "UPDATE applications SET scholarship_id=?, student_name=?, email=?, course=?,
         year_level=?, gpa=?, status=? WHERE application_id=?");
    $stmt->bind_param("isssidsi", $sid, $name, $email, $course, $year, $gpa, $status, $id);
    $stmt->execute();
    json_response(['success' => true, 'message' => 'Application updated successfully.']);
}

$stmt = $conn->prepare(
    "INSERT INTO applications (scholarship_id, student_name, email, course, year_level, gpa, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssids", $sid, $name, $email, $course, $year, $gpa, $status);
$stmt->execute();
json_response(['success' => true, 'message' => 'Application added successfully.']);
