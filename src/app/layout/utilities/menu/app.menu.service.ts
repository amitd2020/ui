import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from '../../api/menuchangeevent';
import { CountryCodeType, ExtendedMainMenuItems } from 'src/app/interface/auth-guard/user-auth/user-info';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
// import { MenuItemIndex } from './menu-item.index';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    constructor(
        private userAuthService: UserAuthService
    ) {}

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    getAllMenuItems(){
        let menuItemsIndex = JSON.parse(localStorage.getItem('sidebar'));
        if( menuItemsIndex ) {
            menuItemsIndex = this.filterAccessibleMenuItems( menuItemsIndex );
            return menuItemsIndex;
        }
    }

    getCountryFilteredMenuItems( countryCode ){
        let menuItemsIndex = JSON.parse(localStorage.getItem('sidebar'));
        
        // menuItemsIndex = menuItemsIndex.filter( menu => {
        //     if ( menu?.items && menu?.items?.length ) {
        //         menu.items = menu.items.filter( item => ( item?.accessType == 'public' ) ||  item?.countryAccess?.includes( countryCode ) );
        //     }
        //     return ( menu.accessType === 'public' ) || menu?.countryAccess.includes( countryCode );
        // });

        menuItemsIndex = this.filterAccessibleMenuItems( menuItemsIndex );
        
        return menuItemsIndex;
    }

    getPublicMenuItems() {
        let menuItemsIndex = JSON.parse(localStorage.getItem('sidebar'));

        if ( menuItemsIndex ) {
            menuItemsIndex = menuItemsIndex.filter( menu => {
                if ( menu.accessType === 'public' && menu?.items && menu?.items?.length ) {
                    menu.items = menu.items.filter( item => item.accessType === 'public' );
                }
                return menu.accessType === 'public';
            });
        }
        return menuItemsIndex;
    }

    filterAccessibleMenuItems( inputMenuIndex ) {
        let menuItems: [];

        if( inputMenuIndex ) {

            menuItems = inputMenuIndex.filter( ( filterItem ) => {
    
                const { items, roles, addOnCheck, wildCardCheck } = filterItem;
    
                if ( items && items.length ) {
                    filterItem.items = this.filterAccessibleMenuItems( filterItem.items );
                }
    
                if ( wildCardCheck ) {
                    return this.userAuthService.hasWildCardPermission( wildCardCheck );
                }
    
                if ( roles && roles.length ) {
                    return this.userAuthService.hasRolePermission( roles );
                }
    
                if ( addOnCheck ) {
                    return this.userAuthService.hasAddOnPermission( addOnCheck );
                }
    
                if ( filterItem?.items && filterItem?.items.length == 0 ) {
                    return false;
                }
    
                return true;
            });
        }

        
        return menuItems;
    }
}
