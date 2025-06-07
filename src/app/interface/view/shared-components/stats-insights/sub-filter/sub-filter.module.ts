import { NgModule } from "@angular/core";
import { SubFilterComponent } from "./sub-filter.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputNumberModule } from "primeng/inputnumber";
import { CheckboxModule } from "primeng/checkbox";
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { FormsModule } from '@angular/forms';
import { SimilarCompanyService } from "./similar-company.services";



@NgModule({

    imports: [
        CommonModule,
        DropdownModule,
        ButtonModule,
        InputSwitchModule,
        InputNumberModule,
        RadioButtonModule,
        CheckboxModule,
        NumberSuffixModule,
        FormsModule
    ],
    declarations: [
        SubFilterComponent
    ],
    exports: [
        SubFilterComponent
    ],
    providers: [
        SimilarCompanyService
    ]

})

export class SubFilterModule { }