import { NgModule } from "@angular/core";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { InputTextModule } from "primeng/inputtext";
import { SidebarModule } from 'primeng/sidebar';
import { ChipModule } from 'primeng/chip';

import { DashboardComponent } from "./dashboard.component";

import { SharedSearchBarModule } from "../../shared-components/shared-search-bar/shared-search-bar.module";
import { NoAuthPagesModule } from "src/app/no-auth-pages/no-auth-pages.module";
import { SavedFilterChipsModule } from "../../shared-components/saved-filter-chips/saved-filter-chips.module";

import { SearchFiltersService } from "src/app/interface/service/search-filter.service";
import { LoginAccessModalComponent } from "src/app/Login Access Modal/LoginAccessModal";
import { SearchAiComponent } from "../search-ai/search-ai.component";
import { TableModule } from "primeng/table";
import { SharedTablesModule } from "../../shared-components/shared-tables/shared-tables.module";
import { NumberSuffixPipe } from "src/app/interface/custom-pipes/number-suffix/number-suffix.pipe";
import { PromptSearchAiComponent } from './prompt-search-ai/prompt-search-ai.component';
import { PromptTimelineComponent } from './prompt-timeline/prompt-timeline.component';
import { DataEnrichmentComponent } from './data-enrichment/data-enrichment.component';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { PickListModule } from "primeng/picklist";
import { CheckboxModule } from "primeng/checkbox";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { ListboxModule } from "primeng/listbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { AccordionModule } from "primeng/accordion";



const dashboardRoute: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'ai-search', component: SearchAiComponent },
    { path: 'prompt-ai-search', data: { breadcrumb: 'Prompt AI Search' }, component: PromptSearchAiComponent },
    { path: 'prompt-timeline', data: { breadcrumb: 'Prompt Timeline' }, component: PromptTimelineComponent },
    { path: 'data-enrichment', data: { breadcrumb: 'Data Enrichment' }, component: DataEnrichmentComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forChild( dashboardRoute ),
        MessagesModule,
        MessageModule,
        InputTextModule,
        ButtonModule,
        SharedSearchBarModule,
        NoAuthPagesModule,
		DialogModule,
        SavedFilterChipsModule,
        LoginAccessModalComponent,
        TableModule,
        SharedTablesModule,
        SidebarModule,
        ChipModule,
        StepsModule,
        DropdownModule,
        FileUploadModule,
        PickListModule,
        CheckboxModule,
        ScrollPanelModule,
        ListboxModule,
        InputSwitchModule,
        AccordionModule
    ],
    declarations: [
        DashboardComponent,
        SearchAiComponent,
        PromptSearchAiComponent,
        PromptTimelineComponent,
        DataEnrichmentComponent
    ],
    providers: [
        SearchFiltersService, NumberSuffixPipe
    ]
})

export class DashboardModule {}