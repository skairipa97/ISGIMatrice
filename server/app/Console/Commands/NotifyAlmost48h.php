<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class NotifyAlmost48h extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-almost48h';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders to students after 24h to justify their absences before 48h';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        app(\App\Http\Controllers\JustificationController::class)->notifyAlmost48h();
        $this->info('Absence justification reminders sent to students who are between 24h and 48h since absence.');
    }
}
