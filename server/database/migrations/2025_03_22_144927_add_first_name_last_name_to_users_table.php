<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First run the users table migration if it hasn't been run yet
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('matrice')->unique();
                $table->timestamp('matrice_verified_at')->nullable();
                
                $table->string('password');
                $table->rememberToken();
                $table->timestamps();
            });
        }

        // Check if the first_name and last_name columns already exist
        if (!Schema::hasColumn('users', 'first_name')) {
            Schema::table('users', function (Blueprint $table) {
                // Add first_name and last_name columns
                $table->string('first_name')->after('id')->nullable();
                $table->string('last_name')->after('first_name')->nullable();
            });
        }

        // Only run the data migration if the name column exists
        if (Schema::hasColumn('users', 'name')) {
            // Copy data from name column to first_name and last_name
            DB::table('users')->get()->each(function ($user) {
                if (property_exists($user, 'name')) {
                    $nameParts = explode(' ', $user->name, 2);
                    $firstName = $nameParts[0] ?? '';
                    $lastName = $nameParts[1] ?? '';
                    
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update([
                            'first_name' => $firstName,
                            'last_name' => $lastName
                        ]);
                }
            });

            // Make columns required and drop name column only if it exists
            Schema::table('users', function (Blueprint $table) {
                // Make columns required after data migration
                $table->string('first_name')->nullable(false)->change();
                $table->string('last_name')->nullable(false)->change();
                
                // Remove the original name column
                $table->dropColumn('name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Check if the first_name and last_name columns exist
        if (Schema::hasColumn('users', 'first_name') && Schema::hasColumn('users', 'last_name')) {
            Schema::table('users', function (Blueprint $table) {
                // Add name column back
                $table->string('name')->after('id')->nullable();
            });

            // Combine first_name and last_name back to name
            DB::table('users')->get()->each(function ($user) {
                if (property_exists($user, 'first_name') && property_exists($user, 'last_name')) {
                    $fullName = trim($user->first_name . ' ' . $user->last_name);
                    
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['name' => $fullName]);
                }
            });

            Schema::table('users', function (Blueprint $table) {
                // Make name required after data migration back
                $table->string('name')->nullable(false)->change();
                
                // Remove the first_name and last_name columns
                $table->dropColumn(['first_name', 'last_name']);
            });
        }
    }
};
