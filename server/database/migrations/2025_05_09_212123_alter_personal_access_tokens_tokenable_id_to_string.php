<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AlterPersonalAccessTokensTokenableIdToString extends Migration
{
    public function up()
    {
        // Drop the existing index first
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex(['tokenable_type', 'tokenable_id']);
        });

        // Change column type
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->string('tokenable_id', 100)->change();
        });

        // Recreate the index using raw SQL with prefix length (e.g., 100)
        DB::statement('ALTER TABLE personal_access_tokens ADD INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type(100), tokenable_id(100))');
    }

    public function down()
    {
        // Drop the prefix index
        DB::statement('DROP INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON personal_access_tokens');

        // Revert column
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->unsignedBigInteger('tokenable_id')->change();
        });

        // Recreate the original index
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }
}
