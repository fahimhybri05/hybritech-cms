<?php

namespace App\Providers;

use Flat3\Lodata\Facades\Lodata;
use Flat3\Lodata\Model;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\CommonForm;
use App\Models\Faq;
use App\Models\ContactUsForm;
use App\Models\JobList;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Lodata::discover(User::class);
        Lodata::discover(CommonForm::class);
        Lodata::discover(ContactUsForm::class);
        Lodata::discover(Faq::class);
        Lodata::discover(JobList::class);
    }
}
