<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['template'])) {
    $template = $_FILES['template']['tmp_name'];

    $zip = new ZipArchive;
    if ($zip->open($template) === TRUE) {
        $content = $zip->getFromName('word/document.xml');
        $zip->close();

        //$content = preg_replace('/<[^>]+>/', '', $content);

        // Находим текст между символами ** и возвращаем его в виде списка
        preg_match_all('/\*\*(.*?)\*\*/', $content, $matches);
        $fields = array_map('trim', $matches[1]);

        echo json_encode(['fields' => $fields]);
    } else {
        echo json_encode(['error' => 'Failed to open the template.']);
    }
} else {
    echo json_encode(['error' => 'Invalid request.']);
}

?>


