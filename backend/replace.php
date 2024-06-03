<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['template']) && isset($_POST['excelData'])) {
    $template = $_FILES['template']['tmp_name'];
    $excelData = json_decode($_POST['excelData'], true);

    $zip = new ZipArchive;
    $zipFilename = 'updated_templates_' . date('Y-m-d') . '.zip';
    if ($zip->open($zipFilename, ZipArchive::CREATE) === TRUE) {
        foreach ($excelData as $index => $row) {
            if ($index === 0) {
                // Skip header row
                continue;
            }

            $currentReplacements = array_combine($excelData[0], $row);
            $zipTemplate = new ZipArchive;
            if ($zipTemplate->open($template) === TRUE) {
                $content = $zipTemplate->getFromName('word/document.xml');
                $zipTemplate->close();

                foreach ($currentReplacements as $field => $replacement) {
                    $content = str_replace("**$field**", $replacement, $content);
                }

                $zipTemplate = new ZipArchive;
                $newDocName = $currentReplacements[$excelData[0][0]] . '.docx';
                $tempFile = tempnam(sys_get_temp_dir(), 'docx');
                copy($template, $tempFile);
                if ($zipTemplate->open($tempFile) === TRUE) {
                    $zipTemplate->deleteName('word/document.xml');
                    $zipTemplate->addFromString('word/document.xml', $content);
                    $zipTemplate->close();
                    $zip->addFile($tempFile, $newDocName);
                }
            }
        }
        $zip->close();
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $zipFilename . '"');
        readfile($zipFilename);
        unlink($zipFilename);
    } else {
        echo json_encode(['error' => 'Failed to create the zip archive.']);
    }
} else {
    echo json_encode(['error' => 'Invalid request.']);
}
?>
