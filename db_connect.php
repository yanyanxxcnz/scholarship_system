<?php
/**
 * db_connect.php
 * Database connection + helper functions shared by every file in /api.
 * PHP in this project has NO HTML: it only talks to MySQL and returns JSON.
 * When you deploy to InfinityFree, change ONLY the 4 credential lines below.
 */
header('Content-Type: application/json; charset=utf-8');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "localhost";                   // InfinityFree: e.g. sql123.infinityfree.com
$user = "root";                        // InfinityFree: e.g. if0_12345678
$pass = "";                            // InfinityFree: your database password
$db   = "scholarship_db";              // InfinityFree: e.g. if0_12345678_scholarship

/** Send a JSON response and stop the script. */
function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Any unexpected error (wrong password, missing table...) becomes a clean JSON error.
set_exception_handler(function ($ex) {
    json_response(['success' => false,
        'errors' => ['Server error. Check db_connect.php credentials and that scholarship_db.sql was imported.']], 500);
});

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

/** Read the JSON body sent by fetch() in the JavaScript files. */
function read_json_body() {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

/** Only allow POST for actions that change data. */
function require_post() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'errors' => ['POST required.']], 405);
    }
}

/** Validate application data. Returns a list of error messages (empty list = OK). */
function validate_application($d, $conn) {
    $errors = [];
    $name   = trim((string)($d['student_name'] ?? ''));
    $email  = trim((string)($d['email'] ?? ''));
    $course = trim((string)($d['course'] ?? ''));
    $year   = $d['year_level'] ?? '';
    $gpa    = $d['gpa'] ?? '';
    $status = $d['status'] ?? '';
    $sid    = (int)($d['scholarship_id'] ?? 0);

    if ($name === '')                                    $errors[] = "Full name is required.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))      $errors[] = "Enter a valid email address.";
    if ($course === '')                                  $errors[] = "Course is required.";
    if (!in_array((int)$year, [1, 2, 3, 4, 5, 6], true)) $errors[] = "Year level must be 1 to 6.";
    if (!is_numeric($gpa) || $gpa < 1 || $gpa > 5)       $errors[] = "GPA must be between 1.00 and 5.00.";
    if (!in_array($status, ['Pending', 'Approved', 'Rejected'], true)) $errors[] = "Invalid status.";

    $chk = $conn->prepare("SELECT 1 FROM scholarships WHERE scholarship_id = ?");
    $chk->bind_param("i", $sid);
    $chk->execute();
    if (!$chk->get_result()->fetch_row())                $errors[] = "Please choose a valid scholarship.";
    return $errors;
}
