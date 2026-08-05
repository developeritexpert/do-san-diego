<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;

/**
 * m260805_121207_populate_events_data_to_categories migration.
 */
class m260805_121207_populate_events_data_to_categories extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        // Place migration code here...

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        echo "m260805_121207_populate_events_data_to_categories cannot be reverted.\n";
        return false;
    }
}
