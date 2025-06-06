import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './app.menu.service';
import { LayoutService } from '../../service/app.layout.service';
import { AppSidebarComponent } from '../../app.sidebar.component';
import {DomHandler} from 'primeng/dom';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { WorkflowService } from '../../../interface/view/features-modules/workflow/workflow.service'
import { ExtendedMenuItems } from 'src/app/interface/view/shared-components/filter-sidebar-refactored/filter-option-types';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    template: `
		<ng-container>
            <!-- <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">
                <span>{{item.label}}</span>
                <i class="layout-menuitem-root-icon pi pi-fw pi-ellipsis-h"></i>
            </div> -->
			<a *ngIf="(!item.routerLink || item.items) && item.visible !== false" [attr.href]="item.url" (click)="itemClick($event)"  (mouseenter)="onMouseEnter()"
			   [ngClass]="item.class" [attr.target]="item.target" tabindex="0" pRipple [pTooltip]="item.label" [tooltipDisabled]="!(isSlim && root && !active)">
				<i class="layout-menuitem-icon material-icons">{{ item.icon }}</i>
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>
			<a id="{{parentIndex}}_{{childIndex}}" *ngIf="(item.routerLink && !item.items) && item.visible !== false" (click)="itemClick($event, item.routerLink )" (mouseenter)="onMouseEnter()" [ngClass]="item.class" 
			   [routerLink]="item.routerLink" routerLinkActive="active-route" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
               [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" 
               [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" [queryParams]="item.queryParams"
               [attr.target]="item.target" tabindex="0" pRipple [pTooltip]="item.label" [tooltipDisabled]="!(isSlim && root)">
				<i class="layout-menuitem-icon material-icons" *ngIf="!item?.icon.includes('pi'); else defaultIcon">{{ item.icon }}</i>
                <ng-template #defaultIcon>
                    <ng-container *ngIf="item.icon == 'pi pi-code';else otherItemIcon">
                        <img class="layout-menuitem-icon -ml-2 -mb-1 -mt-1" src="assets/layout/images/PPC2.ico" width='30'>
                        <!-- <img class="layout-menuitem-icon" src="assets/layout/images/PPC2.png "> -->
                    <!-- <i [ngClass]="item.icon" class="layout-menuitem-icon"></i> -->
                    </ng-container>
                    <ng-template #otherItemIcon>
                    <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                    </ng-template>
                </ng-template>


                <!-- <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>22 -->
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>

			<ul #submenu *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation" (@children.done)="onSubmenuAnimated($event)">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
					<li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass" [childIndex]="i" [parentIndex]="parentIndex"  [filteredMenuItems]="filteredMenuItems"></li>
				</ng-template>
			</ul>
        </ng-container>
    `,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            state('hidden', style({
                display: 'none'
            })),
            state('visible', style({
                display: 'block'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterContentChecked {

    @Input() item: any;

    @Input() index!: number;

    @Input() parentIndex!: number;
    @Input() childIndex!: number;
    @Input() searchText!: string;
    @Input() filteredMenuItems: Array<any> = [];
	filterItemsRawForSearch: Partial< ExtendedMenuItems[] > = [];

    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

    @Input() parentKey!: string;
    @Input() selectedItem!: Object;
    @Output() sendFilterItemsRawForSearch = new EventEmitter<any>()

    @ViewChild('submenu') submenu!: ElementRef;

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = "";

    constructor(
        public layoutService: LayoutService, private cd: ChangeDetectorRef, public router: Router, private menuService: MenuService, private appSidebar: AppSidebarComponent,
        private workflowService: WorkflowService,
        private renderer: Renderer2, private el: ElementRef,
        // private cdref: ChangeDetectorRef
    ) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(value => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                }
                else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.isSlimPlus || this.isSlim || this.isHorizontal) {
                    this.active = false;
                }
                else {
                    if (this.item.routerLink) {
                        this.updateActiveStateFromRoute();
                    }
                }
            });
    }
    ngAfterContentChecked() {
        // this.cdref.detectChanges();
    }

    ngAfterViewInit(): void {

        // this.getPanelContainer();
    }

    ngOnChanges(changes: SimpleChanges): void {
       if ( changes && changes.searchText && changes.searchText.currentValue ) {
            this.searchInFiltersByKeywords( this.searchText )
       }

       if ( changes && changes?.selectedItem && Object.keys( changes.selectedItem.currentValue ).length ) {
        this.getPanelContainer( this.selectedItem )
       }
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (!(this.isSlimPlus || this.isSlim || this.isHorizontal) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    getPanelContainer( selectedMenuItem ) {

        
        const { parentIndex, childIndex } = selectedMenuItem;

        setTimeout(() => {
            const panelContainerDom = document.querySelectorAll( '.layout-menu' );
            const selectedFilterOptionElement = panelContainerDom[0]?.children[ parentIndex ]?.children[ 0 ]?.children[ 1 ].children[ 0 ].children[0].children[1].children[childIndex] as HTMLElement;
    
            selectedFilterOptionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.router.navigate(selectedMenuItem.routerLink);
        }, 800 )

    }

    searchInFiltersByKeywords( searchString: any ) {
		if ( searchString ) {
			this.filterItemsRawForSearch = this.prepareFlatArrayFromFilterOptions( this.filteredMenuItems, searchString );
		}
        this.sendFilterItemsRawForSearch.emit( this.filterItemsRawForSearch )
	}

    prepareFlatArrayFromFilterOptions( filterOptionsInputArray: Partial< ExtendedMenuItems[] >, queryString: string ): Partial< ExtendedMenuItems[] > {
		let modifiedFilterOptsArr: Partial< ExtendedMenuItems[] > = [];
		queryString = queryString.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

		modifiedFilterOptsArr = filterOptionsInputArray.reduce( ( modfdArr, currentData, dataIndx ) => {

			if ( currentData?.items ) {
				let modfdfilterItems = currentData?.items.map( ( { label, displayLabel, routerLink }, indx ) => {
					let matchString = ( displayLabel && displayLabel.match( new RegExp( queryString, 'gi' ) ) ) || ( label.match( new RegExp( queryString, 'gi' ) ) );
					if ( !!matchString ) {
						return ({
							label,
							displayLabel,
							filterGroup: ( currentData?.displayLabel ) ? currentData?.displayLabel : currentData?.label,
							parentIndex: dataIndx,
							childIndex: indx,
                            routerLink
						});
					}
					return {};
				});
	
				if ( modfdfilterItems?.length ) {
					modfdArr.push( ...modfdfilterItems.filter( item => !!Object.keys( item ).length ) );
				}
			}

			return modfdArr;
		}, []);

		return modifiedFilterOptsArr;
	}

    ngAfterViewChecked() {
        if (this.root && this.active && this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim()|| this.layoutService.isSlimPlus())) {
            this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement.parentElement);
        }
    }

    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this.menuService.onMenuStateChange({key: this.key, routeEvent: true});
        }
    }

    onSubmenuAnimated(event: AnimationEvent) {
        if (event.toState === 'visible' && this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim()|| this.layoutService.isSlimPlus())) {
            const el = <HTMLUListElement> event.element;
            const elParent = <HTMLUListElement> el.parentElement;
            this.calculatePosition(el, elParent);
        }
    }

    calculatePosition(overlay: HTMLElement, target: HTMLElement) {
        if (overlay) {
            const { left, top } = target.getBoundingClientRect();
            const [vWidth, vHeight] = [window.innerWidth, window.innerHeight];
            const [oWidth, oHeight] = [overlay.offsetWidth, overlay.offsetHeight];
            const scrollbarWidth = DomHandler.calculateScrollbarWidth();
            const topbarEl = document.querySelector('.layout-topbar') as HTMLElement;
            const topbarHeight = topbarEl?.offsetHeight || 0;
            // reset
            overlay.style.top = '';
            overlay.style.left = '';
      
            if (this.layoutService.isHorizontal()) {
                const width = left + oWidth + scrollbarWidth;
                overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
            } else if ( this.layoutService.isSlim() || this.layoutService.isSlimPlus()) {
                const topOffset = top - topbarHeight;
                const height = topOffset + oHeight + topbarHeight;
                overlay.style.top = vHeight < height ? `${topOffset - (height - vHeight)}px` : `${topOffset}px`;
            }
        }
    }

    itemClick(event: Event, routerLink? ) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        if (this.root && this.isSlim || this.isHorizontal || this.isSlimPlus) {
            this.layoutService.state.menuHoverActive = !this.layoutService.state.menuHoverActive;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;

            if (this.root && this.active && (this.isSlim || this.isHorizontal || this.isSlimPlus)) {
                this.layoutService.onOverlaySubmenuOpen();
            }
        }
        else {
            if (this.layoutService.isMobile()) {
                this.layoutService.state.staticMenuMobileActive = false;
            }

            if (this.isSlim || this.isHorizontal || this.isSlimPlus) {
                this.menuService.reset();
                this.layoutService.state.menuHoverActive = false;
            }
        }

        this.menuService.onMenuStateChange({key: this.key});
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && (this.isSlim || this.isHorizontal || this.isSlimPlus) && this.layoutService.isDesktop()) {
            if (this.layoutService.state.menuHoverActive) {
                this.active = true;
                this.menuService.onMenuStateChange({key: this.key});
            }
        }
    }

    get submenuAnimation() {
        if (this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim()|| this.layoutService.isSlimPlus()))
            return this.active ? 'visible' : 'hidden';
        else
            return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    get isHorizontal() {
        return this.layoutService.isHorizontal();
    }

    get isSlim() {
        return this.layoutService.isSlim();
    }
    get isSlimPlus() {
        return this.layoutService.isSlimPlus();
    }

    @HostBinding('class.active-menuitem') 
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
