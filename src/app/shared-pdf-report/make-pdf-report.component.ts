import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { CommonServiceService } from '../interface/service/common-service.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MakePdfService } from './make-pdf.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
    selector: 'dg-make-pdf-report',
    standalone: true,
    imports: [CommonModule, ButtonModule, ProgressBarModule, DialogModule],
    templateUrl: './make-pdf-report.component.html',
    styleUrls: ['./make-pdf-report.component.scss'],
})
export class MakePdfReport implements OnInit {

	@Input() apiDataResults: object = {};
	private subscription!: Subscription;

	summaryPagePeopleImage: any;
	summaryPageHandImage: any;
	aboutPagePeopleImage: any;
	aboutPagePeople3Image: any;
	titlePageImage: any;
	lastPageImage: any;

	// ? New Report Image URL
	storeDataImageUrlForNewReport = {};
	bCorpStaticImage: any;
    //? ------**----

	docDefinition: object = {}

	storeDataImageUrl: object = {};
	ownershipDiverse = {
		dataHeader: [
			{ key: 'Ethnic Minority Bussiness', imageKey: 'isEthnicOwnership' },
			{ key: 'Female Owned Business', imageKey: 'femaleOwned' },
			{ key: 'Military Veterans', imageKey: 'isMilitaryVeteran' }
		],
		staticImage: null,
		dynamicImage: null,
		legendImage: null,
		header: 'Segmentation by ownership'
	}
	missionDiverse = {
		dataHeader: [
			{ key: 'Net-Zero Target', imageKey: 'isNetZeroTarget' },
			{ key: 'B Corp Certified Business', imageKey: 'isBcorpCertification' },
			{ key: 'VCSE Category', imageKey: 'isVcseCategory' },
			{ key: 'Prompt Payment Code', imageKey: 'isPpcCategory' },
		],
		staticImage: null,
		dynamicImage: null,
		legendImage: null,
		header: 'Mission spectrum'
	}
	sizeDiverse = {
		dataHeader: [
			{ key: 'Micro', imageKey: 'micro' },
			{ key: 'Small', imageKey: 'small' },
			{ key: 'Medium', imageKey: 'medium' },
			{ key: 'Large Enterprise', imageKey: 'largeEnterprise' },
			{ key: 'Unknown', imageKey: 'unknown' },
		],
		staticImage: null,
		dynamicImage: null,
		legendImage: null,
		header: 'MSME distribution'
	}

	pageHeight: number = 595.28;
	pageHeightPortrait: number = 841.89;
	pageWidthPortrait: number = 595.28;
	isProcessing = false;

	innerTableBorderColor = ['#d8d8d8', '#d8d8d8', '#d8d8d8', '#d8d8d8']

	constructor(
		private commonService: CommonServiceService,
		private makePdfService: MakePdfService
	){}

    ngOnInit() {
        // this.generatedPdf();

    }

	ngOnDestroy() {
		if (this.subscription) {
		  this.subscription.unsubscribe();
		}
	}

	private async convertImageIntoUrl() {
		const imagePaths = [ 'Summary-Page-Image.svg', 'Hands-Icon.svg', 'About-Page-Image.svg', 'About-3.svg', 'Cover-Page-Main.svg', 'Last-Page.png', 'Ownership.svg', 'Mission.svg', 'ownership_diverse_legend.png', 'mission_diverse_legend.png', 'Size.svg', 'msme_legend.png'
		];
		const [ summaryPagePeopleImage, summaryPageHandImage, aboutPagePeopleImage, aboutPagePeople3Image, titlePageImage, lastPageImage, ownershipPageImage, missionPageImage, ownershipLegendImage, missionLegendImage, sizeDiverseImage, msmeLegendImage
		] = await Promise.all(imagePaths.map(img => this.commonService.convertImageToDataUrl(img)));

		this.summaryPagePeopleImage = summaryPagePeopleImage;
		this.summaryPageHandImage = summaryPageHandImage;
		this.aboutPagePeopleImage = aboutPagePeopleImage;
		this.aboutPagePeople3Image = aboutPagePeople3Image;
		this.titlePageImage = titlePageImage;
		this.lastPageImage = lastPageImage;

		this.ownershipDiverse.staticImage = ownershipPageImage;
		this.ownershipDiverse.dynamicImage = this.storeDataImageUrl['ownership_diverse'];
		this.ownershipDiverse.legendImage = ownershipLegendImage;
		
		this.sizeDiverse.staticImage = sizeDiverseImage;
		this.sizeDiverse.dynamicImage = this.storeDataImageUrl['msme_diverse'];
		this.sizeDiverse.legendImage = msmeLegendImage;

		this.missionDiverse.staticImage = missionPageImage;
		this.missionDiverse.dynamicImage = this.storeDataImageUrl['mission_diverse'];
		this.missionDiverse.legendImage = missionLegendImage;
	}

    async generatedPdf() {
		
		this.subscription = this.makePdfService.$supplierBarGraphForPdf.subscribe( (res: object) => {
			this.storeDataImageUrl = res;
		} );

		
		await this.convertImageIntoUrl();

		const footerImage = await this.commonService.convertImageToDataUrl('dg_logo_dark_for_pdf.png');

		this.docDefinition = {

			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [ 10, 10, 10, 20 ],
			// watermark: { text: 'DataGardener', color: 'gray', opacity: 0.1, bold: true, italics: false, fontSize: 80 },
	
			content: [
				this.getTitlePage(),
				this.getSummaryPage(),
				this.getAboutPage(),
				this.getOwnershipDiversityPage( this.ownershipDiverse ),
				{ text: '', pageBreak: 'before' },
				this.getOwnershipDiversityPage( this.missionDiverse ),
				{ text: '', pageBreak: 'before' },
				this.getOwnershipDiversityPage( this.sizeDiverse ),
				this.getLastPage()
			],
			
			styles: {},

			pageBreakBefore: ( currentNode ) => {
				let nodeHasTable = currentNode.table,
					tableRowsPositionOnPageEnd = currentNode.startPosition.top > currentNode.startPosition.pageInnerHeight - 20;

				return nodeHasTable && tableRowsPositionOnPageEnd;
			},

			footer: function(currentPage, pageCount) {
				if (currentPage > 1 && currentPage < pageCount) {
					return [
						{
							width: 150,
							height: 20,
							image: footerImage,
							alignment: 'center',
						},
					];
				} else {
					return []
				}
			},
	
		}

		let fileName = "Supplier_Analytics" + this.formatDate( new Date()) +'_'  + '_Report.pdf';

		// pdfMake.createPdf(this.docDefinition).open();
		pdfMake.createPdf(this.docDefinition).download(fileName);

	}

	//? ================================

	async exportPdf() {

		this.subscription = this.makePdfService.$supplierBarGraphForPdf.subscribe( (res: object) => {
			this.storeDataImageUrl = res;
		} )

		const imagePaths = [ 'B_Corp_Certified_report.png', 'Ethnic_Minority_report.png', 'Female_owned_business_report.png', 'Military_Veterans_report.png', 'Net_Zero_Target_report.png', 'voluntary_community_and_social_enterprises_report.png', 'prompt_payment_code_report.png' ];
		const [ bCorpStaticImage, ethnicOwnershipImage, femaleOwnedImage, militaryVeteranImage, netZeroTargetImage, vcseCategoryImage, ppcCategoryImage ] = await Promise.all(imagePaths.map(img => this.commonService.convertImageToDataUrl(img)));

		this.storeDataImageUrlForNewReport = {
			isBcorpCertification: { imagPath: bCorpStaticImage, header: 'B Corp Certified Business', bgColor: '#d8e9c7' },  
			isEthnicOwnership: { imagPath: ethnicOwnershipImage, header: 'Ethnic Minority Business', bgColor: '#bda6d6' },  
			femaleOwned: { imagPath: femaleOwnedImage, header: 'Female Owned Business', bgColor: '#f5b3bc' },  
			isMilitaryVeteran: { imagPath: militaryVeteranImage, header: 'Military Veterans', bgColor: '#a9e3de' },  
			isNetZeroTarget: { imagPath: netZeroTargetImage, header: 'Net-Zero Target', bgColor: '#b8ebfc' },  
			isVcseCategory: { imagPath: vcseCategoryImage, header: 'VCSE Category', bgColor: '#bcdff6' },  
			isPpcCategory: { imagPath: ppcCategoryImage, header: 'Prompt Payment Code', bgColor: '#c5cbe7' },  
			// micro: { imagPath: microBusinessImage, header: 'Micro', bgColor: '#c8e5db' },  
			// small: { imagPath: smallBusinessImage, header: 'Small', bgColor: '#ffeb99' },  
			// medium: { imagPath: mediumBusinessImage, header: 'Medium', bgColor: '#f4cfa3' },  
			// largeEnterprise: { imagPath: largeEnterpriseImage, header: 'Large Enterprise', bgColor: '#f1d9a8' },  
			// unknown: { imagPath: unknownCategoryImage, header: 'Unknown', bgColor: '#dde3ea' }  
		};
	

		const pdfSections = Object.entries(this.storeDataImageUrlForNewReport).map(([key, value]) => ({
			key,
			title: value?.['header'] || "Unknown Section",
			number: "2,55,330",
			imagePath: value?.['imagPath'] || null,
			bgColor: value?.['bgColor'] || "#ffffff",
			description: this.getDescriptionForKey(key),
			chartData: this.storeDataImageUrl[key],
			summary: this.getSummaryForKey(key)
		}));

		let mainPage = await this.commonService.convertImageToDataUrl( 'compareStatsCoverImage.jpg' );
		const footerImage = await this.commonService.convertImageToDataUrl('Report_Footer_stats.png');

		this.docDefinition = {

			pageSize: 'A4',
			pageOrientation: 'portrait',
			pageMargins: [ 10, 2, 10, 29 ],
			// watermark: { text: 'DataGardener', color: 'gray', opacity: 0.1, bold: true, italics: false, fontSize: 80 },
	
			content: [
				{
					layout: {
						defaultBorder: false
					},
					table: {
						headerRows: 0,
						widths: ['*'],
						heights: ['*'],
						body: [
							[
								{
									image:  mainPage,
									width: 570,
									height: 815,
									alignment: 'center'
								}
							]
						]
					}
				},
				...pdfSections.map((section, index ) => this.generateSectionContent(section, index))
			],
			
			styles: {},

			pageBreakBefore: ( currentNode ) => {
				let nodeHasTable = currentNode.table,
					tableRowsPositionOnPageEnd = currentNode.startPosition.top > currentNode.startPosition.pageInnerHeight - 20;

				return nodeHasTable && tableRowsPositionOnPageEnd;
			},

			footer: function(currentPage, pageCount) {
				// && currentPage < pageCount
				if (currentPage > 1) {
					return [
						{
							width: 600,
							// height: 15,
							image: footerImage,
							alignment: 'center',
						},
					];
				} else {
					return []
				}
			},
	
		}

		let fileName = "Supplier_Analytics" + this.formatDate( new Date()) +'_'  + '_Report.pdf';

		pdfMake.createPdf(this.docDefinition).open();
		// pdfMake.createPdf(this.docDefinition).download(fileName);

	}

	generateSectionContent(section: any, index: number) {

		const content = [];
		content.push({ text: '', pageBreak: 'before' });

		content.push({
			layout: { ...this.getPaddingLayout([0, 8, 0, 8]), defaultBorder: false },
			table: {
				widths: ['100%'],
				body: [
					[
						{
							text: [
								{ text: section.title, bold: true, fontSize: 14, color: 'black' },
								{ text: '      ', bold: true, fontSize: 10 },
								{ text: section.number, bold: true, fontSize: 14, color: 'black' }
							],
							fillColor: section.bgColor,
							alignment: 'left',
							margin: [20, 5, 0, 5],
						}
					]
				]
			},
		});

		const isEven = index % 2 === 0;
		const widths = isEven ? ['45%', '55%'] : ['55%', '45%'];
		const firstElement = isEven ? this.getLeftSideImage(section.imagePath) : this.getRightSideContent(section);
		const secondElement = isEven ? this.getRightSideContent(section) : this.getLeftSideImage(section.imagePath);

		content.push({
			layout: { ...this.getPaddingLayout([10, 0, 10, 0]), defaultBorder: false },
			table: {
				widths: widths,
				body: [
					[
						firstElement,
						secondElement
					]
				]
			},
		});
	
		return content;
	}
	
	getLeftSideImage(imagePath) {
		if (!imagePath) {
			return {};
		}
		return {
			image: imagePath,
			width: 248,
			height: this.pageHeightPortrait - 100,
			margin: [0, 10, 0, 10]
		};
	}

	getRightSideContent(section) {
		return {
			layout: { ...this.getPaddingLayout([0, 6, 0, 3]), defaultBorder: false },
			table: {
				widths: ['100%'],
				body: [
					[
						{
							table: {
								widths: ['100%'],
								body: [
									[{ text: 'Description', bold: true, fontSize: 16, border: [false, false, false, true], margin: [0, 0, 0, 5] }]
								]
							}
						}
					],
					[
						{
							text: section.description,
							color: '#545454',
							fontSize: 12,
							margin: [0, 0, 0, 20]
						}
					],
					[
						{
							text: [
								{ text: section.title, bold: true, fontSize: 12, color: 'black' },
								{ text: '      ', bold: true, fontSize: 10 },
								{ text: section.number, bold: true, fontSize: 14, color: 'black', margin: [0, 5, 0, 2] }
							],
							fillColor: section.bgColor,
							alignment: 'center',
							border: [false, false, false, false],
						}
					],
					[
						this.getTableData(section['key'])
					],
					[
						this.rightSideSummaryContentData(section.chartData, 300, 150)
					],
					[
						{
							text: [
								{ text: 'Business Summary:\n ', bold: true, fontSize: 16, color: '#662e9b' },
								{ text: section.summary, fontSize: 12, color: 'black' }
							],
							margin: [0, 0, 0, 20],
							alignment: 'left'
						}
					]
				]
			}
		};
	}

	getTableData( key ) {
		return {
			layout: { ...this.getPaddingLayout([10,2,10,2]), defaultBorder: false },
			table: {
				widths: [ 'auto', 'auto', 'auto' ],
				body: this.getTableContentNew( key )
			},
			margin: [5, 5, 5, 5]
		}
	}
	getTableContentNew( itemKey? ) {

		let bodyTable: any[] = [];

		const tableData = this.apiDataResults[itemKey];
		for ( let val of tableData ) {
			if ( val && val?.key == 'total' ) continue;
			bodyTable.push(
				[
					{ text: this.formatValue( val.key ), fontSize: 14, color: 'blue', margin: [0, 1, 0, 0] },
					{ text: this.formatValue( val.value, 'currency' ), fontSize: 14, color: 'black', margin: [0, 0, 0, 0], bold: true },
					{ text: this.formatValue( val.percentage, 'percentage', val ), fontSize:11, margin: [0, 2, 0, 3] }
				]
			)
		}

		return bodyTable;

	}

	getDescriptionForKey(key: string): string {
		const descriptions = {
			isBcorpCertification: "B Corp Certified Business refers to a company that meets high social, environmental, transparency, and accountability standards...",
			isEthnicOwnership: "Ethnic Ownership refers to businesses owned and controlled by individuals from minority communities...",
			femaleOwned: "This section highlights businesses owned and led by women, contributing to gender diversity and empowerment...",
			isMilitaryVeteran: "This section covers businesses owned by military veterans who have served in the armed forces...",
			isNetZeroTarget: "Net Zero Target businesses are companies committed to reducing their carbon footprint to zero...",
			isVcseCategory: "VCSE Category represents Voluntary, Community, and Social Enterprises...",
			isPpcCategory: "PPC Category businesses fall under Public Procurement and Compliance...",
			micro: "Micro businesses refer to small-scale enterprises with minimal staff and turnover...",
			small: "Small businesses have limited employees and revenue but play a crucial role in economic growth...",
			medium: "Medium enterprises are mid-sized companies with moderate revenue and workforce...",
			largeEnterprise: "Large Enterprises are well-established companies with significant market influence...",
			missionDiverseOverview: "It provides insights into performance trends, challenges, and opportunities, helping drive effective diversity strategies....",
			ownershipDiverseOverview: " It highlights representation trends, equity measures, and progress toward inclusive ownership structures......",
			unknown: "No data available for this section."
		};
		return descriptions[key] || "No description available.";
	}

	getSummaryForKey(key: string): string {
		const summaries = {
			isBcorpCertification: "This data highlights that XXX,XXX businesses are B Corp certified, emphasizing their commitment to sustainability...",
			isEthnicOwnership: "Ethnic minority-owned businesses contribute significantly to diversity and economic growth...",
			femaleOwned: "Women-led businesses are crucial for gender diversity and economic empowerment...",
			isMilitaryVeteran: "Veteran-owned businesses showcase leadership skills and contribute to national economies...",
			isNetZeroTarget: "Companies targeting net-zero emissions play a key role in climate change mitigation...",
			isVcseCategory: "VCSE businesses support social change and community well-being...",
			isPpcCategory: "PPC businesses ensure compliance with government regulations and fair trade practices...",
			micro: "Micro enterprises serve as the foundation of entrepreneurial growth...",
			small: "Small businesses drive employment and innovation in various sectors...",
			medium: "Medium enterprises balance growth and scalability while maintaining stability...",
			largeEnterprise: "Large enterprises influence global markets and set industry standards...",
			unknown: "No summary available for this section."
		};
		return summaries[key] || "No summary available.";
	}
	//? =================================

	//? =============LENDSCAPE====================

	async exportPdfLendscape() {

		this.isProcessing = true;

		this.subscription = this.makePdfService.$supplierBarGraphForPdf.subscribe( (res: object) => {
			this.storeDataImageUrl = res;
		} )

		const imagePaths = [ 'ownership_diversity_lendscape_2.png', 'Ethnic_Minority_lendscape_2.png', 'Military_veterans_lendscape_2.png', 'voluntary_lendsacpe_2.png' ];
		const [ femaleOwnedImage, ethnicOwnershipImage, militaryVeteranImage, vcseCategoryImage ] = await Promise.all(imagePaths.map(img => this.commonService.convertImageToDataUrl(img)));

		this.storeDataImageUrlForNewReport = {
			// isBcorpCertification: { imagPath: bCorpStaticImage, header: 'B Corp Certified Business', bgColor: '#d8e9c7' },  
			ownershipDiverseOverview: { header: 'Segmentation by ownership', bgColor: '#F4E3D7', imagPath: femaleOwnedImage, grpPage: true, dataKey: 'ownership_diverse_key' },
			missionDiverseOverview: { header: 'Mission Spectrum', bgColor: '#99D5CF', imagPath: femaleOwnedImage, grpPage: true, dataKey: 'ownership_diverse_key' },
			isEthnicOwnership: { imagPath: ethnicOwnershipImage, header: 'Ethnic Minority Business', bgColor: '#bda6d6' },  
			femaleOwned: { imagPath: femaleOwnedImage, header: 'Female Owned Business', bgColor: '#f5b3bc' },
			isMilitaryVeteran: { imagPath: militaryVeteranImage, header: 'Military Veterans', bgColor: '#a9e3de' },  
			// isNetZeroTarget: { imagPath: netZeroTargetImage, header: 'Net-Zero Target', bgColor: '#b8ebfc' },  
			isVcseCategory: { imagPath: vcseCategoryImage, header: 'VCSE Category', bgColor: '#bcdff6' },  
			// isPpcCategory: { imagPath: ppcCategoryImage, header: 'Prompt Payment Code', bgColor: '#c5cbe7' },
			// micro: { imagPath: microBusinessImage, header: 'Micro', bgColor: '#c8e5db' },  
			// small: { imagPath: smallBusinessImage, header: 'Small', bgColor: '#ffeb99' },  
			// medium: { imagPath: mediumBusinessImage, header: 'Medium', bgColor: '#f4cfa3' },  
			// largeEnterprise: { imagPath: largeEnterpriseImage, header: 'Large Enterprise', bgColor: '#f1d9a8' },  
			// unknown: { imagPath: unknownCategoryImage, header: 'Unknown', bgColor: '#dde3ea' }  
		};
	

		const pdfSections = Object.entries(this.storeDataImageUrlForNewReport).map(([key, value]) => ({
			key,
			title: value?.['header'] || "Unknown Section",
			imagePath: value?.['imagPath'] || null,
			bgColor: value?.['bgColor'] || "#ffffff",
			description: this.getDescriptionForKey(key),
			chartData: this.storeDataImageUrl[key],
			summary: this.getSummaryForKey(key),
			grpPage: value?.['grpPage'] || false,
			dataKey: value?.['dataKey'] || undefined
		}));

		// let mainPage = await this.commonService.convertImageToDataUrl( 'compareStatsCoverImage.jpg' );
		const footerImage = await this.commonService.convertImageToDataUrl('Report_Footer_stats.png');

		this.docDefinition = {

			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [ 6, 2, 6, 35 ],
			// watermark: { text: 'DataGardener', color: 'gray', opacity: 0.1, bold: true, italics: false, fontSize: 80 },
	
			content: [
				// {
				// 	layout: {
				// 		defaultBorder: false
				// 	},
				// 	table: {
				// 		headerRows: 0,
				// 		widths: ['*'],
				// 		heights: ['*'],
				// 		body: [
				// 			[
				// 				{
				// 					image:  mainPage,
				// 					width: 570,
				// 					height: 815,
				// 					alignment: 'center'
				// 				}
				// 			]
				// 		]
				// 	}
				// },
				...pdfSections.map((section, index ) => {
					if (section.grpPage) {
						return this.generateNewCustomPageContent(section);
					} else {
						return this.generateSectionContentLendscape(section, index);
					}
				})
			],
			background: function (currentPage, pageSize) {
				if (currentPage === 1) {
					return {
						canvas: [
							{
								type: 'rect',
								x: 0,
								y: 0,
								w: pageSize.width,
								h: pageSize.height,
								color: '#E6F5F3'
							}
						]
					};
				}
				return null;
			},
			
			styles: {},

			pageBreakBefore: ( currentNode ) => {
				let nodeHasTable = currentNode.table,
					tableRowsPositionOnPageEnd = currentNode.startPosition.top > currentNode.startPosition.pageInnerHeight - 20;

				return nodeHasTable && tableRowsPositionOnPageEnd;
			},

			footer: function(currentPage, pageCount) {
				// && currentPage < pageCount
				// if (currentPage > 1) {
					return [
						{
							width: 833,
							// height: 15,
							image: footerImage,
							alignment: 'center',
						},
					];
				// } else {
				// 	return []
				// }
			},
	
		}

		let fileName = "Supplier_Analytics" + this.formatDate( new Date()) +'_'  + '_Report.pdf';
		// pdfMake.createPdf(this.docDefinition).open();

		setTimeout(() => {
			this.isProcessing = false;
		}, 1000)

		// pdfMake.createPdf(this.docDefinition).open();
		pdfMake.createPdf(this.docDefinition).download(fileName);

	}

	generateNewCustomPageContent(section) {

		const content = [];

		content.push( this.pageHeader(section, 'right') );

		content.push({
			layout: { ...this.getPaddingLayout([0, 5, 0, 0]), defaultBorder: false },
			table: {
				widths: ['45%', '55%'],
				body: [
					[
						this.getLeftSideImageLendscape(section.imagePath),
						this.getGroupPage(section)
					]
				]
			},
		});
	
		return content;
	}

	getGroupPage( section ) {

		let bodyContent = [];

		bodyContent.push(this.getTitleSection());

		bodyContent.push(this.getDescriptionRow(section));
		this.apiDataResults?.[section['dataKey']].map( val => {
			bodyContent.push([
				{
					layout: { ...this.getPaddingLayout([0, 8, 0, 8]), defaultBorder: false },
					table: {
						widths: ['100%'],
						body: [
							[
								{
									text: [
										{ text: this.storeDataImageUrlForNewReport[ val.key ]['header'], bold: true, fontSize: 12, color: 'black' },
										{ text: '      ', bold: true, fontSize: 10 },
										{ text: this.formatValue( val['value'], 'currency' ), bold: true, fontSize: 12, color: 'black' }
									],
									fillColor: this.storeDataImageUrlForNewReport[ val.key ]['bgColor'],
									alignment: 'left',
									margin: [20, 5, 0, 5],
								}
							]
						]
					}
				}
			]);

		} )

		// bodyContent.push(this.getHighlightedSummaryRow(section, selectObj));

		return {
			layout: { ...this.getPaddingLayout([0, 6, 0, 3]), defaultBorder: false },
			table: {
				widths: ['100%'],
				body: bodyContent,
			},
		};
	}

	pageHeader( section, alignment: string = 'left' ) {
		return [
			{
				layout: { ...this.getPaddingLayout([0, 8, 0, 8]), defaultBorder: false },
				table: {
					widths: ['100%'],
					body: [
						[
							{
								text: [
									{ text: section.title, bold: true, fontSize: 14, color: 'black' },
									{ text: '      ', bold: true, fontSize: 10 },
									// { text: this.formatValue( selectObj['value'], 'currency' ), bold: true, fontSize: 14, color: 'black' }
								],
								fillColor: section.bgColor,
								alignment: alignment,
								margin: [20, 5, 20, 5],
							}
						]
					]
				}
			}
		]
	}

	generateSectionContentLendscape(section: any, index: number) {

		const content = [];
		content.push({ text: '', pageBreak: 'before' });
		content.push( this.pageHeader( section ) );

		const isEven = true || index % 2 === 0;
		const widths = isEven ? ['45%', '55%'] : ['55%', '45%'];
		const firstElement = isEven ? this.getLeftSideImageLendscape(section.imagePath) : this.getRightSideContentLendscape(section);
		const secondElement = isEven ? this.getRightSideContentLendscape(section) : this.getLeftSideImageLendscape(section.imagePath);

		content.push({
			layout: { ...this.getPaddingLayout([0, 5, 0, 0]), defaultBorder: false },
			table: {
				widths: widths,
				body: [
					[
						firstElement,
						secondElement
					]
				]
			},
		});
	
		return content;
	}
	
	getLeftSideImageLendscape(imagePath) {
		if (!imagePath) {
			return {};
		}
		return {
			image: imagePath,
			width: 360,
			// height: this.pageHeightPortrait - 100,
			height: this.pageHeight - 90,
		};
	}

	getRightSideContentLendscape(section) {

		const selectObj =  this.apiDataResults[section['key']].find( item => item['key'] == 'total' );

		let bodyContent = [];

		bodyContent.push(this.getTitleSection());

		bodyContent.push(this.getDescriptionRow(section));

		bodyContent.push(this.getHighlightedSummaryRow(section, selectObj));

		if (section.key) {
			bodyContent.push(this.getTableDataLendscape(section.key));
		}

		if (section.chartData) {
			bodyContent.push(this.getChartDataRow(section));
		}

		if (section.summary) {
			bodyContent.push(this.getBusinessSummaryRow(section));
		}

		return {
			layout: { ...this.getPaddingLayout([0, 6, 0, 3]), defaultBorder: false },
			table: {
				widths: ['100%'],
				body: bodyContent,
			},
		};
	}

	getTitleSection() {
		return [
			{
				table: {
					widths: ['100%'],
					body: [
						[{ text: 'Description', bold: true, fontSize: 16, border: [false, false, false, true], margin: [0, 0, 0, 5] }]
					]
				}
			}
		];
	}

	getDescriptionRow(section) {
		return [
			{
				text: section.description,
				color: '#545454',
				fontSize: 12,
				margin: [0, 0, 0, 20]
			}
		];
	}

	getHighlightedSummaryRow(section, selectObj) {
		return [
			{
				text: [
					{ text: section.title, bold: true, fontSize: 12, color: 'black' },
					{ text: '      ', bold: true, fontSize: 10 },
					{ text: this.formatValue(selectObj['value'], 'currency'), bold: true, fontSize: 14, color: 'black', margin: [0, 5, 0, 2] }
				],
				fillColor: section.bgColor,
				alignment: 'center',
				border: [false, false, false, false],
			}
		];
	}
	
	getChartDataRow(section) {
		return [
			{ ...this.rightSideSummaryContentData(section.chartData, 350, 120), margin: [35, 0, 0, 0] }
		];
	}

	getBusinessSummaryRow(section) {
		return [
			{
				text: [
					{ text: 'Business Summary:\n ', bold: true, fontSize: 16, color: '#662e9b' },
					{ text: section.summary, fontSize: 12, color: 'black' }
				],
				margin: [0, 0, 0, 20],
				alignment: 'left'
			}
		];
	}

	getTableDataLendscape( key ) {
		return [
			{
				layout: { ...this.getPaddingLayout([10,2,10,2]), defaultBorder: false },
				table: {
					widths: [ 'auto', 'auto', 'auto' ],
					body: this.getTableContentNewLendscape( key )
				},
				margin: [5, 5, 5, 5]
			}
		]
	}

	getTableContentNewLendscape( itemKey? ) {

		let bodyTable: any[] = [];

		const tableData = this.apiDataResults[itemKey];
		for ( let val of tableData ) {
			if ( val && val?.key == 'total' ) continue;
			bodyTable.push(
				[
					{ text: this.formatValue( val.key ), fontSize: 14, color: 'blue', margin: [0, 1, 0, 0] },
					{ text: this.formatValue( val.value, 'currency' ), fontSize: 14, color: 'black', margin: [0, 0, 0, 0], bold: true },
					{ text: this.formatValue( val.percentage, 'percentage', val ), fontSize:11, margin: [0, 2, 0, 3] }
				]
			)
		}

		return bodyTable;

	}
	//? =========***===========**===========

	getOwnershipDiversityPage( diverseData  ) {
		return {
			layout: { ...this.getPaddingLayout([2, 0, 2, 0]), defaultBorder: false },
			table: {
				headerRows: 0,
				widths: ['100%'],
				body: [
					[ { text: diverseData['header'], fontSize: 18, bold: true, color: '#00534b', border: [false, false, false, true], borderColor: this.innerTableBorderColor, margin: [0, 0, 0, 3] } ],
					[ 
						this.preparingOwnershipTable( diverseData )
					],
				]
			}
		}
	}
	preparingOwnershipTable(diverseData) {
		return {
			layout: { ...this.getPaddingLayout([0, 0, 0, 0]), defaultBorder: false },
			table: {
				headerRows: 0,
				widths: [ '70%', '30%' ],
				body: [
					[ 
						this.ownershipContentTable(diverseData['dataHeader']), this.ownershipImageTable(diverseData)
					],
				]
			}
		}
	}

	ownershipImageTable( diverseData) {
		return {
			layout: { ...this.getPaddingLayout([0,5,10,5]), defaultBorder: false },
			table: {
				headerRows: 0,
				widths: [ '100%' ],
				// heights: [ 250, 250 ],
				body: [
					// [
					// 	this.rightSideSummaryContentData( diverseData['dynamicImage'], 270, 145, 'left' )
					// ],
					[ 
						{...this.rightSideSummaryContentData( diverseData['legendImage'], 200, 48 ), margin: [25, 0, 0, 30]}
					],
					[ 
						{...this.rightSideSummaryContentData( diverseData['staticImage'], 220, 220 ), margin: [25, 0, 0, 0]}
					]
				]
			}
		}
	}

	ownershipContentTable(diverseData) {
		return {
			layout: { ...this.getPaddingLayout([0,2,0,0]), defaultBorder: false },
			table: {
				headerRows: 0,
				widths: [ '50%', '20%', '30%' ],
				body: this.getFullTableContent(diverseData)
			}
		}
	}
	getFullTableContent( diversityData: any[] ) {
		

		let tableBody: any[] = [];

		for ( let val of diversityData ) {

			const totalValueItem = this.apiDataResults[val.imageKey].find( item => item['key'] == 'total' )['value'];
			let fillColor = '#f2faf9'

			tableBody.push(
				[ 
					{ text: this.formatValue( val.key ), fillColor: fillColor, fontSize: 12, margin: [ 5, 2, 5, 2 ] , color: '#00695f', border: [false, true, false, true], borderColor: this.innerTableBorderColor },
					{ text: 'Total Spend', fillColor: fillColor, fontSize: 10, margin: [ 5, 5, 5, 5 ] , color: '#1769aa', border: [false, true, false, true], borderColor: this.innerTableBorderColor },
					{ text: this.formatValue( totalValueItem, 'currency',  ), fillColor: fillColor, fontSize: 10, margin: [ 5, 5, 5, 5 ], border: [false, true, false, true], borderColor: this.innerTableBorderColor  }
				],
				[ 
					{
						layout: { ...this.getPaddingLayout([0,2,0,2]), defaultBorder: false },
						table: {
							widths: ['auto', 'auto', 'auto'],
							body: this.getTableContent( val?.imageKey )
						},
						margin: [5, 5, 5, 5]
					},
					{ ...this.rightSideSummaryContentData( this.storeDataImageUrl[val['imageKey']], 200, 100 ), colSpan: 2 }, {}
				]
			)
		}

		return tableBody;

	}
	getTableContent( itemKey? ) {

		let bodyTable: any[] = [];

		const tableData = this.apiDataResults[itemKey];

		for ( let val of tableData ) {
			if ( val && val?.key == 'total' ) continue;
			bodyTable.push(
				[
					{ text: this.formatValue( val.key ), fontSize: 9, color: 'blue', margin: [0, 0, 14, 0] },
					{ text: this.formatValue( val.value, 'currency' ), fontSize: 9, color: 'gray', margin: [0, 1, 10, 0], bold: true },
					{ text: this.formatValue( val.percentage, 'percentage', val ), fontSize: 7, margin: [0, 3, 0, 5] }
				]
			)
		}

		return bodyTable

	}

	//? --START HERE-----**********---TITLE PAGE---****-------------------
	getTitlePage() {
		const fullPageHeight = this.pageHeight - 45;
		const halfHeight = parseFloat((fullPageHeight / 2).toFixed(2))
		return {
			layout: { ...this.getPaddingLayout(), defaultBorder: true },
			table: {
				heights: [halfHeight - 80, halfHeight + 80],
				widths: ['100%'],
				body: [
					[ this.titlePageFormation() ],
					[ this.rightSideSummaryContentData( this.titlePageImage, 816, halfHeight + 75 ) ],
				]
			}
		}

	}
	titlePageFormation() {

		const leftContentData = {
			layout: { ...this.getPaddingLayout([30, 5, 30, 0]), defaultBorder: false },
			table: {
				widths: ['100%'],
				body: [
					[{ text: 'DataGardener Solution Ltd.', alignment: 'right', margin: [ 0, 25, 0, 0 ] }],
					[{ text: 'SUPPLIER ANALYTICS IMPACT REPORT', alignment: 'center', fontSize: 30, color: '#168d6a', bold: true, margin: [ 0, 20, 0, 0 ] }],
					[{ text: 'for', alignment: 'center', fontSize: 12, bold: true, italics: true }],
					[{ text: 'COMPANY NAME', alignment: 'center', fontSize: 26, color: '#3f51b5' }],
					[{ text: 'JAN 2023 - DEC 2023', alignment: 'center', fontSize: 12, bold: true, italics: true }],
				]
			}
		}

		return leftContentData;
	}
	//? --------------END HERE------------------

	//? --START HERE-----**********---SUMMARY PAGE---****-------------------
	getSummaryPage() {
		const fullPageHeight = this.pageHeight - 45;
		return {
			layout: { ...this.getPaddingLayout(), defaultBorder: false },
			table: {
				widths: ['55%', '45%'],
				heights: () => fullPageHeight,
				body: [
					this.summaryPageFormation()
				]
			}
		}
	}
	summaryPageFormation() {
		let summaryContent = [];

		const leftContentData = this.leftSideSummaryContentData();
		const rightContentData = this.rightSideSummaryContentData( this.summaryPagePeopleImage, 368 );

		summaryContent.push( leftContentData, rightContentData );
		return summaryContent;
	}
	leftSideSummaryContentData() {
		const clientName = "Acme Corp" + `'s`;
		const date = new Date().toISOString().split('T')[0];
		const reportText = [
			"This report highlights the impact of ",
			{ text: clientName, bold: true, color: '#ff5733', fontSize: 14 },
			" supplier diversity initiatives between ",
			{ text: date, italics: true, color: '#3f51b5', fontSize: 12 },
			" and ",
			{ text: date, italics: true, color: '#3f51b5', fontSize: 12 },
			".\nEmphasizing both the volume and value of business with diverse suppliers, the report showcases efforts to support minority-owned, women-owned, and small businesses.",
			"\n\nIt also underscores the importance of size diversity, demonstrating acommitment to inclusivity across various business sizes and sectors. Keyachievements include increased spend with diverse suppliers, fosteringeconomic growth, and promoting equitable business opportunities."
		];

		const content = {
			layout: { ...this.getPaddingLayout( [ 20, 17, 20, 17 ] ), defaultBorder: false, ...this.tableLayoutBorderWidth() },
			table: {
				headerRows: 1,
				heights: [ 46, '*' ],
				body: [
					[ 
						this.applyCellStyle( 
							{ text: 'Summary', fontSize: 30, color: '#168d6a', bold: true, alignment: 'left' },
							{ bottom: true },
							{ bottom: '#ced4da' },
						) 
					],
					[ 
						{
							text: reportText,
							fontSize: 12,
							lineHeight: 1.5,
						} 
					],
					[ 
						{
							image: this.summaryPageHandImage,
							width: 170,
							height: 170,
							alignment: 'center'
						}  
					],
				]
			}
		}

		return content;
	}
	rightSideSummaryContentData( image, width, height: number =  this.pageHeight - 45, align: string = 'center' ) {

		const content = {
			layout: { ...this.getPaddingLayout(), defaultBorder: false },
			table: {
				headerRows: 0,
				body: [
					[ 
						{
							image: image,
							width: width,
							height: height,
							alignment: align
						} 
					],
				]
			},
		}

		return content;
	}
	//? --END HERE-----**********--------

	//? --START HERE-----**********---ABOUT PAGE---****-------------------
	getAboutPage() {
		const fullPageHeight = this.pageHeight - 45;
		return {
			layout: { ...this.getPaddingLayout(), defaultBorder: false },
			table: {
				widths: ['35%', '65%'],
				heights: () => fullPageHeight,
				body: [
					this.aboutPageFormation()
				]
			}
		}
	}
	aboutPageFormation() {
		let summaryContent = [];

		const leftContentData = this.rightSideSummaryContentData( this.aboutPagePeopleImage, 290 );
		const rightContentData = this.aboutContentData();

		summaryContent.push( leftContentData, rightContentData );
		return summaryContent;
	}
	aboutContentData() {

		const clientName = "Acme Corp" + `'s`;
		const date = new Date().toISOString().split('T')[0];
		const reportTextTop = [
			"This report provides a comprehensive overview of diversity spend data as provided by ",
			{ text: clientName, bold: true, color: '#ff5733', fontSize: 14 },
			"\n\nThe analysis focuses on various categories, including"
		];
		const reportTextBottom = [
			"\nThe data spans ",
			{ text: clientName, bold: true, color: '#ff5733', fontSize: 14 },
			" offering insights into trends and progress in promoting diverse and inclusive procurement practices.",
			"\n\n The figures and percentages presented in this report are derived directly from the client's data, reflecting their commitment to fostering a diverse supplier base. By examining spend breakdowns across ethnic minority-owned businesses, female-owned businesses, military veterans, and mission-driven enterprises, this report aims to highlight the impact of the client's procurement strategies on promoting equity and inclusion.",
			"\n\n This document serves as a valuable resource for understanding the client's efforts to support diverse suppliers and achieve their broader organizational goals. The data underscores the importance of transparency and accountability in driving meaningful change within the supply chain."
		];

		const content = {
			layout: { ...this.getPaddingLayout( [ 20, 10, 0, 10 ] ), defaultBorder: false, ...this.tableLayoutBorderWidth() },
			table: {
				headerRows: 1,
				heights: [ 65, '*' ],
				body: [
					[ 
						this.applyCellStyle( 
							{ text: 'About this Report', fontSize: 30, color: '#168d6a', bold: true, alignment: 'right' },
							{ bottom: true },
							{ bottom: '#ced4da' },
							[ 0, 20, 20, 0 ]
						) 
					],
					[ 
						{
							text: reportTextTop,
							fontSize: 11,
							lineHeight: 1.2,
						} 
					],
					[ 
						{
							image: this.aboutPagePeople3Image,
							width: 440,
							height: 100,
							alignment: 'center',
							color: 'yellow'
						}  
					],
					[ 
						{
							text: reportTextBottom,
							fontSize: 11,
							lineHeight: 1.2,
						} 
					],
				]
			}
		}

		return content;

	}
	//? --END HERE-----**********----------------------

	//? --START HERE-----**********---END PAGE---****-------------------
	getLastPage() {
		return this.rightSideSummaryContentData( this.lastPageImage, 818, this.pageHeight - 20 )
	}
	//? --END HERE-----**********-----------------------

	//?---------***Global Method***---------------------------------
	getPaddingLayout(padding: number[] = [ 0, 0, 0, 0 ]): object {
		return {
			paddingLeft: () => padding[0] ?? 0,
			paddingTop: () => padding[1] ?? 0,
			paddingRight: () => padding[2] ?? 0,
			paddingBottom: () => padding[3] ?? 0
		};
	}
	applyCellStyle(
		cell: any,
		borders: { left?: boolean, top?: boolean, right?: boolean, bottom?: boolean } = { left: true, top: true, right: true, bottom: true  },
		borderColors: { left?: string; right?: string; top?: string; bottom?: string } = {},
		padding: [number, number, number, number] = [0, 0, 0, 0],
		backgroundColor: string = '',
	) {

		cell.border = [
			!!borders.left,
			!!borders.top,
			!!borders.right,
			!!borders.bottom 
		];
	
		cell.borderColor = [
			borders.left ? borderColors.left || 'black' : undefined,
			borders.top ? borderColors.top || 'black' : undefined,
			borders.right ? borderColors.right || 'black' : undefined,
			borders.bottom ? borderColors.bottom || 'black' : undefined
		];
	
		if (backgroundColor) {
			cell.fillColor = backgroundColor;
		}
	
		cell.margin = padding;
	
		return cell;
	}
	tableLayoutBorderWidth ( borderWidths: number[] = [ 1, 1 ] ) {

		return {
			hLineWidth: function(i, node) {
				return (i === 0 || i === node.table.body.length) ? 1 : borderWidths[0];
			},
			vLineWidth: function(i, node) {
				return (i === 0 || i === node.table.widths.length) ? 1 : borderWidths[1];
			}
		}
		
	}

	formatValue(value, formatType?, item?) {
		if (value === undefined || value === null || value === '') {
			return '-';
		}
	
		if (formatType === 'number') {
			return new Intl.NumberFormat().format(value);
		}
	
		if (formatType === 'currency') {
			return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
		}

		if (formatType === 'percentage') {
			let textPrefix = '';
			let color = 'gray';
	
			if (item?.type === 'increase') {
				textPrefix = '(Increase)';  
				color = 'green';
			} else if (item?.type === 'decrease') {
				textPrefix = '(Decrease)';  
				color = 'red';
			}
	
			return { 
				text: `${textPrefix} ${ value}%`, 
				color: color 
			};
		}
	
		return value;
	}

	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [day, month, year].join('-');
	}

	//? -------------------LATEST REPORT CODE----------------------------------

	async latestReport() {

		this.makePdfService.latestReport();
	}

}
