import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

@Component({
	selector: 'dg-automation-scheduler',
	templateUrl: './automation-scheduler.component.html',
	styleUrls: ['./automation-scheduler.component.scss']
})
export class AutomationSchedulerComponent implements OnInit {

	@ViewChild('editSchedulerForm', { static: false }) editSchedulerForm: NgForm;

	msgs: Message[] = [];
	SchedulerFilterDialogBoolean: boolean = false;	
	description: string = '';

	schedulerFilterCols: any;
	limitsDetailsForEmailsData: any;

	displayEditDialog: boolean = undefined;

	schedulerNameData: any;
	schedulerTimeData: any;
	selectedSchedulerTime: any;
	limitData: any;
	saveSchedulerData: boolean = undefined;
	listId: any = undefined;
	title: any;
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		private userAuthService: UserAuthService,
		public commonService: CommonServiceService,
		private confirmationService: ConfirmationService,
		private globalServerCommunication: ServerCommunicationService,
		private seoService: SeoService
	) {
		this.schedulerTimeData = [
			{ label: 'Daily', key: 'daily' },
			{ label: 'Weekly', key: 'weekly' },
			{ label: 'Monthly', key: 'monthly' },
			{ label: 'Yearly', key: 'yearly' },
		];
	}

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.initBreadcrumbAndSeoMetaTags();		
		this.schedularList();

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Automation Scheduler', routerLink: ['scheduler/automation-scheduler'] }
		// ]);

		this.title = "DataGardener Automation Scheduler - Automated by Admin users";
		this.description = "Details information about Daily automated task.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	schedularList() {

		this.schedulerFilterCols = [
			{ field: 'jobName', header: 'List Name', width: '100px', textAlign: 'left' },
			{ field: 'chipData', header: 'Search Criteria', width: '120px', textAlign: 'left' },
			{ field: 'initialSearchRecords', header: 'Initial Search Records', width: '40px', textAlign: 'center' },
			{ field: 'schedulerFrequency', header: 'Scheduler Time', width: '40px', textAlign: 'center' },
			{ field: 'previousCompaniesCount', header: 'Previous Companies Count', width: '40px', textAlign: 'center' },
			{ field: 'currentRunDate', header: 'Last Run Date', width: '50px', textAlign: 'center' },
			{ field: 'currentCompaniesCount', header: 'Current Companies Count', width: '40px', textAlign: 'center' },
			{ field: 'creationDate', header: 'Creation Date', width: '50px', textAlign: 'center' },
			{ field: 'updationDate', header: 'Updation Date', width: '50px', textAlign: 'center' },
			{ field: 'action', header: 'Action', width: '80px', textAlign: 'center' },
		];

		// const userId = this.userAuthService?.getUserInfo('dbID');

		// if ( userId ) {
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_JOB_SCHEDULER_API', 'getJobByUserIdApi' ).subscribe( res => {
					if (res.body.status == 200) {
						this.limitsDetailsForEmailsData = res.body.result
						for ( let emailData of this.limitsDetailsForEmailsData ) {
							emailData.chipData = JSON.parse(emailData.chipData)
						}						
					} else {
						this.limitsDetailsForEmailsData = [];
					}

				});
		// }
	}

	editDialogOpen(data) {
		this.selectedSchedulerTime = data.schedulerFrequency;
		this.schedulerNameData = data.jobName;
		this.limitData = data.listLimit;
		this.listId = data._id;
		this.displayEditDialog = true;

	}

	editScheduler(formData: NgForm) {
		this.displayEditDialog = false;
		let obj = {
			id: this.listId,
			jobName: formData.value.schedulername,
			limit: parseInt(formData.value.limit),
			schedulerFrequency: formData.value.schedulertime,
			userId: this.userAuthService?.getUserInfo('dbID')
		}

		
		this.globalServerCommunication.globalServerRequestCall( 'put', 'DG_JOB_SCHEDULER_API', 'updateJobApi', obj ).subscribe( res => {
			if (res.body.status == 200) {
				this.message('info', 'Updated', 'Record updated');
			} else {
				this.message('error', 'Error', 'Something went wrong');
			}
		})
	}

	deleteScheduler(data) {
		this.confirmationService.confirm({
			message: 'Do you want to delete this record?',
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.globalServerCommunication.globalServerRequestCall( 'delete', 'DG_JOB_SCHEDULER_API', 'DG_JOB_SCHEDULER_API', data._id ).subscribe( res => {
				// .then(data => {
					let data = res.body;
					if (data.status == 200) {
						this.message('info', 'Confirmed', data.result)
						this.ngOnInit()
					} else {
						this.message('error', 'Error', 'Something went wrong');
					}
				})
			},
			reject: () => {
				this.message('error', 'Rejected', 'You have rejected')
			}
		});
	}

	stopScheduler(data) {
		this.confirmationService.confirm({
			message: 'Do you want to stop the scheduler?',
			header: 'Stop Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.message('info', 'Confirmed', 'Scheduler stop')
			},
			reject: () => {
				this.message('error', 'Rejected', 'You have rejected')
			}
		});
	}

	arraytoString(array) {
		return array.join(', ');
	}

	message(severity, summary, detail) {
		this.msgs = [({ severity: severity, summary: summary, detail: detail })];
		setTimeout(() => {
			this.msgs = [];
		}, 3000);
	}

}
