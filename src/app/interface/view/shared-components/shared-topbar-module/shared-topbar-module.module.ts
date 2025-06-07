import { NgModule } from "@angular/core";
import { AppTopbarComponent } from "./top-bar/app.topbar.component";
import { CommonModule } from "@angular/common";
import { SharedSearchBarModule } from "../shared-search-bar/shared-search-bar.module";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";





@NgModule( {
    declarations: [
        AppTopbarComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        SharedSearchBarModule
    ],
    exports: [
        AppTopbarComponent
    ]
} )

export class SharedTopBarModule{}