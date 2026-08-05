<?php
$_SERVER['DOCUMENT_ROOT'] = __DIR__ . '/web';
require __DIR__ . '/bootstrap.php';
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/console.php';

use craft\elements\Entry;
use Craft;

$newEntryType = Craft::$app->entries->getEntryTypeByUid('0b099a46-41fa-4f8c-9e67-1bf9e205b2da');
if (!$newEntryType) {
    die("Entry type not found\n");
}

$entries = Entry::find()->section('restaurants')->all();
$count = 0;
foreach ($entries as $entry) {
    if ($entry->typeId != $newEntryType->id) {
        $entry->typeId = $newEntryType->id;
        Craft::$app->elements->saveElement($entry);
        $count++;
    }
}
echo "Converted $count restaurant entries to the new layout.\n";
