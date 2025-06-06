import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiChatComponent } from './ai-chat.component';
import { HeaderComponent } from './components/header/header.component';
import { PromptInputComponent } from './components/prompt-input/prompt-input.component';
import { AiResponseComponent } from './components/ai-response/ai-response.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { SharedTablesModule } from '../interface/view/shared-components/shared-tables/shared-tables.module';

const routes: Routes = [
  { path: "", component: AiChatComponent }
]

@NgModule({
  declarations: [
    AiChatComponent,
    HeaderComponent,
    PromptInputComponent,
    AiResponseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ScrollPanelModule,
    DialogModule,
    SharedTablesModule,
    RouterModule.forChild(routes)
  ],
  exports: [ AiChatComponent ]
})
export class AiChatModule { }
