import { NgModule } from "@angular/core";
//PRIMENG COMPONENTS
import { ButtonModule } from 'primeng/button';
import {ToastModule} from 'primeng/toast';

import { GwcToastComponent } from './components/gwc-toast/gwc-toast.component';
import { ConfirmationService, MessageService } from "primeng/api";


@NgModule({
    imports:[
        ButtonModule,
        ToastModule
    ],
    declarations:[
        GwcToastComponent
    ],
    exports:[
        //MODULES
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