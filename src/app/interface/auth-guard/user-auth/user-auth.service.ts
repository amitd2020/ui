import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, lastValueFrom, of, pluck, map } from "rxjs";
import { ServerCommunicationService } from "../../service/server-communication.service";
import { UserAddOnType, UserFeaturesType, UserInfoType, UserRolesType } from "./user-info";
import { SharedLoaderService } from "../../view/shared-components/shared-loader/shared-loader.service";
import { AuthGuardService } from "../auth-guard.guard";

enum SubscriptionPlans {
	'Start' = '5e78ea0b7851f505bc7141a8',
	'Monthly_Expand_Paid_Test' = '5fb6193363e4125634f68e87',
	'Monthly_Expand' = '5e8762a0cc486a029895cfc3',
	'Annually_Expand' = '5ea68b76d9015856f85f550c',
	'Monthly_Enterprise' = '5ea577bddc13f4465c7f3a95',
	'Annually_Enterprise' = '5ea68be2d9015856f85f550d',
	'Enterprise_Conversion_For_Ravi' = '5d0a3263f78d424990e24be5',
	'Monthly_Enterprise_Paid_Test' = '5fb619aa63e4125634f68e88',
	'Enterprise_Annual_One_Year' = '6056675c4a22712ea86388bf',
	'Enterprise_Annual_Two_Year' = '603df6c343eb4e43f0b030fd',
	'Enterprise_New_Monthly' = '6056663b4a22712ea86388be',
	'Expand_Annual_One_Year' = '605662dd4a22712ea86388bd',
	'Expand_Annual_Two_Year' = '603e2b25b3f9675980e37474',
	'Expand_New_Monthly' = '605660e94a22712ea86388bc',
	'Premium_Annual_One_Year' = '60583a9b7059320ed84d181d',
	'Premium_Annual_Two_Year' = '60583add7059320ed84d181e',
	'Premium_New_Monthly' = '60583a537059320ed84d181c',
	'Valentine_Special' = '6200f0134e5687643a5dc7b5',

    'Expand_Weekly_Trial' = '5f4a11d9df0a895288540b9c',
    'Enterprise_Weekly_Trial' = '5f4a1249df0a895288540b9d',
    'Monthly_Expand_Trial' = '5f574b5ec71b033370a32bd6',
    'Monthly_Enterprise_Trial' = '5eb2c4f10632bc3abc81c227',
    'Annually_Expand_Trial' = '5f574bd5c71b033370a32bd7',
    'Annually_Enterprise_Trial' = '5f08689116f8ca0cc39eed11' 
}

const TrialPlans = [
    '623b0f3e7b35e3932cc2baa9', // Expand_Trial_48_Hours
    '6055da66630f50347cc5b15e', // Enterprise_Trial_48_Hours
    '623b0e697b35e3932cc2baa8', // Premium_Trial_48_Hours
    '682441711f56293e91e41ed6', // New_Trial_Plan
];

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    envServer: 'dev' | 'preprod' | 'main' = 'main';

	private isLoggedInSubject = new BehaviorSubject< boolean >( false );
	isLoggedInSubject$ = this.isLoggedInSubject.asObservable();

	private userAuthInfo = new BehaviorSubject< UserInfoType >( null );
	userAuthInfo$ = this.userAuthInfo.asObservable();

    private featureOnlyNamesPermissions: Array< string > = [];
    private featureWithGroupPermissions: Array< Partial< UserFeaturesType > > = [];
    private addOnPermissions: Array< keyof UserAddOnType > = [];
    private addOnPermissionsPublic: UserAddOnType = {};

    public featureLockIconPath: string = 'assets/layout/images/featureLock.svg';
    public featureLockIconValentine: string = 'assets/layout/images/valentineLock.svg';

    constructor(
        private serverCommunicationService: ServerCommunicationService,
        private sharedLoaderService: SharedLoaderService,
        private authGuardService: AuthGuardService
    ) {

        const LocationHostname = window.location.hostname.split('.');

        if ( [ 'localhost', 'dev', 'ir' ].includes( LocationHostname[0] ) ) {
            this.envServer = 'dev';
        } else if ( LocationHostname[0] === 'preprod' ) {
            this.envServer = 'preprod';
        }

        if ( localStorage.getItem( 'isLoggedIn' ) ) {
            this.updateLoginStatus( true );
        } else {
            this.updateLoginStatus( false );
        }
    }

	public async updateLoginStatus( loginStatus: boolean ) {
        this.sharedLoaderService.showLoader();
        
        if ( loginStatus ) {

            let authInfo: { userAuth: UserInfoType, features: { featureNamesOnly?: Array<string>, featureNamesWithGroup?: Array< { pageNameDescription: string, description: string } > }, addOns: Array< keyof UserAddOnType > } = {
                userAuth: null,
                features: {},
                addOns: []
            };

            if ( localStorage.getItem('authInfo') ) {
                authInfo = JSON.parse( localStorage.getItem('authInfo') );
            } else {
                const { userAuth, features, addOns } = await this.getUserAuthDetails();
                authInfo = { userAuth, features, addOns };
                localStorage.setItem( 'authInfo', JSON.stringify( authInfo ) );
            }

            this.updateUserAuthInfo( authInfo.userAuth );
            this.addOnPermissions = authInfo.addOns;

            if ( authInfo.features?.featureNamesOnly ) {
                this.featureOnlyNamesPermissions = authInfo.features.featureNamesOnly;
            }

            if ( authInfo.features?.featureNamesWithGroup ) {
                this.featureWithGroupPermissions = authInfo.features.featureNamesWithGroup;
            }

            this.authGuardService.sessionTimeoutIndicator = 0;

            if ( authInfo.userAuth?.sessionExp ) {
                this.authGuardService.sessionHandler( authInfo.userAuth.sessionExp );
            }

        }
        
		this.isLoggedInSubject.next( loginStatus );
        this.sharedLoaderService.hideLoader();

	}

    public updateUserAuthInfo( args: Partial< UserInfoType > ) {
        this.userAuthInfo.next( { ...this.userAuthInfo.value, ...args } );
    }

	private async getUserAuthDetails(): Promise<any> {

        this.serverCommunicationService.globalServerRequestCall('get', 'DG_LOGIN', 'userAuthorizationNew').subscribe( res => {
            localStorage.setItem( 'filter', JSON.stringify(res.body.response.filters))
            localStorage.setItem( 'preferences', JSON.stringify(res.body.response.preferences))
            localStorage.setItem( 'sidebar', JSON.stringify(res.body.response.sidebar))
            localStorage.setItem( 'addons', JSON.stringify(res.body.response.addons))
            localStorage.setItem( 'types', JSON.stringify(res.body.response.types))
        } )

		let userAuthResponse = await lastValueFrom( this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_LOGIN', 'userAuthorization' )
            .pipe(
                pluck( 'body', 'results' ),
                map( async ( userAuth: UserInfoType ) => {
                    let features: { featureNamesOnly?: Array<string>, featureNamesWithGroup?: Array< { pageNameDescription: string, description: string } > } = {};

                    userAuth.isTrial = TrialPlans.includes( userAuth.planId ) || false;

                    if ( userAuth.userRole === 'Client User' && userAuth.teamId ) {
                        const { featureNamesOnly, featureNamesWithGroup } = await this.getUserFeaturesPermissions( userAuth.teamId );
                        features = { featureNamesOnly, featureNamesWithGroup };
                    } else {
                        const { featureNamesOnly, featureNamesWithGroup } = await this.getUserFeaturesPermissions();
                        features = { featureNamesOnly, featureNamesWithGroup };
                    }

                    const addOns = await this.getUserAddOnPermissions();

                    return { userAuth, features, addOns };
                }),
                catchError( err => {
                    console.log( err );
                    return of( err );
                })
            )
        )

        return userAuthResponse;
	}

    private async getUserFeaturesPermissions( teamId?: string ): Promise< { featureNamesOnly: Array<string>, featureNamesWithGroup: Array< { pageNameDescription: string, description: string } > } > {

        let endPoint = 'userFeatures';

        if ( teamId ) {
            endPoint = 'userTeamFeatures';
        }

        const featuresResponse$ = this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_FEATURES', endPoint ).pipe(
            map( ( { body: { results } } ) => {
                let filteredResults = results.filter( ( feature: UserFeaturesType ) => feature.featureEnabled );

                let featureNamesOnly = filteredResults.map( ( feature: UserFeaturesType ) => feature.pageNameDescription );
                let featureNamesWithGroup = filteredResults.map( ( { pageNameDescription, description }: Partial<UserFeaturesType> ) => {
                    return { pageNameDescription, description }
                });

                return { featureNamesOnly, featureNamesWithGroup };
            }),
            catchError( err => {
                console.log( err );
                return of( err );
            })
        );

        const userFeaturesResponse = await lastValueFrom( featuresResponse$ );

        return userFeaturesResponse;
    }

    private async getUserAddOnPermissions(): Promise< Array< keyof UserAddOnType > > {
        const userAddOnResponse = await lastValueFrom( this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_ADDON_API', 'getAddOnFilters' )
            .pipe(
                map( ( { body: { results } } ): Array< keyof UserAddOnType > => {
                    this.addOnPermissionsPublic = results;
                    
                    let filteredResults = Object.keys( results as UserAddOnType ).filter( ( addOnKey: keyof UserAddOnType ) => {
                        if ( ![ 'userId', '_v', '_id' ].includes( addOnKey ) ) {
                            return results[ addOnKey ];
                        }
                    });
                    return filteredResults as Array< keyof UserAddOnType > || [];
                })
            )
        );

        return userAddOnResponse;
    }

    public getUserInfo( keyName?: keyof UserInfoType ): Partial< UserInfoType > {
        let userInfoValues: Partial< UserInfoType > | unknown;

        if ( this.userAuthInfo.value ) {

            if ( keyName ) {
                userInfoValues = this.userAuthInfo.value[ keyName ];
                return userInfoValues;
            }

            userInfoValues = this.userAuthInfo.value;
        }

        return userInfoValues;
    }

    public get getUserAddOnList(): UserAddOnType {
        return this.addOnPermissionsPublic;
    }

    public hasRolePermission( userRolesInput: UserRolesType[] ): boolean {
        if ( !this.isLoggedInSubject.value || !userRolesInput || !userRolesInput?.length ) {
            return false;
        }

        const { userRole, email } = this.getUserInfo();

        if ( !userRole ) {
            return false;
        }

        if ( userRole === 'Super Admin' && email == 'developers@tecdune.com' && userRolesInput.includes( 'Under Development' ) ) {
            return true;
        }

        if ( userRole === 'Super Admin' && email !== 'developers@tecdune.com' && userRolesInput.includes( userRole ) ) {
            return true;
        }

        return userRolesInput.includes( userRole );
    }

    public hasFeaturePermission( featureName: string, featureGroup?: string ): boolean {
        if ( !this.isLoggedInSubject.value ) {
            return false;
        }

        if ( this.hasRolePermission( ['Super Admin'] ) ) {
            return true;
        }

        if ( featureGroup ) {
            let featureMatched: Partial< UserFeaturesType >;
            featureMatched = this.featureWithGroupPermissions.find( item => ( ( item.description == featureGroup ) && ( item.pageNameDescription == featureName ) ) );

            return !!( featureMatched );
        } else {
            return this.featureOnlyNamesPermissions.includes( featureName );
        }
    }

    public hasAddOnPermission( addOnKey: keyof UserAddOnType ): boolean {
        if ( !this.isLoggedInSubject.value ) {
            return false;
        }

        if ( this.hasRolePermission( ['Super Admin'] ) ) {
            return true;
        }
        
        return this.addOnPermissions.includes( addOnKey );
    }

    public hasWildCardPermission( wildCardKey: { companyNumber?: string, [key: string]: unknown } ): boolean {
        if ( !this.isLoggedInSubject.value || !wildCardKey || !Object.keys( wildCardKey ).length ) {
            return false;
        }

        if ( this.hasRolePermission( ['Super Admin'] ) ) {
            return true;
        }

        const { companyNumber } = wildCardKey;
        
        if ( companyNumber ) return this.getUserInfo() ? this.getUserInfo()?.companyNumber == companyNumber : false;

        return false;
    }

}