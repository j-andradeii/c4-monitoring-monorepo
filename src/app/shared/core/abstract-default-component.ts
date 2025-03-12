import { Component } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BreadcrumbsService } from "../services/breadcrumbs.service";

@UntilDestroy()
@Component({template: ''})
export abstract class AbstractDefaultComponent  {
    abstract setBreadcrumbs(): void;
    constructor(public breadcrumbsService: BreadcrumbsService ) {
        this.setBreadcrumbs();
    }
    
}


    // private breadcrumbsService: BreadcrumbsService