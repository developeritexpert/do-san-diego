<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;

/**
 * m260805_112126_populate_category_data migration.
 */
class m260805_112126_populate_category_data extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        $htmlTable = <<<EOT
<table class="event-table">
                            <thead>
                                <tr>
                                    <th>Event Title</th>
                                    <th>Date & Time</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Taste of the City Food Festival</td>
                                    <td>Aug 25 – Aug 28 <span class="all-day">(All Day)</span></td>
                                    <td><a href="#">City Square</a></td>
                                </tr>
                                <tr>
                                    <td>Family Fun Carnival &amp; Community Fair</td>
                                    <td>Sep 30 – Oct 1 <span class="all-day">(All Day)</span></td>
                                    <td><a href="#">Riverfront Park</a></td>
                                </tr>
                                <tr>
                                    <td>Outdoor Movie Night – Family Feature</td>
                                    <td>Oct 3 – Oct 4 <span class="all-day">(All Day)</span></td>
                                    <td><a href="#">Central Green</a></td>
                                </tr>
                                <tr>
                                    <td>Annual Arts &amp; Crafts Expo</td>
                                    <td>Oct 17</td>
                                    <td><a href="#">Valley Farms</a></td>
                                </tr>
                                <tr>
                                    <td>Harvest Festival &amp; Pumpkin Patch</td>
                                    <td>Dec 1 – Dec 3 <span class="all-day">(All Day)</span></td>
                                    <td><a href="#">Heritage Park</a></td>
                                </tr>
                                <tr>
                                    <td>Holiday Tree Lighting Celebration</td>
                                    <td>Dec 14</td>
                                    <td><a href="#">Town Plaza</a></td>
                                </tr>
                            </tbody>
                        </table>
EOT;

        $desc = "<p>Discover Hidden</p><p>Explore unforgettable experiences, from iconic landmarks and scenic outdoor adventures to local culture, shopping, and family-friendly attractions. Find the perfect activity that matches your interests and budget, and start planning your next adventure with confidence.</p>";

        $categories = \craft\elements\Category::find()->group(['experienceCategories', 'priceRange'])->all();
        foreach ($categories as $category) {
            $category->setFieldValue('description', $desc);
            $category->setFieldValue('highlightedWord', 'Gems');
            $category->setFieldValue('buttonText', 'Explore Activities');
            $category->setFieldValue('eventsTable', $htmlTable);
            Craft::$app->elements->saveElement($category);
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        echo "m260805_112126_populate_category_data cannot be reverted.\n";
        return false;
    }
}
