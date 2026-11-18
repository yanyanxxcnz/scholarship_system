<?php
/** api/list.php - READ (SELECT): returns all applications + status counts as JSON. */
require '../db_connect.php';

$result = $conn->query(
    "SELECT a.application_id, a.student_name, a.email, a.course, a.year_level, a.gpa, a.status,
            s.name AS scholarship_name
     FROM applications a
     JOIN scholarships s ON a.scholarship_id = s.scholarship_id
     ORDER BY a.date_applied DESC, a.application_id DESC");
$applications = $result->fetch_all(MYSQLI_ASSOC);

$counts = ['Pending' => 0, 'Approved' => 0, 'Rejected' => 0];
$c = $conn->query("SELECT status, COUNT(*) AS n FROM applications GROUP BY status");
while ($r = $c->fetch_assoc()) { $counts[$r['status']] = (int)$r['n']; }

json_response(['success' => true, 'applications' => $applications, 'counts' => $counts]);
