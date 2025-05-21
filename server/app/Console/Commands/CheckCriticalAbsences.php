<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class CheckCriticalAbsences extends Command
{
    protected $signature = 'absences:check-critical';
    protected $description = 'Check for students with critical absences and send notifications';

    public function handle()
    {
// Call the controller method directly
    $controller = app()->make(\App\Http\Controllers\AbsenceController::class);
    $response = $controller->critical(new \Illuminate\Http\Request());
    
  
        if ($response) {
            $this->info('Critical absence check completed. Notifications sent if needed.');
        } else {
            $this->error('Failed to check critical absences: '.$response->body());
        }
    }
}