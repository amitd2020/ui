import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ThankyouComponent } from './no-auth-pages/thankyou.component';
import { AppNotfoundComponent } from './no-auth-pages/app.notfound.component';
import { AppAccessdeniedComponent } from './no-auth-pages/app.accessdenied.component';
import { AuthGuardService } from './interface/auth-guard/auth-guard.guard';
import { RoleAuthGuard } from './interface/auth-guard/role-auth.guard';
import { CreateAccountComponent } from './no-auth-pages/app.createAccount.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules
};

const routes: Routes = [
    {
        path: 'hubspot-ui',
        loadChildren: () => import('./hubspot-ui/hubspot-ui.module').then( m => m.HubspotUiModule ),
    },
    {
        path: 'authentication',
        loadChildren: () => import('./no-auth-pages/no-auth-pages.module').then( m => m.NoAuthPagesModule )
    },
    {
        path: 'dg-extn',
        loadChildren: () => import('./layout/utilities/dg-extension/dg-extension.module').then( m=> m.DgExtensionModule ),
    },
    {
        path: '', component: AppLayoutComponent,
        children: [
            {
                path: '',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/dashboard/dashboard.module').then( m => m.DashboardModule )
            },
            {
                path: 'company-search',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/search-company/search-company.module').then( m => m.SearchCompanyModule )
            },
            {
                path: 'workflow',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/workflow/workflow.module').then( m => m.WorkflowModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            },
            {
                path: 'company',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/company-details-module/company-details-view.module').then( m => m.CompanyDetailsViewModule )
            },
            {
                path: 'list',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/list-module/list-module.module').then( m => m.ListModuleModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            },
            {
                path: 'deep-insights',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/deep-insights/deep-insights.module').then( m => m.DeepInsightsModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            },
            {
                path: 'director',
                loadChildren: () => import('./interface/view/features-modules/director-details/director-module.module').then( m => m.DirectorModuleModule )
            },
            {
                path: 'common-features',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/common-features/common-features.module').then( m => m.CommonFeaturesModule )
            },
            {
                path: 'insights',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/insights-module/insights-module.module').then( m => m.InsightsModuleModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'user-account-info',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/user-account-utilities/user-account-module.module').then( m => m.UserAccountModuleModule ),
            },
            {
                path: 'stats-insights',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/stats-insights/stats-insights.module').then( m => m.StatsInsightsModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'industry-analysis',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () => import('./interface/view/features-modules/industry-analysis/industry-analysis.module').then( m => m.IndustryAnalysisModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            },
            {
                path: 'admin-account',
                loadChildren: () => import('./interface/view/admin-account-utilities/admin-account-utilities.module').then( m => m.AdminAccountUtilitiesModule ),
                data: { userRoles: [ 'Super Admin' ] },
                canActivate: [ AuthGuardService, RoleAuthGuard ]
            },
            {
                path: 'relations',
                loadChildren: () => import('./interface/view/features-modules/company-relations-tree/company-relations-tree.module').then( m=> m.CompanyRelationsTreeModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            },
            {
                path: 'user-management',
                loadChildren: () => import('./interface/view/admin-account-utilities/user-management/user-management.module').then( m=> m.UserManagementModule ),
                canActivate: [ AuthGuardService ]
            },
            {
                path: 'scheduler',
                loadChildren: () => import('./interface/view/features-modules/automation-module/automation-module.module').then( m=> m.AutomationModuleModule ),
                data: { userRoles: [ 'Super Admin' ] },
                canActivate: [ AuthGuardService, RoleAuthGuard ]
            },
            {
                path: 'esg',
                loadChildren: () => import('./interface/view/features-modules/company-details-module/esg-module/esg.module').then( m => m.EsgModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'stats-analysis',
                data: { breadcrumb: 'Growth Analysis' },
                loadChildren: () => import('./stats-analysis/stats-analysis.module').then( m => m.StatsAnalysisModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'overview',
                loadChildren: () => import('../app/layout/benchmarking-dashboard/benchmarking-dashboard.module').then( m => m.BenchmarkingDashboardModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'supplier',
                loadChildren: () => import('../app/interface/view/features-modules/insights-module/landscape-insights/diversity-calculation/diversity.module').then( m => m.DiversityModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'pdfmake',
                loadComponent: () => import('../app/shared-pdf-report/make-pdf-report.component').then( c => c.MakePdfReport ),
                // canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            },
            {
                path: 'chat-ai',
                loadChildren: () => import('../app/ai-chat/ai-chat.module').then( c => c.AiChatModule ),
                canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ]
            }
            // {
            //     path: 'carbon-calculator',
            //     loadChildren: () => import('./interface/view/features-modules/carbon-calculator/carbon-calculator.module').then( m => m.CarbonCalculatorModule ),
            //     canActivate: [ AuthGuardService ], canActivateChild: [ AuthGuardService ],
            // },
            // {
                // 	path: 'sustainability',
                // 	loadChildren: () => import('./interface/view/features-modules/sustainability-module/sustainability-module.module').then ( m => m.SustainabilityModuleModule )
            // },
        ]
    },
    { path: 'dg-authenticate', component: ThankyouComponent },
    { path: 'grantify-offer', component: CreateAccountComponent },
    { path: '404', component: AppNotfoundComponent },
    { path: 'accessdenied', component: AppAccessdeniedComponent },
    { path: '**', redirectTo: '404' },
    { path: '', redirectTo: 'authentication/login', pathMatch: 'full' },
];


@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }