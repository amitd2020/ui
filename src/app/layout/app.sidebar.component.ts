import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AppMenuProfileComponent } from './utilities/menu/app.menuprofile.component';
import { LayoutService } from './service/app.layout.service';
import { MenuService } from './utilities/menu/app.menu.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styles: [`
        :host {
          position: relative;
          z-index: 1;
        }
    `]
})
export class AppSidebarComponent implements OnDestroy {

    timeout: any = null;

    @ViewChild(AppMenuProfileComponent) menuProfile!: AppMenuProfileComponent;

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    @ViewChild('menuButton') menuButton!: ElementRef;

    constructor(public layoutService: LayoutService, public el: ElementRef, public menuService: MenuService) {
        this.layoutService.state.sidebarActive = this.layoutService.config.menuMode == 'static' && !this.layoutService.isMobile();
    }

    resetOverlay() {
        if(this.layoutService.state.overlayMenuActive) {
            this.layoutService.state.overlayMenuActive = false;
        }
    }

    get menuProfilePosition(): string {
        return this.layoutService.config.menuProfilePosition;
    }

    onMouseEnter() {
        // if (!this.layoutService.state.anchored) {
        //     if (this.timeout) {
        //         clearTimeout(this.timeout);
        //         this.timeout = null;
        //     }
        //     this.layoutService.state.sidebarActive = true;
        // }
    }

    onMouseLeave() {
        // if (!this.layoutService.state.anchored) {
        //     if (!this.timeout) {
        //         this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
        //     }
        // }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

    ngOnDestroy() {
        this.resetOverlay();
    }

    onMenuButtonClick() {
        // this.layoutService.state.sidebarActive = !this.layoutService.state.sidebarActive;

        if ( !this.layoutService.isSlim() ) {
            this.layoutService.config.menuMode = 'slim';
            this.layoutService.state.sidebarActive = false;
        } else {
            this.layoutService.config.menuMode = 'static';
            this.layoutService.state.sidebarActive = true;
        }
        if (this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
            this.menuService.reset();
        }
        this.layoutService.onMenuToggle();
    }

}
