<?php
// File: app/Console/Kernel.php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected $commands = [
        \App\Console\Commands\CheckCriticalAbsences::class,
        \App\Console\Commands\NotifyAlmost48h::class,
    ];
    protected function schedule(Schedule $schedule)
    {
        \Log::info('Critical absences check started at: ' . now());
        
        $schedule->command('notify:almost48h')->hourly();
        
    
        $schedule->command('absences:check-critical')
             ->hourly(); 

        
        // You can add other scheduled tasks here as needed
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}