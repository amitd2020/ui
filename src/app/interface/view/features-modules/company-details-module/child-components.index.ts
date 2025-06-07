// Components Under The Overview Tab

export * from './overview/about/about.component';
export * from './overview/trading-address/trading-address.component';
export * from './overview/esc/esc.component';
export * from './overview/group-structure/group-structure.component';
export * from './overview/notes/notes.component';
export * from './overview/life-line/life-line.component';
export * from './overview/import-export/import-export.component';
export * from './overview/person-contact-info/person-contact-info.component';
export * from './overview/epc-tab/epc-tab.component';

// Components Under The Risk Profile Tab

export * from './risk-profile/risk-summary/risk-summary.component';
export * from './risk-profile/safe-alert/safe-alert.component';
export * from './risk-profile/ccjs/ccjs.component';
export * from './risk-profile/commentry/commentry.component';
export * from './risk-profile/company-events/company-events.component';
export * from './risk-profile/creditors/creditors.component';
export * from './risk-profile/bad-depts/bad-depts.component';
export * from './risk-profile/charges/charges.component';


// Components Under The Financial Tab

export * from './financial/financials-info/financials-info.component';
export * from './financial/ratios/ratios.component';
export * from './financial/aquisation-merger/aquisation-merger.component';
export * from './financial/business-valuation/business-valuation.component';
export * from './financial/zscore/zscore.component';
export * from './financial/cagr/cagr.component';
export * from './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component';
export * from './financial/sustainability-index/sustainability-index.component';

// Components Under The Assets Tab

export * from './assets/corporate-land/corporate-land.component';
export * from './assets/shareholdings/shareholdings.component';
export * from './assets/innovate-grant/innovate-grant.component';
export * from './assets/patent-trade/patent-trade.component';

// Components Under The Directors/Shareholdings Tab

export * from './directors-shareholders/directors-info/directors-info.component';
export * from './directors-shareholders/psc/psc.component';
export * from './directors-shareholders/shareholders/shareholders.component';
export * from './directors-shareholders/related-directors/related-directors.component';
export * from './directors-shareholders/related-companies/related-companies.component';
export * from './directors-shareholders/view-shareholdings/view-shareholdings.component';

// Components Under The Documents - News Feeds Tab

export * from './documents/documents.component';
export * from './news-feed/news-feed.component';

// Components Under The Sustainabity - Sustainabity Tab

export * from './sustainability/esg-summary/esg-summary.component';
export * from './sustainability/environment/environment.component';
export * from './sustainability/social/social.component';
export * from './sustainability/governance/governance.component';
export * from './sustainability/finance/finance.component';

// Components Under Government Procurement

export * from './government-enabler/supplier/supplier.component';
export * from './government-enabler/buyer/buyer.component'

// Re-Exported to Override
import { Month } from './overview/import-export/import-export.component';
export { Month };