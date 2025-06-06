import { ChangeDetectorRef, Component, OnDestroy, Renderer2, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '../layout/service/app.layout.service';
@Component({
    selector: 'dg-hubspot-ui',
    templateUrl: './hubspot-ui.component.html',
    styleUrls: ['./hubspot-ui.component.scss']
})

export class HubspotUiComponent  {

    showLoginModal: boolean = false;

    constructor( public layoutService: LayoutService, public router: Router ) {}

    get containerClass() {
        let styleClass: {[key: string]: any} = {
            'layout-overlay': this.layoutService.config.menuMode === 'overlay',
            'layout-static': this.layoutService.config.menuMode === 'static',
            'layout-slim': this.layoutService.config.menuMode === 'slim',
            'layout-slim-plus': this.layoutService.config.menuMode === 'slim-plus',
            'layout-horizontal': this.layoutService.config.menuMode === 'horizontal',
            'layout-reveal': this.layoutService.config.menuMode === 'reveal',
            'layout-drawer': this.layoutService.config.menuMode === 'drawer',
            'p-input-filled': this.layoutService.config.inputStyle === 'outlined',
            'p-ripple-disabled': !this.layoutService.config.ripple,
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'layout-topbar-menu-active': this.layoutService.state.topbarMenuActive,
            'layout-menu-profile-active': this.layoutService.state.menuProfileActive,
            'layout-sidebar-active': this.layoutService.state.sidebarActive,
            'layout-sidebar-anchored': this.layoutService.state.anchored
        };

        styleClass['layout-topbar-' + this.layoutService.config.topbarTheme] = true;
        styleClass['layout-menu-' + this.layoutService.config.menuTheme] = true;
        styleClass['layout-menu-profile-' + this.layoutService.config.menuProfilePosition] = true;
        return styleClass;
    }

    logoutFromDGHubSpot() {
        localStorage.clear();
        this.router.navigate(['hubspot-ui/AuthLogin']);
    }

}
