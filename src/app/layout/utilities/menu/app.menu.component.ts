import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { subscribedPlan } from 'src/environments/environment';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import {
    CountryCodeType,
    ExtendedMainMenuItems,
    UserInfoType,
} from 'src/app/interface/auth-guard/user-auth/user-info';
import { MenuService } from './app.menu.service';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { LayoutService } from '../../service/app.layout.service';
import { sidebarMenuItemRoutes } from './menu-item.index';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styles: [
        `
            :host ::ng-deep {
                // #5fbeb5
                // .p-accordion {
                // 	p-accordiontab,
                // 	p-accordiontab:first-child,
                // 	p-accordiontab:last-child {
                // 		.p-accordion-tab {
                // 			margin: 0.4rem;
                // 			box-shadow: none;

                // 			.p-accordion-header {
                // 				.p-accordion-header-link,
                // 				.p-accordion-header-link:focus {
                // 					font-size: 0.9rem;
                // 					font-weight: 450;
                // 					padding: 0.7rem;
                // 				}
                // 			}
                // 	    }
                //     }
                // }

                p-panel {
                    cursor: pointer;
                    .p-panel {
                        .p-panel-header {
                            // background-color: #009688;
                            .p-panel-title {
                                font-weight: 500;
                                color: #657380;
                            }

                            // .p-panel-header-icon {
                            //     color: #fff;
                            // }
                        }
                    }

                    .p-panel {
                        .p-panel-title {
                            font-size: 1rem;
                        }
                    }
                }

                .keywordForSearchFilter {
                    margin: 0;
                    position: absolute;
                    top: 93px;
                    z-index: 1;
                    line-height: 2;
                    width: 94%;
                    box-shadow: 0px 10px 15px 0px rgb(0 0 0 / 40%);
                    background-color: #1ab394;

                    ul {
                        overflow: hidden;
                        list-style: none;
                        padding-left: 8px;

                        li {
                            a,
                            p {
                                color: #fff;
                                text-overflow: ellipsis;
                                * {
                                    pointer-events: none;
                                }

                                ::ng-deep {
                                    .c-green {
                                        color: #ffd400 !important;
                                    }
                                }
                            }
                        }

                        li:hover {
                            border-top-width: 1px !important;
                            border-top-style: solid;
                            border-bottom-width: 1px !important;
                            border-bottom-style: solid;
                            border-color: #fccc55;
                            transform: scale(1.03);
                        }
                    }

                    .p-scrollPanel {
                        max-height: 200px; /* Set the maximum height of the scroll panel */
                        width: 100%;
                        overflow-y: auto; /* Enable vertical scrolling */
                        overflow-x: hidden; /* Hide horizontal scrolling */
                    }

                    .p-scrollpanel-bar {
                        background-color: #fff;
                        opacity: 0.8;
                        transition: background-color 0.2s;

                        &:hover {
                            opacity: 1;
                        }
                    }

                    .noResults {
                        p {
                            padding: 10px;
                            margin: 0;
                            color: #fff;
                        }
                    }
                }
            }
        `,
    ],
})
export class AppMenuComponent
    extends UnsubscribeSubscription
    implements OnInit, AfterContentChecked
{
    subscribedPlanModal: any = subscribedPlan;
    filteredMenuItems: ExtendedMainMenuItems[] = [];
    isLoggedIn: boolean = false;
    searchText: string = '';
    searchInFilterInputKeyword: Array<any> = [];
    expandedIndex: Array<number> = [ 0 ];
    selectedMenuItem: Object = {};

    constructor(
        public app: AppComponent,
        private menuService: MenuService,
        public layoutService: LayoutService,
        private userAuthService: UserAuthService,
        private cdref: ChangeDetectorRef,
        public router: Router
    ) {
        super();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngOnInit() {
        this.userAuthService.isLoggedInSubject$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((loggedIn: boolean) => {
                this.isLoggedIn = loggedIn;

                if (this.isLoggedIn) {
                    const selectedGlobalCountry = localStorage.getItem(
                        'selectedGlobalCountry'
                    ) as CountryCodeType;

                    if (
                        selectedGlobalCountry &&
                        selectedGlobalCountry !== 'uk'
                    ) {
                        this.filteredMenuItems =
                            this.menuService.getCountryFilteredMenuItems(
                                selectedGlobalCountry
                            );
                    } else {
                        this.filteredMenuItems =
                            this.menuService.getAllMenuItems();
                    }

                    if( this.filteredMenuItems ) {
                        this.filteredMenuItems.map((menu) => {
                            const { items: menuItems } = menu;
                            menuItems.map((item) => {
                                const { listIdToken, queryParams } = item;
                                if (listIdToken && queryParams) {
                                    queryParams['cListId'] =
                                        this.userAuthService?.getUserInfo(
                                            listIdToken as keyof UserInfoType
                                        );
                                }
                            });
                        });
                    }
                } else {
                    this.filteredMenuItems =
                        this.menuService.getPublicMenuItems();
                }
            });

        this.setCollapsedValue( this.filteredMenuItems );
    }

    sendFilterItemsRawForSearch(searchArray) {
        this.searchInFilterInputKeyword = [];
        this.searchInFilterInputKeyword = searchArray;
    }

    highlightMatchedWords(realStr, toFindStr) {
        toFindStr = toFindStr.replace(
            /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
            ''
        );
        return realStr.replace(
            new RegExp(toFindStr, 'gi'),
            (match) => `<b class='c-green'>${match}</b>`
        );
    }

    goToSelectedFilterItem( selectedItem ) {
        const { parentIndex, childIndex } = selectedItem;
        this.selectedMenuItem = selectedItem;
        this.searchInFilterInputKeyword = [];
        this.searchText = '';
        if ( !this.expandedIndex.includes( parentIndex ) )  this.expandedIndex.push(parentIndex);
    }

    panelClicked( index ) {
        // this.expandedIndex = index;
        const position = this.expandedIndex.indexOf(index);
        if (position === -1) {
            this.expandedIndex.push(index);
        } else {
            this.expandedIndex.splice(position, 1);
        }
    }

    collapsedChange(filteredMenuItems, label) {
        filteredMenuItems.map( filteredItem => {
            if ( label == filteredItem['label'] ) {
                filteredItem['isPanelCollapsed'] = false;
            } else {
                filteredItem['isPanelCollapsed'] = true;
            }
            return filteredItem;
        });
    }

    setCollapsedValue( menuItem ) {
        
        menuItem?.filter( ( filterItem, i ) => { 
            let tempArray = Object.keys(sidebarMenuItemRoutes);
            // if ( filterItem.items.length ) {
                // filterItem.items.map( ( item, j ) => {
                    if ( filterItem?.['label'] == tempArray[i] ) {
                        if ( location.pathname == sidebarMenuItemRoutes?.[filterItem.label]?.[location.pathname] ) {
                            filterItem['isPanelCollapsed'] = false;
                        } else {
                            filterItem['isPanelCollapsed'] = true;
                        }
                    } else {
                        filterItem['isPanelCollapsed'] = true;
                    }
                // });
            // }
        });
    }

}
