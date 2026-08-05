<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\elements\Category;
use craft\elements\Entry;

/**
 * m260805_121200_populate_events_data_to_categories migration.
 */
class m260805_121200_populate_events_data_to_categories extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        echo "Fetching all upcoming events...\n";
        // Get all entry IDs from upcomingEvents section
        $eventIds = Entry::find()->section('upcomingEvents')->ids();
        
        if (empty($eventIds)) {
            echo "No upcoming events found to assign.\n";
            return true;
        }

        echo "Found " . count($eventIds) . " events.\n";
        
        // Find all categories in experienceCategories and priceRange
        $categories = Category::find()->group(['experienceCategories', 'priceRange'])->all();
        echo "Found " . count($categories) . " categories. Populating...\n";

        foreach ($categories as $category) {
            $category->setFieldValue('eventsTable', $eventIds);
            
            if (Craft::$app->elements->saveElement($category)) {
                echo "Successfully saved category: " . $category->title . "\n";
            } else {
                echo "Failed to save category: " . $category->title . "\n";
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        echo "m260805_121200_populate_events_data_to_categories cannot be reverted.\n";
        return false;
    }
}
