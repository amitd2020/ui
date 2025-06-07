import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { ConfirmationService } from 'primeng/api';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-company-branding-image',
	templateUrl: './company-branding-image.component.html',
	styleUrls: ['./company-branding-image.component.scss']
})

export class CompanyBrandingImagesComponent implements OnInit {

	@ViewChild('companyLogoImage') companyLogoImage: FileUpload;
	@ViewChild('companyCoverImage') companyCoverImage: FileUpload;

	@Input() isLogoAndCoverDisabled: boolean;

	logoSectionCard: boolean = true;
	imageBasedataAvailable: boolean = false;
	uploadCompanyLogoMessage = [];
	userDetails: Partial< UserInfoType > = {};
	// companyName: string='';
	// companyNumber: string='';
	// userId:any;
	imageId:any;
	paramForDeletingLogoAndCoverImage: Array<any> = [];
	logoImage:string = '';
	coverImage:string = '';
	userLogoImageFromAPI : string ='';
	userCoverImageFromAPI : string ='';
	logoAndCoverImageObj: object = {};
	// isLogoAndCoverDisabled:boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private globalServerCommunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private confirmationService: ConfirmationService

	) { }

	ngOnInit() {

		this.userDetails = this.userAuthService?.getUserInfo();

		// if ( !this.userDetails?.companyNumber || this.userDetails?.companyNumber == ' ' ) {
		// 	this.isLogoAndCoverDisabled = true;
		// 	this.logoSectionCard = true;
		// }

		if ( this.userDetails?.companyNumber && this.userDetails?.companyNumber !== ' ' ) {
			this.getImageDetailByUserId();
		}

	}

	onSelect(e, eventFrom ) {
		this.logoAndCoverImageObj[eventFrom] =  e.currentFiles[0]
		this.logoImage =  this.logoAndCoverImageObj['companyLogoImage'];
		this.coverImage = this.logoAndCoverImageObj['companyCoverImage'];
	}

	uploadCompanyCoverAndLogoImage() {

		this.sharedLoaderService.showLoader();


		if( !this.logoImage || !this.coverImage ) {
			
			this.uploadCompanyLogoMessage = [];
			this.uploadCompanyLogoMessage.push({ severity: 'error', summary: 'Please select both images.' });
			this.sharedLoaderService.hideLoader();
			setTimeout(() => {
				this.uploadCompanyLogoMessage = [];
			}, 1500);
			return;
		}

		let formDataToSend = new FormData();
		formDataToSend.append( 'logoImage', this.logoImage );
		formDataToSend.append( 'coverImage', this.coverImage );
		formDataToSend.append( 'companyName', this.userDetails?.companyName );
		formDataToSend.append( 'companyNumber', "" );
		formDataToSend.append( 'userId', this.userDetails?.dbID );

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'userImageUpload', formDataToSend ).subscribe({

			next: ( res ) => {
				
				if( res.status == 200 ) {
					this.uploadCompanyLogoMessage = [];
					this.uploadCompanyLogoMessage.push({ severity: 'success', summary: res.body.message });
					this.imageBasedataAvailable = true;
					this.getImageDetailByUserId();
				}
				setTimeout(() => {
					this.uploadCompanyLogoMessage = [];
					this.sharedLoaderService.hideLoader();

				}, 1500);
			},

			error: ( err ) => {
				console.log('err ->',err);
				this.sharedLoaderService.hideLoader();
			}

		});

		this.getImageDetailByUserId();

		setTimeout(() => {
			this.logoSectionCard = false;
			this.onRemove();
		}, 500);
	}	

	getImageDetailByUserId(){

		// let queryParam = [
		// 	{ key: 'userId', value: this.userDetails?.dbID }
		// ]

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getImageDetailByUserId' ).subscribe({

			next: ( res ) => {
				this.imageId = res.body.result?._id;	//Image Id value update to use in Delete API Section Payload.
				if( res.body.status == 200  ) {
					this.userLogoImageFromAPI = res.body.result?.logoImageDataUri;
					this.userCoverImageFromAPI = res.body.result?.coverImageDataUri;
					if ( this.userLogoImageFromAPI && this.userLogoImageFromAPI ) {
						this.logoSectionCard = false;
						this.imageBasedataAvailable = true
					}
				}
			},

			error: ( err ) => {
				console.log( err );
			}

		})

	}

	deleteLogoAndCoverImage() {

		this.paramForDeletingLogoAndCoverImage[0] = this.imageId;
		// this.paramForDeletingLogoAndCoverImage[1] = this.userDetails?.dbID;

		this.globalServerCommunicate.globalServerRequestCall( 'delete', 'DG_USER_API', 'deleteBrandingImages', this.paramForDeletingLogoAndCoverImage ).subscribe({
			next:( res ) => {
				this.uploadCompanyLogoMessage = [];
				this.uploadCompanyLogoMessage.push({ severity: 'error', summary: res.body.message });
				setTimeout(() => {
					this.uploadCompanyLogoMessage = [];
				}, 500);
			},
			error: ( err ) => {
				console.log(err);
			}
		})
	}

	preventUpload( event ) {
		event.preventDefault();
		event.stopPropagation();
	}

	onRemove() {
		this.logoImage = '';
		this.coverImage = '';
		this.companyLogoImage.clear();
		this.companyCoverImage.clear();
	}

	defaultLogoBoolCheck(){

		this.logoSectionCard = true;
		this.imageBasedataAvailable = false;

	}

	logoAndCoverImagedeleteConfirmation() {
        this.confirmationService.confirm({
            message: 'Do you want to delete uploaded image?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.deleteLogoAndCoverImage()
				this.defaultLogoBoolCheck()
            },
        });
    }

}