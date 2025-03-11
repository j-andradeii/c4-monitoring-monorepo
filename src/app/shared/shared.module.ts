import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

//PRIMENG COMPONENTS
import { ButtonModule } from 'primeng/button';
import {ToastModule} from 'primeng/toast';

import { GwcToastComponent } from './components/gwc-toast/gwc-toast.component';
import { ConfirmationService, MessageService } from "primeng/api";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ToastModule
    ],
    declarations:[
        GwcToastComponent,
    ],
    exports:[
        //MODULES
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ToastModule,

        //COMPONENTS
        GwcToastComponent
    ],
    providers:[
        MessageService,
        ConfirmationService,
        // DialogService
    ]
})
export class SharedModule { }