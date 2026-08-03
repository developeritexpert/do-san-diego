<?php
define('CRAFT_BASE_PATH', __DIR__);
define('CRAFT_VENDOR_PATH', CRAFT_BASE_PATH.'/vendor');
require CRAFT_VENDOR_PATH.'/autoload.php';
$app = require CRAFT_VENDOR_PATH.'/craftcms/cms/bootstrap/console.php';

$entry = \craft\elements\Entry::find()->id(258)->one();
if ($entry) {
    foreach ($entry->getFieldLayout()->getCustomFields() as $field) {
        echo $field->handle . " (" . get_class($field) . ")\n";
    }
} else {
    echo "Entry not found\n";
}
