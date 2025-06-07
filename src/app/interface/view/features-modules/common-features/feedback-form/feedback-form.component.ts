import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})

export class FeedbackFormComponent implements OnInit {

	feedbackDetails: any = {};
	questionData: any;

	answerData = [];
	feedbackAnswerData = [];
	answerData2 = [];

	showThankyouDiv: boolean = false;

	title: string = '';
	description: string = '';

	constructor (
		private router: Router,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {}

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_FEEDBACK', 'feedbackQuestionList' ).subscribe( res => {

			if ( res.body.status == 200 ) {

				this.questionData = res.body["result"]; 
				this.feedbackDetails["questionOne"] = this.questionData[0]["Question"];
				this.feedbackDetails["questionTwo"] = this.questionData[1]["Question"];
				this.feedbackDetails["questionThree"] = this.questionData[2]["Question"];
				this.feedbackDetails["questionFour"] = this.questionData[3]["Question"];
				this.feedbackDetails["questionFive"] = this.questionData[4]["Question"];
				this.feedbackDetails["questionSix"] = this.questionData[5]["Question"];
				this.feedbackDetails["questionSeven"] = this.questionData[6]["Question"];
				this.feedbackDetails["questionEight"] = this.questionData[7]["Question"];
				this.feedbackDetails["questionNine"] = this.questionData[8]["Question"];
				this.feedbackDetails["questionTen"] = this.questionData[9]["Question"];
				this.feedbackDetails["questionEleven"] = this.questionData[10]["Question"];
				this.feedbackDetails["questionTwelve"] = this.questionData[11]["Question"];
				this.feedbackDetails["questionThirteen"] = this.questionData[12]["Question"];
				this.feedbackDetails["questionFourteen"] = this.questionData[13]["Question"];
				this.feedbackDetails["questionFifteen"] = this.questionData[14]["Question"];
				this.feedbackDetails["questionSixteen"] = this.questionData[15]["Question"];
				this.feedbackDetails["questionSeventeen"] = this.questionData[16]["Question"];
				this.feedbackDetails["questionEighteen"] = this.questionData[17]["Question"];
				this.feedbackDetails["questionNineteen"] = this.questionData[18]["Question"];
				this.feedbackDetails["questionTwenty"] = this.questionData[19]["Question"];

			}
		});
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "Feedback" }
		// 	]
		// );
		this.title = "Please Share Your Valuable Feedback - DataGardener";
		this.description = "Share your experience and drawback with datagardener.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	feedbackDataArray( formData: NgForm ) {

		let answerTemp = formData.value;

		for (let key in answerTemp) {
			let obj = {};
			obj["code"] = key;
			obj["ANSWER"] = answerTemp[key];
			this.answerData.push(obj);
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'insertUserAccountPreferenceData', this.answerData ).subscribe( res => {
			if (res.body.status == 200) {
				this.showThankyouDiv = true;
			}

		});
	}
	
	gotToDashboard() {
		this.router.navigate(['/']);
	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 500);
	}

}
