import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pageConfigsStore } from './make-pdf-constant.const';
import { PageConfig } from './page-config.interface';
import { CommonServiceService } from '../interface/service/common-service.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
    providedIn: 'root',
})
export class MakePdfService {
    private supplierBarGraphForPdf = new BehaviorSubject<object>({});
    $supplierBarGraphForPdf = this.supplierBarGraphForPdf.asObservable();

	pageConfigs: PageConfig[] = pageConfigsStore;
	impactReport: object = {};

    constructor(
			private commonService: CommonServiceService
		) {}

    updateGraph(updatedObj: object) {
        this.supplierBarGraphForPdf.next({
            ...this.supplierBarGraphForPdf.value,
            ...updatedObj,
        });
    }

    async latestReport( pageConfigHandler?, filename? ) {
        const imagePromises: Promise<string>[] = [];
        const imageMap: { [key: string]: { header?: string; icon?: string } } = {};

        if ( pageConfigHandler ) this.pageConfigs = pageConfigHandler;

        // Collect image loading promises and map which one belongs to which config
        this.pageConfigs.forEach((config) => {
            imageMap[config.key] = {};

            if (config.headerImage) {
                const headerPromise = this.commonService.convertImageToDataUrl(
                    config.headerImage
                );
                imagePromises.push(headerPromise);
                headerPromise.then(
                    (dataUrl) => (imageMap[config.key].header = dataUrl)
                );
            }

            if (config.iconImage) {
                const iconPromise = this.commonService.convertImageToDataUrl(
                    config.iconImage
                );
                imagePromises.push(iconPromise);
                iconPromise.then(
                    (dataUrl) => (imageMap[config.key].icon = dataUrl)
                );
            }
        });

        // Load footer image
        const footerImage = await this.commonService.convertImageToDataUrl(
            'pdf/footer_dg.svg'
        );

        // Wait for all images to load
        await Promise.all(imagePromises);

        // Assign loaded image map to this.impactReport
        this.impactReport = imageMap;

        // Build the content pages
        const content = [];
        this.pageConfigs.forEach((config, index) => {
            if (index > 0) {
                content.push({ text: '', pageBreak: 'before' });
            }
            content.push(this.generatePageContent(config));
        });

        const docDefinition = {
            pageSize: { width: 1920, height: 1080 },
            pageMargins: [0, 0, 0, 80],
            content: content,
            footer: function (currentPage, pageCount) {
                if (currentPage > 1 && currentPage < pageCount ) {
                    return [
                        {
                            height: 80,
                            image: footerImage,
                            alignment: 'center',
                        },
                    ];
                } else {
                    return [];
                }
            },
        };

        let fileName = filename + this.formatDate( new Date()) +'_'  + '_Report.pdf';
        
        // pdfMake.createPdf(docDefinition).open();
        pdfMake.createPdf(docDefinition).download(fileName);
    }

    generatePageContent(config: PageConfig) {
        switch (config.layout?.type) {
            case 'standard':
                return this.getStandardPage(config);
            case 'fullWidth':
                return this.getFullWidthPage(config);
            case 'split':
                return this.getSplitPage(config);
            case 'custom':
                return this.getCustomPage(config);
            default:
                return this.getStandardPage(config);
        }
    }

    getStandardPage(config: PageConfig) {
        return {
            layout: {
				paddingTop: () => 0,
				paddingBottom: () => 0,
				paddingLeft: () => 0,
				paddingRight: () => 0,
                defaultBorder: false,
            },
            table: {
                headerRows: 0,
                widths: [
                    config.layout?.content?.leftWidth || '50%',
                    config.layout?.content?.rightWidth || '50%',
                ],
                body: [
                    [
                        {
                            image: this.impactReport[config.key]['header'],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        this.descriptionContent(config.key, config),
                        this.iconContent(config.key, config),
                    ],
                ],
            },
        };
    }

    getFullWidthPage(config: PageConfig) {
        return {
            layout: {
				paddingTop: () => 0,
				paddingBottom: () => 0,
				paddingLeft: () => 0,
				paddingRight: () => 0,
                defaultBorder: false,
            },
            table: {
                headerRows: 0,
                widths: ['100%'],
                body: [
                    [
                        {
                            image: this.impactReport[config.key]['header'],
                            alignment: 'center',
                        },
                    ],
                    [
                        {
                            text: config.title,
                            fontSize: 50,
                            bold: true,
                            color: config.textColor,
                            alignment:
                                config.layout?.content?.textAlignment || 'left',
                            margin: [0, 30, 0, 0],
                        },
                    ],
                    [
                        {
                            text: config.description,
                            fontSize: 25,
                            lineHeight: 1.6,
                            alignment:
                                config.layout?.content?.textAlignment || 'left',
                        },
                    ],
                    [
                        {
                            ul: config.bullets,
                            fontSize: 25,
                            margin: [0, 0, 0, 30],
                            lineHeight: 1.6,
                            alignment:
                                config.layout?.content?.textAlignment || 'left',
                        },
                    ],
                ],
            },
        };
    }

    getSplitPage(config: PageConfig) {
        const columns = config.layout?.content?.columns || 3;
        const columnWidths =
            config.layout?.content?.columnWidths ||
            Array(columns).fill(`${100 / columns}%`);

        // Define the type for table cells
        type TableCell = {
            text?: string;
            fontSize?: number;
            alignment?: string;
            margin?: number[];
            image?: any;
            colSpan?: number;
        };

        // Create the body array with header row
        const body: TableCell[][] = [
            // Header row with image
            Array(columns)
                .fill({})
                .map((_, index) =>
                    index === 0
                        ? {
                              image: this.impactReport[config.key]['header'],
                              colSpan: columns,
                          }
                        : {}
                ),
        ];

        // Add content rows
        for (let i = 0; i < columns; i++) {
            const row: TableCell[] = Array(columns)
                .fill({})
                .map((_, index) => ({
                    text: `Column ${index + 1}`,
                    fontSize: 25,
                    alignment: 'center',
                    margin: [10, 20, 10, 20],
                }));
            body.push(row);
        }

        return {
            layout: {
				paddingTop: () => 0,
				paddingBottom: () => 0,
				paddingLeft: () => 0,
				paddingRight: () => 0,
                defaultBorder: false,
            },
            table: {
                headerRows: 0,
                widths: columnWidths,
                body: body,
            },
        };
    }

    getCustomPage(config: PageConfig) {
        // Implement custom page layout based on config
        return {
            image: this.impactReport[config.key]['header'],
            alignment: 'center'
        };
    }

    descriptionContent(key, config) {
        return {
            layout: {
				paddingTop: () => 10,
				paddingBottom: () => 10,
				paddingLeft: () => 40,
				paddingRight: () => 30,
                defaultBorder: false,
                hLineColor: (i, node) => '#99341F',
                vLineColor: (i, node) => '#99341F',
                hLineWidth: (i, node) => 4,
                vLineWidth: (i, node) => 4,
                fillColor: (rowIndex, node, columnIndex) =>
                    config.backgroundColor,
            },
            table: {
                headerRows: 0,
                widths: ['100%'],
                body: [
                    [
                        {
                            text: config.title,
                            fontSize: 45,
                            bold: true,
                            color: config.textColor,
                            margin: [0, 30, 0, 0],
                        },
                    ],
                    [
                        {
                            text: config.description,
                            fontSize: 22,
                            lineHeight: 1.5,
                        },
                    ],
                    [
                        {
                            ul: config.bullets,
                            fontSize: 22,
                            margin: [0, 0, 0, 30],
                            lineHeight: 1.5,
                        },
                    ],
                ],
            },
            margin: [60, 20, 50, 20],
        };
    }

    iconContent(key, config) {
        return {
            layout: {
				paddingTop: () => 20,
				paddingBottom: () => 20,
				paddingLeft: () => 0,
				paddingRight: () => 0,
                defaultBorder: false,
                hLineColor: (i, node) => '#FFFF00',
                vLineColor: (i, node) => '#FFFF00',
                hLineWidth: (i, node) => 4,
                vLineWidth: (i, node) => 4,
            },
            table: {
                headerRows: 0,
                widths: ['100%'],
                body: [
                    [
                        {
                            image: this.impactReport[key]['icon'],
                            alignment: 'center',
                        },
                    ],
                    [
                        {
                            text: config.value,
                            fontSize: 50,
                            color: config.valueColor,
                            alignment: 'center',
                        },
                    ],
                ],
            },
            margin: [20, 10, 30, 0],
        };
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
}
