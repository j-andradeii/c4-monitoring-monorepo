import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MenuItem } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbsService {
    public breadcrumbItems$ = new BehaviorSubject<MenuItem[]>([]);
}
