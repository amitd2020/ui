import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from './config/app.config.module';
import { AppLayoutComponent } from './app.layout.component';
import { AppBreadcrumbComponent } from './utilities/breadcrumb/app.breadcrumb.component';
import { AppMenuProfileComponent } from './utilities/menu/app.menuprofile.component';
// import { AppTopbarComponent } from './utilities/top-bar/app.topbar.component';
import { AppRightMenuComponent } from './app.rightmenu.component';
import { AppMenuComponent } from './utilities/menu/app.menu.component';
import { AppMenuitemComponent } from './utilities/menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppSidebarComponent } from './app.sidebar.component';
// import { AppFooterComponent } from './app.footer.component';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { StyleClassModule } from 'primeng/styleclass';
import { CommonModule } from '@angular/common';
import { SharedLoaderModule } from '../interface/view/shared-components/shared-loader/shared-loader.module';
import { MessageService } from 'primeng/api';
import { SharedSearchBarModule } from '../interface/view/shared-components/shared-search-bar/shared-search-bar.module';
import { SharedTopBarModule } from '../interface/view/shared-components/shared-topbar-module/shared-topbar-module.module';
import { SharedFooterModule } from '../interface/view/shared-components/shared-footer-module/shared-footer-module.module';
import { WorkflowService } from '../interface/view/features-modules/workflow/workflow.service'
import { AccordionModule } from 'primeng/accordion';
import { PanelModule  } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
    declarations: [
        AppLayoutComponent,
        AppBreadcrumbComponent,
        AppMenuProfileComponent,
        // AppTopbarComponent,
        AppRightMenuComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppMenuitemComponent,
        // AppFooterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        BrowserAnimationsModule,
        StyleClassModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        MegaMenuModule,
        RippleModule,
        RouterModule,
        ButtonModule,
        MenuModule,
        AppConfigModule,
        DialogModule,
        AccordionModule,
        PanelModule,
        SharedLoaderModule,
        SharedSearchBarModule,
        SharedTopBarModule,
        SharedFooterModule,
        ScrollPanelModule
    ],
    providers: [
        MessageService,
        WorkflowService
    ]
})
export class AppLayoutModule { }
