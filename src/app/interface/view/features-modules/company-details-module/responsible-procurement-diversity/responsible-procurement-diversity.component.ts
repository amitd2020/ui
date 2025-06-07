import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../data-communicator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dg-responsible-procurement-diversity',
  templateUrl: './responsible-procurement-diversity.component.html',
  styleUrls: ['./responsible-procurement-diversity.component.scss']
})
export class ResponsibleProcurementDiversityComponent implements OnInit, OnDestroy {

	companyNumber: string;
	hasResponsibleProcurementData: boolean = false;

	childCommunicationSubscription: Subscription;

    segmentationByOwnershipStructure: any = {
		b_corp_certified_business: {
			label: "B Corp Certified Business",
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/b-corp-certified.png',
			colorVar: '--lightgreenRGB',
			infoMsg: 'Beyond Profit: Journey to B Corp Certification<br> Certified for Good: Highest Social & Environmental Standards<br> B Corp & Beyond: Driving Purpose-Driven Business Success<br> Balancing Purpose & Profit: B Corp Matters'
		},
		woman_owned_business: {
			label: 'Woman Owned Business',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/women-owned.png',
			colorVar: '--pinkRGB',
			infoMsg: 'Woman-Led, Impact-Driven: Empowering Business Through Female Leadership<br> Breaking Barriers: Thriving as a Female-Owned Enterprise<br> Leading with Innovation: The Power of Woman-Owned Businesses<br> Championing Woman in Business: Story & Commitment'
		},
		ethic_minority_business: {
			label: 'Ethnic Minority Business',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ethnic-minority.png',
			colorVar: '--violetRGB',
			infoMsg: 'Diversity in Action: Celebrating Ethnic Minority Leadership<br> Representation Matters: Driving Inclusion & Opportunity<br> Empowering Ethnic Minority Entrepreneurs & Professionals<br> Strength in Diversity: Fostering an Inclusive Business Landscape'
		},
		military_Veterans: {
			label: "Military Veterans",
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/military-veterans.png',
			colorVar: '--aquaRGB',
			infoMsg: 'From Service to Success: Empowering Military Veterans in Business<br> Veteran-Owned & Operated: Leadership, Integrity, and Innovation<br> Supporting Those Who Served: Championing Veteran Entrepreneurs<br> Mission-Driven: How Military Experience Fuels Business Excellence'
		}
	};
		
	missionSpectrumStructure: any = {
		registered_charitable_organization: {
			label: 'Registered Charitable Organization',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/registered-charitable-org.png',
			colorVar: '--skyblueRGB',
			infoMsg: 'Smiling volunteers serving food or distributing clothes, donation boxes.'
		},
		net_zero_target: {  
			label: 'Net-Zero Target',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/net-zero-target.png',
			colorVar: '--skyblueRGB',
			infoMsg: 'Our Path to Net Zero: Commitment, Action & Impact<br> Towards a Sustainable Future: Achieving Net Zero Emissions<br> Carbon Neutrality & Beyond: Net Zero Strategy<br> Reducing Our Footprint: Roadmap to Net Zero'
		},
		non_profit_organization: { 
			label: 'Non Profit Organization',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/non-profit-org.png',
			colorVar: '--brownRGB',
			infoMsg: 'Entity that operates for social, charitable, or public benefit rather than profit.'
		},
		modern_slavery_statement: {
			label: "Modern Slavery Statement",
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/modern-slavery.png',
			colorVar: '--darkOrangeRGB',
			infoMsg: 'Combatting Modern Slavery: Commitment to Ethical Business<br> Ending Exploitation: Transparency in Supply Chain<br> Modern Slavery & Human Rights: Annual Disclosure<br> Taking a Stand: Approach to Modern Slavery Prevention'
		},
		community_interest_company: { 
			label: 'Community Interest Business',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/community-interest-cmp.png',
			colorVar: '--violetRGB',
			infoMsg: 'Community workshops, local business owners collaborating, town hall scenes.'
		},
		gender_pay_gap_reporting: {
			label: 'Gender Pay Gap Reporting',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/gender-pay-gap-reporting.png',
			colorVar: '--orangeRGB',
			infoMsg: 'Bridging the Gap: A Transparent Look at Gender Pay Equality<br> Gender Pay Gap Insights: Progress, Challenges, and Commitments<br> Equal Pay for Equal Work: Gender Pay Gap Report <br> Closing the Divide: Gender Pay Gap Trends and Action Plans'
		},
		prompt_payment_code_signatories: {
			label: 'Prompt Payment Code Signatories',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ppc-signatories.png',
			colorVar: '--blueRGB',
			infoMsg: 'Business policies ensuring suppliers and vendors are paid on time to maintain financial stability.'
		},
		ico_registered_business: {
			label: "ICO Registered Business",
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ico-registered.png',
			colorVar: '--yellowRGB',
			infoMsg: "Information Commissioner's Office Registered entities or individuals responsible for determining how and why personal data is processed under data protection laws."
		},
		race_at_work: {
			label: 'Race at Work',
			status: null,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/race-at-work.png',
			colorVar: '--aquaRGB',
			infoMsg: 'Championing Diversity: Race & Ethnicity in the Workplace<br> Race at Work: Driving Inclusion, Equality, and Opportunity<br> Building an Inclusive Workforce: Commitment to Racial Equity<br> Diversity & Representation: Creating Equal Opportunities for All'
		}	
	};

	constructor( private serverCommunicationService: ServerCommunicationService, private activatedRoute: ActivatedRoute, private sharedLoaderService: SharedLoaderService, private dataCommunicatorService: DataCommunicatorService ) {
		this.childCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();
	}

	ngOnInit() {
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( res  => {
			this.companyNumber = res['companyRegistrationNumber'];
		});

		this.getProcurementData();
	}

	getProcurementData() {
		this.sharedLoaderService.showLoader();

		this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_API', 'getResponsibleProcurementData', [ this.companyNumber ] ).subscribe( {
			next: (res) => {
				if ( res.body.status == 200 ) {

					this.hasResponsibleProcurementData = !!Object.keys(res.body.final_obj).length;

					for( let key in this.segmentationByOwnershipStructure ) {
						this.segmentationByOwnershipStructure[key].status = res.body.final_obj[key] == true ? 'Yes' : 'No';
					}

					for( let key in this.missionSpectrumStructure ) {
						this.missionSpectrumStructure[key].status = res.body.final_obj[key] == true ? 'Yes' : 'No';
					}

					this.sharedLoaderService.hideLoader();
				} 
				else {
					this.hasResponsibleProcurementData = false;
					this.sharedLoaderService.hideLoader();
				}

			},
			error: (err) => {
				this.hasResponsibleProcurementData = false;
				this.sharedLoaderService.hideLoader();
			}
		})
	}

	preventDefaultSort() {
		return 0;
	}

	ngOnDestroy() {
		this.childCommunicationSubscription.unsubscribe();
	}
}
