import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
  selector: 'dg-company-relations-tree',
  templateUrl: './company-relations-tree.component.html',
  styleUrls: ['./company-relations-tree.component.scss']
})
export class CompanyRelationsTreeComponent implements OnInit {

	treeOrientation: any = 'horizontal';

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	currentPlan: unknown;
	companyName: string;
	
	pTreeBoolean: boolean = true;
	hideCompanyRelationsTreeData: boolean = false;
	showCompanyRelationsModalBool: boolean = false;

	companyRelationsData: TreeNode[];
	msgs = [];
	directorsData: any = {
		id: undefined,
		name: undefined,
		role: undefined
	};

	constructor (
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private activatedRoute: ActivatedRoute,
		private titlecasePipe: TitleCasePipe,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) {
		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: 'Relations' }
		// 	]
		// );
		
	}

	ngOnInit() {
		if (sessionStorage.getItem("relationData") === undefined || sessionStorage.getItem("relationData") === null || sessionStorage.getItem("relationData") == "undefined") {

			this.pTreeBoolean = true;

			this.currentPlan = this.userAuthService?.getUserInfo('planId');
			this.directorsData.id = this.activatedRoute.snapshot.params['directorsId'];
			this.directorsData.name = this.activatedRoute.snapshot.params['directorsName'];
			this.directorsData.role = this.activatedRoute.snapshot.params['officerRole'];

			let regex = /-/g;
			this.companyName = this.titlecasePipe.transform(this.directorsData.name).replace(regex, ' ');
			
			this.title = this.companyName + ' | ' + this.directorsData.id;
			this.seoService.setPageTitle(this.title);

			this.description = ' Get company detailed information of ' + this.companyName + ' - ' + this.directorsData.id + ' from Companies House including financial report, registered business address, accounts, charges, annual return, directors offices etc.'
			this.seoService.setDescription(this.description);

			if (this.directorsData.role !== undefined) {
				if (this.directorsData.role.toString().toLowerCase().includes("company")) {
					this.companyRelationsData = [
						{

							label: this.titlecasePipe.transform(this.directorsData.name).replace( regex, ' ' ),
							data: this.directorsData.id,
							expandedIcon: "ui-icon-business",
							collapsedIcon: "ui-icon-business",
							children: [{}]
						}
					];
				} else {
					this.companyRelationsData = [
						{
							label: this.titlecasePipe.transform(this.directorsData.name).replace( regex, ' ' ),
							data: this.directorsData.id,
							expandedIcon: "ui-icon-person",
							collapsedIcon: "ui-icon-person",
							children: [{}]
						}
					];
				}
			} else {
				this.companyRelationsData = [
					{
						label: this.titlecasePipe.transform(this.directorsData.name).replace( regex, ' ' ),
						data: this.directorsData.id,
						expandedIcon: "ui-icon-person",
						collapsedIcon: "ui-icon-person",
						children: [{}]
					}
				];
			}

		} else {
			this.companyRelationsData = JSON.parse(sessionStorage.getItem("relationData"));
			sessionStorage.setItem("relationData", JSON.stringify(this.companyRelationsData));

			this.pTreeBoolean = false;
			this.companyRelationsData.forEach((link) => {
				link.data.forEach((node) => {
					this.expandRecursive(node, true);
				});
			});
		}

	}

	private expandRecursive( node: TreeNode, isExpand: boolean ) {
		if ( node.children ) {
			node.expanded = isExpand;
			node.children.forEach(childNode => {
				this.expandRecursive( childNode, isExpand );
			});
		}
	}

	getCompanyRelationsTreeDataOnNodeExpand( event ) {
		
		this.sharedLoaderService.showLoader();
        if ( event.node ) {
            if (event.node.data == undefined) {
				 let reqobj = [ event.node.label ];
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyDetailsByCmpName', reqobj ).subscribe( res => {
                    event.node.children = res.body;
					this.sharedLoaderService.hideLoader();
                });
            } else {
                if ( event.node.data.length == 8 ) {
					let reqobj = [ event.node.data ];
					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyDetailsByCmpName', reqobj ).subscribe( innerRes => {
						this.sharedLoaderService.hideLoader();
						if( innerRes.status == 200 ){
							event.node.children = innerRes.body;
							event.node.children =  event.node.children.sort( (a, b) => {
								if(a.status == 'Active') return -1;
								else return 1;
							});
							event.node.children =  event.node.children.sort( (a, b) => {
								if(a.status == 'Inactive') return -1;
								else return 1;
							});
						} else {
							this.msgs = [];
							event.node.children = []
							this.msgs.push({ severity: 'error', summary: "No result found." });
							setTimeout(() => {
								this.msgs = [];
							}, 2000);
						}
                    });
                } else {
					let reqObj = [ event.node.data ];
                    this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_API', 'relatedCompanyToDirector', reqObj ).subscribe( data => {
                        event.node.children = data.body.results;
						
						this.sharedLoaderService.hideLoader();
                        event.node.children =  event.node.children.sort( (a, b) => {
                            if(a.companyStatus == 'live') return -1;
                            else return 1;
                        });
                    });
                }
            }
        }
    }

	changeTreeOrientation() {

		if ( this.treeOrientation == 'horizontal' ) {
			this.treeOrientation = 'vertical';

		} else if ( this.treeOrientation == 'vertical' ) {
			this.treeOrientation = 'horizontal';
		}

	}

	expandTreeOnSelectingNode( event ) {
       
        if( event.originalEvent.toElement ) {
            if(event.originalEvent.toElement.outerHTML.includes("span")){
                
                if (event.node.expanded !== undefined) {
                    if (event.node.expanded == true) {
                        event.node.expanded = false;
                    } else {
                        this.getCompanyRelationsTreeDataOnNodeExpand(event);
                        event.node.expanded = true;
                    }
                } else {
                    this.getCompanyRelationsTreeDataOnNodeExpand(event);
                    event.node.expanded = true;
                }
            }
        }
    }

	expandMeetMeTreeOnSelectingNode(event) {
		if (event.originalEvent.toElement && event.originalEvent.toElement.outerHTML.includes("span")) {
			event.node.expanded = true;
			if (event.node.expanded !== undefined) {
				if (event.node.expanded == true) {
					event.node.expanded = false;
				} else {
					event.node.expanded = true;
				}
			} else {
				event.node.expanded = true;
			}
		}
	}

	removeHyphen(str) {
		return str.replace(/-/g, ' ');
	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

}
