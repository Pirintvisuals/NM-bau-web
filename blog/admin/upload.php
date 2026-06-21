<?php
// TinyMCE képfeltöltési végpont (a szerkesztőbe húzott/illesztett képekhez).
require_once dirname(__DIR__) . '/inc/functions.php';
header('Content-Type: application/json; charset=utf-8');

if (!is_logged_in()) {
  http_response_code(403);
  echo json_encode(['error' => 'Nincs belépve.']);
  exit;
}
if (empty($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Nincs fájl.']);
  exit;
}

$location = save_uploaded_image($_FILES['file']);
if (!$location) {
  http_response_code(400);
  echo json_encode(['error' => 'Érvénytelen vagy túl nagy kép.']);
  exit;
}

echo json_encode(['location' => $location]);
