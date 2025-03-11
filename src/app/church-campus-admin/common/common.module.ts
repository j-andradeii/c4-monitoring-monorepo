
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
    imports:[
        SharedModule,
    ],
    declarations:[
        HeaderComponent,
        FooterComponent
    ],
    exports:[
        HeaderComponent,
        FooterComponent
    ]
})
export class ChurchCampusAdminCommonModule { }