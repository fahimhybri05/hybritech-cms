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
use App\Models\Footer;
use App\Models\ServicePageDetails;
use App\Models\JobApplication;
use App\Models\AddressInfo;
use App\Models\Project;
use App\Models\Role;
use App\Models\WebPages;


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
        Lodata::discover(Footer::class);
        Lodata::discover(ServicePageDetails::class);
        Lodata::discover(JobApplication::class);
        Lodata::discover(AddressInfo::class);
        Lodata::discover(Project::class);
        Lodata::discover(WebPages::class);
        Lodata::discover(Role::class);
    }
}
