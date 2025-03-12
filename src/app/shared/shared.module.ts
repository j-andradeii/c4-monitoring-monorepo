import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

//PRIMENG COMPONENTS
import { ButtonModule } from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from "primeng/api";
import { DynamicDialog, DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AccordionModule } from 'primeng/accordion';

import { GwcToastComponent } from './components/gwc-toast/gwc-toast.component';
import { TestDialogComponent } from './components/test-dialog/test-dialog.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        DynamicDialog,
        BreadcrumbModule,
        MenuModule,
        PanelMenuModule,
        AccordionModule   
    ],
    declarations:[
        GwcToastComponent,
        TestDialogComponent,
    ],
    exports:[
        //MODULES
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        BreadcrumbModule,
        MenuModule,
        PanelMenuModule,
        AccordionModule,   

        //COMPONENTS
        GwcToastComponent,
        TestDialogComponent,
    ],
    providers:[
        MessageService,
        ConfirmationService,
        DialogService
    ]
})
export class SharedModule { }