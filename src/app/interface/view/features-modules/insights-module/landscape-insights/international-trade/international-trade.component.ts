import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { MultiSelect } from 'primeng/multiselect/multiselect';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-international-trade',
	templateUrl: './international-trade.component.html',
	styleUrls: ['../../insights-component.scss', './international-trade.component.scss'],
	providers: [NumberSuffixPipe]
})

export class InternationalTradeComponent implements OnInit {


	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('tradeInsightsLineChart', { static: false }) public tradeInsightsLineChart: UIChart;
	@ViewChild('multiSelectCommodityCode', { static: false }) public multiSelectCommodityCode: MultiSelect;
	@ViewChild('multiSelectYears', { static: false }) public multiSelectMonths: MultiSelect;
	@ViewChild('multiSelectIndustry', { static: false }) public multiSelectIndustry: MultiSelect;
	@ViewChild('multiSelectRegion', { static: false }) public multiSelectRegion: MultiSelect;

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	title: any;
	description: any;

	selectedPeriodValue: { fromDate: Date, toDate: Date } = {
		fromDate: undefined,
		toDate: undefined
	};

	listOfCommodityCodeOptions: Array<{ label: string, value: string }> = [
		{ label: '01 - Live Animals', value: 'live animals' },
		{ label: '02 - Meat And Edible Meat Offal', value: 'meat and edible meat offal' },
		{ label: '03 - Fish And Crustaceans, Molluscs And Other Aquatic Invertebrates', value: 'fish and crustaceans, molluscs and other aquatic invertebrates' },
		{ label: '04 - Dairy Produce; Birds\' Eggs; Natural Honey; Edible Products Of Animal Origin, Not Elsewhere Specified Or Included', value: 'dairy produce; birds\' eggs; natural honey; edible products of animal origin, not elsewhere specified or included' },
		{ label: '05 - Products Of Animal Origin Not Elsewhere Specified Or Included', value: 'products of animal origin not elsewhere specified or included' },
		{ label: '06 - Live Trees And Other Plants; Bulbs, Roots And The Like; Cut Flowers And Ornamental Foliage', value: 'live trees and other plants; bulbs, roots and the like; cut flowers and ornamental foliage' },
		{ label: '07 - Edible Vegetables And Certain Roots And Tubers', value: 'edible vegetables and certain roots and tubers' },
		{ label: '08 - Edible Fruit And Nuts; Peel Of Citrus Fruits Or Melons', value: 'edible fruit and nuts; peel of citrus fruits or melons' },
		{ label: '09 - Coffee, Tea, Mate And Spices', value: 'coffee, tea, mate and spices' },
		{ label: '10 - Cereals', value: 'cereals' },
		{ label: '11 - Products Of The Milling Industry; Malt; Starches; Inulin; Wheat Gluten', value: 'products of the milling industry; malt; starches; inulin; wheat gluten' },
		{ label: '12 - Oil Seeds And Oleaginous Fruits; Miscellaneous Grains, Seeds And Fruit; Industrial Or Medical Plants; Straw And Fodder', value: 'oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit; industrial or medical plants; straw and fodder' },
		{ label: '13 - Lacs; Gums, Resins And Other Vegetable Saps And Extracts', value: 'lacs; gums, resins and other vegetable saps and extracts' },
		{ label: '14 - Vegetable Plaiting Materials; Vegetable Products Not Elsewhere Specified Or Included', value: 'vegetable plaiting materials; vegetable products not elsewhere specified or included' },
		{ label: '15 - Animal Or Vegetable Fats And Oils And Their Cleavage Products; Prepared Edible Fats; Animal Or Vegetable Waxes', value: 'animal or vegetable fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes' },
		{ label: '16 - Preparations Of Meat, Fish Or Crustaceans, Molluscs Or Other Aquatic Invertebrates', value: 'preparations of meat, fish or crustaceans, molluscs or other aquatic invertebrates' },
		{ label: '17 - Sugars And Sugar Confectionery', value: 'sugars and sugar confectionery' },
		{ label: '18 - Cocoa And Cocoa Preparations', value: 'cocoa and cocoa preparations' },
		{ label: '19 - Preparations Of Cereals, Flour, Starch Or Milk; Pastrycooks\' Products', value: 'preparations of cereals, flour, starch or milk; pastrycooks\' products' },
		{ label: '20 - Preparations Of Vegetables, Fruit, Nuts Or Other Parts Of Plants', value: 'preparations of vegetables, fruit, nuts or other parts of plants' },
		{ label: '21 - Miscellaneous Edible Preparations', value: 'miscellaneous edible preparations' },
		{ label: '22 - Beverages, Spirits And Vinegar', value: 'beverages, spirits and vinegar' },
		{ label: '23 - Residues And Waste From The Food Industries; Prepared Animal Fodder', value: 'residues and waste from the food industries; prepared animal fodder' },
		{ label: '24 - Tobacco And Manufactured Tobacco Substitutes', value: 'tobacco and manufactured tobacco substitutes' },
		{ label: '25 - Salt; Sulphur; Earths And Stone; Plastering Material, Lime And Cement', value: 'salt; sulphur; earths and stone; plastering material, lime and cement' },
		{ label: '26 - Ores, Slag And Ash', value: 'ores, slag and ash' },
		{ label: '27 - Mineral Fuels, Mineral Oils And Products Of Their Distillation; Bituminous Substances; Mineral Waxes', value: 'mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes' },
		{ label: '28 - Inorganic Chemicals: Organic Or Inorganic Compounds Of Precious Metals, Of Rare-Earth Metals, Of Radioactive Elements Or Of Isotopes', value: 'inorganic chemicals: organic or inorganic compounds of precious metals, of rare-earth metals, of radioactive elements or of isotopes' },
		{ label: '29 - Organic Chemicals', value: 'organic chemicals' },
		{ label: '30 - Pharmaceutical Products', value: 'pharmaceutical products' },
		{ label: '31 - Fertilizers', value: 'fertilizers' },
		{ label: '32 - Tanning Or Dyeing Extracts; Tannins And Their Derivatives; Dyes, Pigments And Other Colouring Matter;Paints And Varnishes; Putty And Other Mastics; Inks', value: 'tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter;paints and varnishes; putty and other mastics; inks' },
		{ label: '33 - Essential Oils And Resinoids; Perfumery, Cosmetic Or Toilet Preparations', value: 'essential oils and resinoids; perfumery, cosmetic or toilet preparations' },
		{ label: '34 - Soaps, Organic Surface-Active Agents, Washing Preprations, Lubricating Preparations,Artificial Waxes, Prepared Waxes, Shoe Polish, Scouring Powder And The Like, Candles And Similar Products, Modelling Pastes, Dentalwax And Plaster-Based Dental Prepar', value: 'soaps, organic surface-active agents, washing preprations, lubricating preparations,artificial waxes, prepared waxes, shoe polish, scouring powder and the like, candles and similar products, modelling pastes, dentalwax and plaster-based dental prepar' },
		{ label: '35 - Albuminous Substances; Modified Starches; Glues; Enzymes', value: 'albuminous substances; modified starches; glues; enzymes' },
		{ label: '36 - Explosives; Pyrotechnic Products; Matches;Pyrophoric Alloys; Combustible Materials', value: 'explosives; pyrotechnic products; matches;pyrophoric alloys; combustible materials' },
		{ label: '37 - Photographic Or Cinematographic Products', value: 'photographic or cinematographic products' },
		{ label: '38 - Miscellaneous Chemical Products', value: ' miscellaneous chemical products' },
		{ label: '39 - Plastics And Plastic Products', value: 'plastics and plastic products' },
		{ label: '40 - Rubber And Articles Thereof', value: 'rubber and articles thereof' },
		{ label: '41 - Hides And Skins (Other Than Furskins) And Leather', value: 'hides and skins (other than furskins) and leather' },
		{ label: '42 - Articles Of Leather; Saddlery And Harness; Travel Goods, Handbags And Similar Containers; Articles Of Animal Gut (Other Than Silk-Worm Gut)', value: 'articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)' },
		{ label: '43 - Furskins And Artificial Fur; Articles Thereof', value: 'furskins and artificial fur; articles thereof' },
		{ label: '44 - Wood And Articles Of Wood; Wood Charcoal', value: 'wood and articles of wood; wood charcoal' },
		{ label: '45 - Cork And Articles Of Cork', value: 'cork and articles of cork' },
		{ label: '46 - Wickerwork And Basketwork', value: 'wickerwork and basketwork' },
		{ label: '47 - Pulp Of Wood Or Of Other Fibrous Cellulosic Material; Waste And Scrap Of Paper Or Paperboard', value: 'pulp of wood or of other fibrous cellulosic material; waste and scrap of paper or paperboard' },
		{ label: '48 - Paper And Paperboard; Articles Of Paper Pulp, Paper Or Paperboard', value: 'paper and paperboard; articles of paper pulp, paper or paperboard' },
		{ label: '49 - Books, Newspapers, Pictures And Other Products Of The Printing Industry; Manuscripts, Typescripts And Plans', value: 'books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans' },
		{ label: '50 - Silk', value: 'silk' },
		{ label: '51 - Wool, Fine And Coarse Animal Hair; Yarn And Fabrics Of Horsehair', value: 'wool, fine and coarse animal hair; yarn and fabrics of horsehair' },
		{ label: '52 - Cotton', value: 'cotton' },
		{ label: '53 - Other Vegetable Textile Fibres; Paper Yarnand Woven Fabrics Of Paper Yarn', value: 'other vegetable textile fibres; paper yarnand woven fabrics of paper yarn' },
		{ label: '54 - Man-Made Filaments', value: 'man-made filaments' },
		{ label: '55 - Man-Made Staple Fibres', value: 'man-made staple fibres' },
		{ label: '56 - Wadding, Felt And Nonwovens; Special Yarns; Twine, Cordage, Rope And Cable And Articles Thereof', value: 'wadding, felt and nonwovens; special yarns; twine, cordage, rope and cable and articles thereof' },
		{ label: '57 - Carpets And Other Textile Floor Coverings', value: 'carpets and other textile floor coverings' },
		{ label: '58 - Special Woven Fabrics; Tufted Textile Products; Lace; Tapestries; Trimmings; Embroidery', value: 'special woven fabrics; tufted textile products; lace; tapestries; trimmings; embroidery' },
		{ label: '59 - Impregnated, Coated, Covered Or Laminated Textile Fabrics; Articles For Technical Use, Of Textile Materials', value: 'impregnated, coated, covered or laminated textile fabrics; articles for technical use, of textile materials' },
		{ label: '60 - Knitted Or Crocheted Fabrics', value: 'knitted or crocheted fabrics' },
		{ label: '61 - Articles Of Apparel And Clothing Accessories, Knitted Or Crocheted', value: 'articles of apparel and clothing accessories, knitted or crocheted' },
		{ label: '62 - Articles Of Apparel And Clothing Accessories, Not Knitted Or Crocheted', value: 'articles of apparel and clothing accessories, not knitted or crocheted' },
		{ label: '63 - Other Made Up Textile Articles; Sets; Worn Clothing And Worn Textile Articles; Rags', value: 'other made up textile articles; sets; worn clothing and worn textile articles; rags' },
		{ label: '64 - Footwear, Gaiters And The Like; Parts Of Such Articles', value: 'footwear, gaiters and the like; parts of such articles' },
		{ label: '65 - Headgear And Parts Thereof', value: 'headgear and parts thereof' },
		{ label: '66 - Umbrellas, Sun Umbrellas, Walking-Sticks, Seat-Sticks, Whips, Riding-Crops And Parts Thereof', value: 'umbrellas, sun umbrellas, walking-sticks, seat-sticks, whips, riding-crops and parts thereof' },
		{ label: '67 - Prepared Feathers And Down And Articles Made Of Feathers Or Of Down; Artificial Flowers; Articles Of Human Hair', value: 'prepared feathers and down and articles made of feathers or of down; artificial flowers; articles of human hair' },
		{ label: '68 - Articles Of Stone, Plaster, Cement, Asbestos, Mica Or Similar Materials', value: 'articles of stone, plaster, cement, asbestos, mica or similar materials' },
		{ label: '69 - Ceramic Products', value: 'ceramic products' },
		{ label: '70 - Glass And Glassware', value: 'glass and glassware' },
		{ label: '71 - Natural Or Cultured Pearls, Precious Or Semi-Precious Stones, Precious Metals, Metals Clad With Precious Metal, And Articles Thereof; Imitation Jewellery; Coin', value: 'natural or cultured pearls, precious or semi-precious stones, precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin' },
		{ label: '72 - Iron And Steel', value: 'iron and steel' },
		{ label: '73 - Articles Of Iron Or Steel', value: 'articles of iron or steel' },
		{ label: '74 - Copper And Articles Thereof', value: 'copper and articles thereof' },
		{ label: '75 - Nickel And Articles Thereof', value: 'nickel and articles thereof' },
		{ label: '76 - Aluminium And Articles Thereof', value: 'aluminium and articles thereof' },
		{ label: '78 - Lead And Articles Thereof', value: 'lead and articles thereof' },
		{ label: '79 - Zinc And Articles Thereof', value: 'zinc and articles thereof' },
		{ label: '80 - Tin And Articles Thereof', value: 'tin and articles thereof' },
		{ label: '81 - Other Base Metals; Cermets; Articles Thereof', value: 'other base metals; cermets; articles thereof' },
		{ label: '82 - Tools, Implements, Cutlery, Spoons And Forks, Of Base Metal; Parts Thereof Of Base Metal', value: 'tools, implements, cutlery, spoons and forks, of base metal; parts thereof of base metal' },
		{ label: '83 - Miscellaneous Articles Of Base Metal', value: 'miscellaneous articles of base metal' },
		{ label: '84 - Nuclear Reactors, Boilers, Machinery And Mechanical Appliances; Parts Thereof', value: 'nuclear reactors, boilers, machinery and mechanical appliances; parts thereof' },
		{ label: '85 - Electrical Machinery And Equipment And Parts Thereof; Sound Recorders And Reproducers, Television Image And Sound Recorders And Reproducers, And Parts And Accessories Of Such Articles', value: 'electrical machinery and equipment and parts thereof; sound recorders and reproducers, television image and sound recorders and reproducers, and parts and accessories of such articles' },
		{ label: '86 - Railway Or Tramway Locomotives, Rolling-Stock And Parts Thereof; Railway Or Tramway Track Fixtures And Fittings And Parts Thereof; Mechanical, Including Electro-Mechanical, Traffic Signalling Equipment Of All Kinds', value: 'railway or tramway locomotives, rolling-stock and parts thereof; railway or tramway track fixtures and fittings and parts thereof; mechanical, including electro-mechanical, traffic signalling equipment of all kinds' },
		{ label: '87 - Vehicles Other Than Railway Or Tramway Rolling-Stock, And Parts And Accessories Thereof', value: 'vehicles other than railway or tramway rolling-stock, and parts and accessories thereof' },
		{ label: '88 - Aircraft, Spacecraft, And Parts Thereof', value: 'aircraft, spacecraft, and parts thereof' },
		{ label: '89 - Ships, Boats And Floating Structures', value: 'ships, boats and floating structures' },
		{ label: '90 - Optical, Photographic, Cinematographic, Measuring, Checking, Precision, Medical Or Surgical Instruments And Apparatus; Parts And Accessories Thereof', value: 'optical, photographic, cinematographic, measuring, checking, precision, medical or surgical instruments and apparatus; parts and accessories thereof' },
		{ label: '91 - Clocks And Watches And Parts Thereof', value: 'clocks and watches and parts thereof' },
		{ label: '92 - Musical Instruments; Parts And Accessories For Such', value: 'musical instruments; parts and accessories for such' },
		{ label: '93 - Arms And Ammunition; Parts And Accessoriesthereof', value: 'arms and ammunition; parts and accessoriesthereof' },
		{ label: '94 - Furniture; Medical And Surgical Furniture; Bedding, Mattresses, Mattress Supports,Cushions And Similar Stuffed Furnishings; Lamps And Lighting Fittings, Not Elsewhere Specified; Illuminated Signs, Illuminatedname-Plates And The Like; Prefabricated Bu', value: 'furniture; medical and surgical furniture; bedding, mattresses, mattress supports,cushions and similar stuffed furnishings; lamps and lighting fittings, not elsewhere specified; illuminated signs, illuminatedname-plates and the like; prefabricated bu' },
		{ label: '95 - Toys, Games And Sports Requisites; Parts And Accessories Thereof', value: 'toys, games and sports requisites; parts and accessories thereof' },
		{ label: '96 - Miscellaneous Manufactured Articles', value: 'miscellaneous manufactured articles' },
		{ label: '97 - Works Of Art, Collectors\' Pieces And Antiques', value: 'works of art, collectors\' pieces and antiques' },
		{ label: '98 - Industrial Plant Component Parts', value: 'industrial plant component parts' },
		{ label: '99 - Other Products', value: 'other products' }
	];

	selectedCommodityCodes: any;

	industryListDropdownOptions: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - manufacturing', value: 'manufacturing' },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - construction', value: 'construction' },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - transportation and storage', value: 'transportation and storage' },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - information and communication', value: 'information and communication' },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - real estate activities', value: 'real estate activities' },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - education', value: 'education' },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - other service activities', value: 'other service activities' },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' }
	];
	exportAmount: {field: string, label: string, value: Object, count: number, count_percentage: number }[] = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: '1Bto10B', label: '1B to 10B', value: { greaterThan: '1000000000', lessThan: '10000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan10B', label: 'Greater Than 10B', value: { greaterThan: '10000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	selectedIndustryList: any;
	monthsEnum: any = Month;
	turnoverRangeValue: number = 0;
	exportTurnoverRangeValue: Number = 0;
	companyAgeValue: Number = 0;
	companyAgeLessThanOrGreaterThan: string = 'less';
	nameOrNumberValue: number;
	checkEstimatedTurnover: string = "true";
	tradeInsightsLineChartData: any;
	lineLabels: Array<any> = [];
	todayDate = new Date();
	maxYear = this.todayDate.getFullYear();
	maxSelectableDate = new Date( new Date().setMonth( new Date().getMonth() - 1 ) );
	
	tradeCountsData: Array<{ label: string, count: string }> = [
		{ label: 'Last 12 Months Import', count: '' },
		{ label: 'Last 5 Years Import', count: '' },
		{ label: 'Last 12 Months Export', count: '' },
		{ label: 'Last 5 Years Export', count: '' }
	];

	regionListDropdownOptions: Array<{ label: string, value: string }>;
	selectedRegionList: any;

	estimatedRangeValue: number = 0;
	ageValue: number = 0;

	selectedImporter: boolean = false;
	selectedExporter: boolean = false;
	impExportCheck: boolean = false;

	ablInsightsMapData: any;

	lineOptions: any;
	insightsLineChartData: any;

	selectedMonthPeriod: any[];
	industryListColumns: Array<object> = [];
	industryListData: Array<object> = [
		{ industryName: 'A - agriculture forestry and fishing', industrySicCodeValue: 'agriculture forestry and fishing' },
		{ industryName: 'B - mining and quarrying', industrySicCodeValue: 'mining and quarrying' },
		{ industryName: 'C - manufacturing', industrySicCodeValue: 'manufacturing' },
		{ industryName: 'D - electricity, gas, steam and air conditioning supply', industrySicCodeValue: 'electricity, gas, steam and air conditioning supply' },
		{ industryName: 'E - water supply, sewerage, waste management and remediation activities', industrySicCodeValue: 'water supply, sewerage, waste management and remediation activities' },
		{ industryName: 'F - construction', industrySicCodeValue: 'construction' },
		{ industryName: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', industrySicCodeValue: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ industryName: 'H - transportation and storage', industrySicCodeValue: 'transportation and storage' },
		{ industryName: 'I - accommodation and food service activities', industrySicCodeValue: 'accommodation and food service activities' },
		{ industryName: 'J - information and communication', industrySicCodeValue: 'information and communication' },
		{ industryName: 'K - financial and insurance activities', industrySicCodeValue: 'financial and insurance activities' },
		{ industryName: 'L - real estate activities', industrySicCodeValue: 'real estate activities' },
		{ industryName: 'M - professional, scientific and technical activities', industrySicCodeValue: 'professional, scientific and technical activities' },
		{ industryName: 'N - administrative and support service activities', industrySicCodeValue: 'administrative and support service activities' },
		{ industryName: 'O - public administration and defence; compulsory social security', industrySicCodeValue: 'public administration and defence; compulsory social security' },
		{ industryName: 'P - education', industrySicCodeValue: 'education' },
		{ industryName: 'Q - human health and social work activities', industrySicCodeValue: 'human health and social work activities' },
		{ industryName: 'R - arts, entertainment and recreation', industrySicCodeValue: 'arts, entertainment and recreation' },
		{ industryName: 'S - other service activities', industrySicCodeValue: 'other service activities' },
		{ industryName: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', industrySicCodeValue: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ industryName: 'U - activities of extraterritorial organisations and bodies', industrySicCodeValue: 'activities of extraterritorial organisations and bodies' }
	];
	industryListMonthsTotal = {};
	industryListTotal = {};

	listOfTurnOver: Array<{ label: string, value: Object }> = [
		{ label: '< 1M', value: { greaterThan: undefined, lessThan: '1000000' } },
		{ label: '1M - 5M', value: { greaterThan: '1000000', lessThan: '5000000' } },
		{ label: '5M -10M', value: { greaterThan: '5000000', lessThan: '10000000' } },
		{ label: '10M - 100M', value: { greaterThan: '10000000', lessThan: '100000000' } },
		{ label: '100M - 500M', value: { greaterThan: '100000000', lessThan: '500000000' } },
		{ label: '500M - 1BN', value: { greaterThan: '500000000', lessThan: '1000000000' } },
		{ label: '1BN - 10BN', value: { greaterThan: '1000000000', lessThan: '10000000000' } },
		{ label: '> 10BN', value: { greaterThan: '10000000000', lessThan: undefined } }
	];
	selectedTurnOver: any = { greaterThan: undefined, lessThan: undefined };

	showInputFieldMessage: boolean = false;

	msgLogs: Message[] = [];

	globalFilterDataObject: any = {
		filterData: [
			{ chip_group: "Status", chip_values: ["live"] },
			{ chip_group: "Preferences", chip_values: ["company must have trade data", "estimated turnover included"], preferenceOperator: [{ hasTradeData: "true" }, { hasEstimatedTurnover: "true" }] }
		]
	};
	showDisplayMsg: boolean;

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private toNumberSuffix: NumberSuffixPipe,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('internationalTradeLandscape') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
            this.router.navigate(['/']);
        }

	}

	ngOnInit() {
		this.maxSelectableDate.setDate(0);
		this.initBreadcrumbAndSeoMetaTags();
		
		// Map API Calling
		this.getTradeInsightsData();
		// Map API Calling

		this.industryListColumns = [
			{ field: 'industryName', header: 'Industry Name', minWidth: '280px', maxWidth: 'none', textAlign: 'left' },
			{ field: `${this.monthsEnum[1]}`, header: `${this.monthsEnum[1]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[2]}`, header: `${this.monthsEnum[2]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[3]}`, header: `${this.monthsEnum[3]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[4]}`, header: `${this.monthsEnum[4]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[5]}`, header: `${this.monthsEnum[5]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[6]}`, header: `${this.monthsEnum[6]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[7]}`, header: `${this.monthsEnum[7]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[8]}`, header: `${this.monthsEnum[8]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[9]}`, header: `${this.monthsEnum[9]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[10]}`, header: `${this.monthsEnum[10]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[11]}`, header: `${this.monthsEnum[11]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[12]}`, header: `${this.monthsEnum[12]}`, minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: 'totalValues', header: 'Total', minWidth: '80px', maxWidth: '80px', textAlign: 'right' }
		];

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'International Trade Landscape', routerLink: ['/insights/international-trade'] }
		// ]);

		this.title = "DataGardener International Trade Insight - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	resetInsightCriteria() {
		this.selectedCommodityCodes = [];
		this.selectedIndustryList = undefined;
		this.selectedRegionList = undefined;
		this.turnoverRangeValue = 0;
		this.selectedPeriodValue = {
            fromDate: undefined,
            toDate: undefined
        }
		this.exportTurnoverRangeValue = 0;
		this.companyAgeValue = 0;
		this.selectedTurnOver = undefined;
		this.companyAgeLessThanOrGreaterThan = undefined;
		this.selectedImporter = undefined;
		this.selectedExporter = undefined;
		this.nameOrNumberValue = undefined;
		this.checkEstimatedTurnover = "true";
		this.showInputFieldMessage = false;

		this.getTradeInsightsData();

		this.multiSelectCommodityCode.filterValue = null;
		this.multiSelectIndustry.filterValue = null;
		this.multiSelectRegion.filterValue = null;
		this.selectedMonthPeriod = [];
		this.lineLabels = [];
	}

	onChangeRegionSelection(event) {

		if (event.itemValue != null && this.selectedRegionList && this.selectedRegionList.length > 1) {

			this.selectedRegionList = this.selectedRegionList.filter(val => val);

		}

		if (event.itemValue == null && this.selectedRegionList.length > 0 && event.value.includes(event.itemValue)) {
			event.value = [null];
			this.selectedRegionList = event.value;
		}
	}

	getRegionsData( mapGeoJSON ) {

		this.regionListDropdownOptions = [];

		for (let featureObj of mapGeoJSON.features) {
			if (!JSON.stringify(this.regionListDropdownOptions).includes(featureObj.properties.name)) {
				this.regionListDropdownOptions.push({ label: featureObj.properties.name, value: featureObj.properties.name.toLowerCase() });
			}
		}

		this.regionListDropdownOptions.sort((a, b) => a.label.localeCompare(b.label));

		// this.regionListDropdownOptions.unshift({ label: 'All', value: null }); 

	}

	async initLeafletMapContainer( currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `internationalTradeMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'internationalTradePage',
			selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
			globalFilterDataObject: this.globalFilterDataObject
		}

		instance.mapGeoJsonOutput.subscribe( res => {
			this.getRegionsData( res );
		});

	}

	getTradeInsightsData() {

		this.sharedLoaderService.showLoader();
		this.showInputFieldMessage = false;

		if (this.checkEstimatedTurnover == "true") {

			this.globalFilterDataObject = {
				filterData: [
					{ chip_group: "Status", chip_values: ["live"] },
					{ chip_group: "Preferences", chip_values: ["company must have trade data", "including estimated turnover"], preferenceOperator: [{ hasTradeData: "true" }] }
				]
			};

		} else {

			this.globalFilterDataObject = {
				filterData: [
					{ chip_group: "Status", chip_values: ["live"] },
					{ chip_group: "Preferences", chip_values: ["company must have trade data", "estimated turnover not included"], preferenceOperator: [{ hasTradeData: "true" }, { hasEstimatedTurnover: "false" }] }
				]
			};

		}

		if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {
			if (this.checkEstimatedTurnover == "true") {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [
							{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: "",
								financialBoolean: true,
								selected_year: "true"
							},
							{
								key: "estimated_turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: "",
								financialBoolean: true,
								selected_year: "true"
							}
						]
					}
				);
			} else {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [{
							key: "turnover",
							greater_than: this.selectedTurnOver['greaterThan'],
							less_than: "",
							financialBoolean: true,
							selected_year: "true"
						}]
					}
				);
			}
		} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0)) {
			if (this.checkEstimatedTurnover == "true") {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [
							{
								key: "turnover",
								greater_than: "",
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}, {
								key: "estimated_turnover",
								greater_than: "",
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}
						]
					}
				);
			} else {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [{
							key: "turnover",
							greater_than: "",
							less_than: this.selectedTurnOver['lessThan'],
							financialBoolean: true,
							selected_year: "true"
						}]
					}
				);
			}
		} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0)) {
			if (this.checkEstimatedTurnover == "true") {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [
							{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							},
							{
								key: "estimated_turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}
						]
					}
				);
			} else {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Key Financials", chip_values: [{
							key: "turnover",
							greater_than: this.selectedTurnOver['greaterThan'],
							less_than: this.selectedTurnOver['lessThan'],
							financialBoolean: true,
							selected_year: "true"
						}]
					}
				);
			}
		}

		if ( this.companyAgeLessThanOrGreaterThan == 'Greater Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
			// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.nameOrNumberValue];
			let chipVal = [ this.nameOrNumberValue, null];
			this.globalFilterDataObject.filterData.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [chipVal],
					// ageOperator: ["greater"]
				}
			)
		} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
			let chipVal = [null, this.nameOrNumberValue ];
			this.globalFilterDataObject.filterData.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [chipVal], 
					// ageOperator: ["less"]
				}
			)
		}

		if (this.selectedIndustryList && this.selectedIndustryList.length > 0) {

			let selectedIndustryLabels: Array<any> = [];

			for (let industryLabel of this.industryListDropdownOptions) {

				if (this.selectedIndustryList.includes(industryLabel['value'])) {

					selectedIndustryLabels.push(industryLabel['label']);
				}

			}

			this.globalFilterDataObject.filterData.push({
				chip_group: 'SIC Codes',
				chip_industry_sic_codes: this.selectedIndustryList,
				chip_values: selectedIndustryLabels
			});

		}

		if (this.selectedCommodityCodes && this.selectedCommodityCodes.length > 0) {

			let selectedCommodityLabels: Array<any> = [];

			for (let commodityLabel of this.listOfCommodityCodeOptions) {

				if (this.selectedCommodityCodes.includes(commodityLabel['value'])) {

					selectedCommodityLabels.push(commodityLabel['label']);
				}

			}

			this.globalFilterDataObject.filterData.push({
				chip_group: 'Commodity Code',
				chip_values: selectedCommodityLabels,
			});
		}

		if (this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0) {

			this.globalFilterDataObject.filterData.push(
				{
					chip_group: 'Region',
					chip_values: this.selectedRegionList
				}
			);

		}

		if ( this.selectedPeriodValue['fromDate'] && this.selectedPeriodValue['toDate'] ) {

            let chipVal = this.convertDate([this.selectedPeriodValue['fromDate'], this.selectedPeriodValue['toDate']]) ;
            let tempAray = [];
            tempAray = chipVal;
            let frmDate: any = chipVal[0];
            let todate: any = chipVal[1];
            let tempStr = 'From ' + frmDate.split('/').join('-') + ' to ' + todate.split('/').join('-');
            tempAray.push(tempStr);
            chipVal = tempAray;

            this.globalFilterDataObject.filterData.push(
                {
                    chip_group: 'Import/Export Period',
                    chip_values: [chipVal]
                }
            );

        }


		if (this.selectedImporter) {
			for (let data of this.globalFilterDataObject.filterData) {
				if (data.chip_group == 'Preferences') {
					data.chip_values = data.chip_values.filter((e) => !e.includes('trade data'))
					data.preferenceOperator = data.preferenceOperator.filter((obj) => !obj.hasTradeData)
					data.chip_values.push("Company must have import data")
					data.chip_values.push("Company must not have Export data")
					data.preferenceOperator.push(
						{
							"hasImportData": "true"
						},
						{
							"hasExportData": "false"
						}
					)
				}
			}
		}

		if (this.selectedExporter) {
			for (let data of this.globalFilterDataObject.filterData) {
				if (data.chip_group == 'Preferences') {
					data.chip_values = data.chip_values.filter((e) => !e.includes('trade data'))
					data.preferenceOperator = data.preferenceOperator.filter((obj) => !obj.hasTradeData)
					data.chip_values.push("Company must have export data")
					data.chip_values.push("Company must not have Import data")
					data.preferenceOperator.push(
						{
							"hasExportData": "true"
						},
						{
							"hasImportData": "false"
						}
					)
				}
			}
		}

		let obj = {
			reqObj: this.globalFilterDataObject
		}
		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'internationalTradeData', obj.reqObj ).subscribe(async res => {
			
			if (res.body.status == 200) {

				this.tradeCountsData[0].count = res.body.tradeCountsData.twelve_month_import_count ? res.body.tradeCountsData.twelve_month_import_count : 0;
				this.tradeCountsData[1].count = res.body.tradeCountsData.five_year_import_count ? res.body.tradeCountsData.five_year_import_count : 0;
				this.tradeCountsData[2].count = res.body.tradeCountsData.twelve_month_export_count ? res.body.tradeCountsData.twelve_month_export_count : 0;
				this.tradeCountsData[3].count = res.body.tradeCountsData.five_year_export_count ? res.body.tradeCountsData.five_year_export_count : 0;

				if (res.body.mapData) {

					this.ablInsightsMapData = res.body.mapData;
					if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

						this.initLeafletMapContainer( this.ablInsightsMapData );

					}

				}

				if (res.body.chartData) {
					await this.setGraphData(res.body.chartData);
				}

				if (res.body.industriesTableData) {
					let industriesTableDataSorted = {};

					for (let industryMonths in this.industryListMonthsTotal) {
						this.industryListMonthsTotal[industryMonths] = 0;
					}

					for (let industryData of res.body.industriesTableData) {
						for (let industryDataKey in industryData) {
							industriesTableDataSorted[industryDataKey] = industryData[industryDataKey];
						}
					}

					for (let industryDataSortedKey in industriesTableDataSorted) {
						industriesTableDataSorted[industryDataSortedKey] = industriesTableDataSorted[industryDataSortedKey].sort((a, b) => +a.month - +b.month);
					}

					for (let listData of this.industryListData) {

						for (let listKey in listData) {
							if (!['industryName', 'industrySicCodeValue'].includes(listKey)) {
								listData[listKey] = undefined;
							}
						}

						listData['totalValues'] = 0;


						for (let industryDataSortedKey in industriesTableDataSorted) {

							if (listData['industryName'] == industryDataSortedKey) {

								for (let innerIndustryData of industriesTableDataSorted[industryDataSortedKey]) {

									if (this.selectedIndustryList && this.selectedIndustryList.length > 0 && !this.selectedIndustryList.includes(listData['industrySicCodeValue'])) {

										listData['totalValues'] = 0;
										listData[this.monthsEnum[+innerIndustryData.month]] = 0;

									} else {

										listData['totalValues'] += innerIndustryData.count;
										listData[this.monthsEnum[+innerIndustryData.month]] = innerIndustryData.count;

									}

									if (this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]]) {

										this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]] += listData[this.monthsEnum[+innerIndustryData.month]];

									} else {

										this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]] = listData[this.monthsEnum[+innerIndustryData.month]];

									}

								}

							}

						}

					}

				}

				if (res.body.exportAmountData){

					for ( let exportAmountKey of this.exportAmount ) {
						for ( let exportAmountKeyRange of res.body.exportAmountData ) {
							if ( exportAmountKey.field == exportAmountKeyRange.field ) {
								exportAmountKey.count = exportAmountKeyRange['count'];
								exportAmountKey.count_percentage = exportAmountKeyRange['count_percentage'];
							}
						}
					}

				}
			}
			this.sharedLoaderService.hideLoader();

		});
	}

	setGraphData( graphData: Array<{ month: string, count: number }> ) {

		const ChartLabels = [], ChartDatasets = [];
		let exactMonthRange = this.getExactMonthRange( this.selectedPeriodValue.fromDate, this.selectedPeriodValue.toDate );

		if ( exactMonthRange.length ) {

			graphData = exactMonthRange.reduce( ( modfArr, currentValue ) => {

				let matchedItem = graphData.find( childValue => currentValue === childValue.month );
				modfArr.push( matchedItem );
				return modfArr;

			}, []);

		}

		for ( let gData of graphData ) {

			const { month, count } = gData;
			
			ChartLabels.push( this.monthsEnum[ +month ] );
			ChartDatasets.push( count );

		}

		this.tradeInsightsLineChartData = {
			labels: ChartLabels,
			datasets: [
				{
					data: ChartDatasets,
					backgroundColor: "rgba(33, 195, 181, .5)",
					fill: 'origin',
					borderColor: '#1eb0a3',
					pointRadius: 4,
					pointBackgroundColor: '#21c3b5',
					borderWidth: 1,
					pointStyle: 'circle',
					tension: 0.4

				}
			]
		}

		const onLineChartClick = ( event ) => {

			if ( this.tradeInsightsLineChart.chart.getElementsAtEventForMode( event, 'index', { intersect: true }, true ).length > 0 ) {

				if ( ChartDatasets[ this.tradeInsightsLineChart.chart.getElementsAtEventForMode( event, 'index', { intersect: true }, true )[0].index ] ) {

					let selectedMonth = ChartLabels[ this.tradeInsightsLineChart.chart.getElementsAtEventForMode( event, 'index', { intersect: true }, true )[0].index ],
						selectedMonthIndx = this.monthsEnum[ selectedMonth ].toString().padStart( 2, '0' );

					let chartArray = JSON.parse( JSON.stringify( this.globalFilterDataObject.filterData ) );

					if ( selectedMonthIndx ) {

						let internationalTradeMonthObj = {
							chip_group: "International Trade Month",
							chip_values: [ selectedMonthIndx ]
						}

						chartArray.push( internationalTradeMonthObj );
					}

					let urlStr: string = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( chartArray ) } } ) );

					window.open( urlStr, '_blank' );

				};

				return;

			}
		}
	
		this.lineOptions = {
			onClick: ( event ) => {
				onLineChartClick( event.native )
			},
			onHover: ( event, elements ) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						callback: (label) => {
							return label ?  this.toNumberSuffix.transform(label, 0) : 0;
						}
					},
					grid: {
						offsetGridLines: true,
						color: '#e6e6e6'
					}
				},
				x: {
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						padding: 5,
						callback: (label, index, labels) => {
							let chartLabel = this.tradeInsightsLineChartData.labels[label]
							if ( chartLabel != undefined ){
								return chartLabel.toUpperCase();
							}
						}
					},
					grid: {
						offset: true,
						color: '#e6e6e6'
					}
				}
			},
			plugins: {
				datalabels: {
					display: false
				},
				legend: {
					display: false
				},
				tooltip: {
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
				title: {
					display: true,
					text: 'Number of Companies',
					font: {
						family: 'Roboto',
						weight: 'bold',
						size: 14
					},
					color: '#000000',
					padding: 20
				},
			}

		}

		let months = [],
			graphDataSorted = graphData.sort((a, b) => +a.month - +b.month),
			lineChartDataset: Array<any> = [],
			monthfilterObj = this.globalFilterDataObject.filterData.filter(val => val.chip_group === 'Import/Export Period').map(res => res.chip_values),
			allMonths = [];
		for (let graphObj of graphDataSorted) {	
			if( !(months && months.length) ) {
				this.lineLabels.push(this.monthsEnum[+graphObj.month]);
				lineChartDataset.push(graphObj.count);
			} else {
				this.lineLabels = months;
				lineChartDataset.push(graphObj.count);
			}
		}

		let rangeOfMonth = ( monthfilterObj.length && allMonths.length ) ? allMonths : this.lineLabels;
		setTimeout(() => {
			this.industryListData.map( obj => {
				obj['tempTotal'] = 0;
				for ( let month of rangeOfMonth ){
					if ( obj[month] != undefined ){
						obj['tempTotal'] +=  obj[month];
					}
				}
			})

			this.industryListTotal = {};
			for ( let val of rangeOfMonth ){
				this.industryListTotal[val] = this.industryListMonthsTotal[val];

			}
		}, 500)
	}

	getExactMonthRange( fromDate: Date, toDate: Date ) {

		let exactMonthRangeArr = [];

		if ( fromDate && toDate ) {
			
			const FromYear = fromDate.getFullYear();
			const FromMonth = fromDate.getMonth() + 1;

			const ToYear = toDate.getFullYear();
			const ToMonth = ( FromYear < ToYear && FromMonth === ( toDate.getMonth() + 1 ) ) ? toDate.getMonth() : toDate.getMonth() + 1;

			const CreateRangeArr = ( start: number, stop: number, step: number ) => Array.from(
				{ length: ( stop - start ) / step + 1 },
				( v, i ) => ( start + i * step ).toString().padStart(2, '0')
			);

			let leftSideArr = FromYear < ToYear ? CreateRangeArr( FromMonth, 12, 1 ) : [];
			let rightSideArr = leftSideArr.length >= 12 ? [] : CreateRangeArr( ( FromYear == ToYear ) ? FromMonth : 1, ToMonth, 1 );

			rightSideArr = rightSideArr.filter( val => !leftSideArr.includes( val ) );

			exactMonthRangeArr = [ ...leftSideArr, ...rightSideArr ];

		}

		return exactMonthRangeArr;
		
	}

	/*
	setGraphData(graphData) {

		let lineChartDataset: Array<any> = [],
			lineText: string = undefined,
			graphDataSorted = graphData.sort((a, b) => +a.month - +b.month),
			tempMonthObj = [],
			allMonths = [],
			importExportMonthObj: any,
			months = [];

		let monthfilterObj = this.globalFilterDataObject.filterData.filter(val => val.chip_group === 'Import/Export Period').map(res => res.chip_values);

		if (monthfilterObj[0] && monthfilterObj[0][0] && this.impExportCheck ) {
			
			tempMonthObj.push( monthfilterObj[0][0][0].split('/')[1] , monthfilterObj[0][0][1].split('/')[1] );
			// tempMonthObj.sort();
			
			let fromYear = monthfilterObj[0][0][0].split('/')[2];
			let toYear = monthfilterObj[0][0][1].split('/')[2];
			
			let fromMonth = parseInt( tempMonthObj[0] );
			let toMonth = parseInt( tempMonthObj[1] );
			
			if( toYear !== fromYear ) {
				if ( ( toYear - fromYear) >= 2){
				
					for (let i = 1; i <= 12; i++) {
						if (i < 10) {
							allMonths.push("0" + i.toString());
						} else {
							allMonths.push(i.toString());
						}
					}

				} else {
				
					for (let i = fromMonth; i <= 12; i++) {
						if (i < 10) {
							allMonths.push("0" + i.toString());
						} else {
							allMonths.push(i.toString());
						}
					}
					
					for (let i = 1; i <= toMonth; i++) {
						let count = 0;
						for (let toCheck of allMonths ) {
	
							if ( toCheck != i.toString().padStart(2, '0') ) {
	
								count++;
								
								if ( count == allMonths.length ) {
									
									if (i < 10) {
										allMonths.push("0" + i.toString());
									} else {
										allMonths.push(i.toString());
									}
								}
							}
	
						}
					}

				}
				
			} else {

				for (var i = fromMonth; i <= toMonth; i++) {
					if (i < 10) {
						allMonths.push("0" + i.toString());
					} else {
						allMonths.push(i.toString());
					}
				}

			}
			
			importExportMonthObj = this.globalFilterDataObject.filterData.filter( val => val.chip_group == 'Preferences' ).map( res => res.chip_values );
			
			if( importExportMonthObj[0].length > 1) {
				
				for( let obj of importExportMonthObj[0] ) {
					
					if(obj == 'Company must have import data' || obj == 'Company must have export data' ) {
						
						let currentMonth = new Date().getMonth() + 1;
						let currentYear = new Date().getFullYear().toString();
						
						if ( currentYear === monthfilterObj[0][0][1].split('/')[2] && currentYear === monthfilterObj[0][0][0].split('/')[2]  ) {
							
							this.showDisplayMsg = true;
							
							if ( currentMonth.toString().padStart(2,'0') ===  monthfilterObj[0][0][1].split('/')[1] ) {
								
								allMonths = allMonths.slice(0, allMonths.length - 3);
								
							} else if ( (currentMonth - 1).toString().padStart(2,'0') ===  monthfilterObj[0][0][1].split('/')[1] ) {

								allMonths = allMonths.slice(0, allMonths.length - 2);
								
							} else if ( (currentMonth - 2).toString().padStart(2,'0') ===  monthfilterObj[0][0][1].split('/')[1] ) {

								allMonths = allMonths.slice(0, allMonths.length - 1);

							} else {

								allMonths = allMonths;

							}
						}
						
					}

				}

			}
			
			this.selectedMonthPeriod = allMonths;

			allMonths = allMonths.map( val => this.monthsEnum[+val] );
		}
		lineText = "Number of Companies";

		if (graphDataSorted && graphDataSorted.length < 3) {
			for (let labels of graphDataSorted) {
				if (graphDataSorted.length < 3) {
					if (+graphDataSorted[0].month > 3) {
						graphDataSorted.unshift({ month: (+graphDataSorted[0].month - 1).toString(), count: 0 });
					}
					if (+graphDataSorted[0].month < 3) {
						graphDataSorted.push({ month: (+graphDataSorted[graphDataSorted.length - 1].month + 1).toString(), count: 0 });
					}
				}
			}
		}
		
		let filteredValue = [];
		this.lineLabels = []

		for( let month of this.globalFilterDataObject.filterData ) {
			
			if( month.chip_group == 'Import/Export Period' ) {
				filteredValue.push( month.chip_values[0] );
			}
			
		}
		if ( filteredValue[0] && !this.impExportCheck) {
			
			let toYear = filteredValue[0][0].split('/')[2];
			let fromYear = filteredValue[0][1].split('/')[2];
			let fromMonth = parseInt( filteredValue[0][0].split('/')[1] );
			let toMonth = parseInt( filteredValue[0][1].split('/')[1] );
			
			if( toYear !== fromYear ) {
				
				for (let i = fromMonth; i <= 12; i++) {
					if (i < 10) {
						months.push("0" + i.toString());
					} else {
						months.push(i.toString());
					}
				}
				
				for (let i = 1; i <= toMonth; i++) {
					let count = 0;
					for (let toCheck of months ) {

						if ( toCheck != i.toString().padStart(2, '0') ) {

							count++;
							
							if ( count == months.length ) {
								
								if (i < 10) {
									months.push("0" + i.toString());
								} else {
									months.push(i.toString());
								}
							}
						}

					}
				}
				
			} else {
				
				let min = fromMonth;
				let max = toMonth;

				for (var i = min; i <= max; i++) {
					if (i < 10) {
						months.push("0" + i.toString());
					} else {
						months.push(i.toString());
					}
				}
				
			}
			
			months.sort();
			this.selectedMonthPeriod = months;
			months = months.map( val => this.monthsEnum[+val]);
			
		}
		
		for (let graphObj of graphDataSorted) {	
			if( !(months && months.length) ) {
				this.lineLabels.push(this.monthsEnum[+graphObj.month]);
				lineChartDataset.push(graphObj.count);
			} else {
				this.lineLabels = months;
				lineChartDataset.push(graphObj.count);
			}
		}

		let rangeOfMonth = ( monthfilterObj.length && allMonths.length ) ? allMonths : this.lineLabels;
		setTimeout(() => {
			this.industryListData.map( obj => {
				obj['tempTotal'] = 0;
				for ( let month of rangeOfMonth ){
					if ( obj[month] != undefined ){
						obj['tempTotal'] +=  obj[month];
					}
				}
			})

			this.industryListTotal = {};
			for ( let val of rangeOfMonth ){
				this.industryListTotal[val] = this.industryListMonthsTotal[val];

			}
		}, 500)

		lineChartDataset = lineChartDataset.slice(0,(monthfilterObj.length && allMonths.length) ? allMonths.length : this.lineLabels.length);
		
		this.tradeInsightsLineChartData = {
			labels: (monthfilterObj.length && allMonths.length) ? allMonths : this.lineLabels,
			datasets: [
				{
					data: lineChartDataset,
					backgroundColor: "rgba(33, 195, 181, .5)",
					fill: 'origin',
					borderColor: '#1eb0a3',
					pointRadius: 4,
					pointBackgroundColor: '#21c3b5',
					borderWidth: 1,
					pointStyle: 'circle',
					tension: 0.4

				}
			]
		}

		this.lineOptions = {
			onClick: (event) => {
				onLineChartClick(event.native)
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						callback: (label) => {
							return label ?  this.toNumberSuffix.transform(label, 0) : 0;
						}
					},
					grid: {
						offsetGridLines: true,
						color: '#e6e6e6'
					}
				},
				x: {
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						padding: 5,
						callback: (label, index, labels) => {
							let chartLabel = this.tradeInsightsLineChartData.labels[label]
							if ( chartLabel != undefined ){
								return chartLabel.toUpperCase();
							}
						}
					},
					grid: {
						offset: true,
						color: '#e6e6e6'
					}
				}
			},
			plugins: {
				datalabels: {
					display: false
				},
				legend: {
					display: false
				},
				tooltip: {
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
				title: {
					display: true,
					text: lineText,
					font: {
						family: 'Roboto',
						weight: 'bold',
						size: 14
					},
					color: '#000000',
					padding: 20
				},
			}

		}

		let _this = this;

		function onLineChartClick(event) {

			if (_this.tradeInsightsLineChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true).length > 0) {

				if (lineChartDataset[_this.tradeInsightsLineChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true)[0].index]) {

					let selectedMonth = _this.lineLabels[_this.tradeInsightsLineChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true)[0].index], selectedMonthIndx;

					for (let monthIndx in _this.monthsEnum) {
						if (selectedMonth == _this.monthsEnum[monthIndx]) {
							selectedMonthIndx = monthIndx.length < 2 ? ('0' + monthIndx) : monthIndx;
						}
					}

					let chartArray = JSON.parse(JSON.stringify(_this.globalFilterDataObject.filterData))

					if (selectedMonthIndx) {
						selectedMonthIndx = selectedMonthIndx.toString().length < 2 ? ('0' + selectedMonthIndx) : selectedMonthIndx;
						let internationalTradeMonthObj = {
							chip_group: "International Trade Month",
							chip_values: [selectedMonthIndx]
						}
						chartArray.push(internationalTradeMonthObj)
					}

					let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(chartArray) } }));



					window.open(urlStr, '_blank');

				};

				return;

			}

		}

	}
	*/

	goToSearchTradeForIndustry(industryName, industryValue, chargesMonth, chargeStatus) {

		if (industryName == undefined && industryValue == undefined && chargesMonth == undefined) {

			this.globalFilterDataObject.filterData.push(
				{
					chip_group: "Charges Status",
					chip_values: [chargeStatus]
				}
			);
			
			let urlStr: string = String(this.router.createUrlTree(['/landscape-companies-list'], { queryParams: { listFor: "internationalTrade" } }));

			window.open(urlStr, '_blank');

		} else {
			chargesMonth = chargesMonth.toString().length < 2 ? ('0' + chargesMonth) : chargesMonth;

			this.globalFilterDataObject.filterData.push(
				{
					chip_group: "Industry",
					chip_values: [industryName],
					chip_industry_sic_codes: [industryValue]
				}
			);
			
			let urlStr: string = String(this.router.createUrlTree(['/landscape-companies-list'], { queryParams: { listFor: "internationalTrade" } }));
			window.open(urlStr, '_blank');
		}
	}

	getDataForDropdownLists(requestingDataFor) {

		this.sharedLoaderService.showLoader();

		let otherRequiredKeys: any = [
			{ chip_group: "Status", chip_values: ["live"] }
		];

		if (this.selectedIndustryList && this.selectedIndustryList.length > 0) {

			let selectedIndustryLabels: Array<any> = [];

			for (let industryLabel of this.industryListDropdownOptions) {

				if (this.selectedIndustryList.includes(industryLabel['value'])) {

					selectedIndustryLabels.push(industryLabel['label']);
				}

			}

			otherRequiredKeys.push({
				chip_group: 'SIC Codes',
				chip_industry_sic_codes: this.selectedIndustryList,
				chip_values: selectedIndustryLabels
			});

		}

		if (this.selectedCommodityCodes && this.selectedCommodityCodes.length > 0) {

			let selectedCommodityLabels: Array<any> = [];

			for (let commodityLabel of this.listOfCommodityCodeOptions) {

				if (this.selectedCommodityCodes.includes(commodityLabel['value'])) {

					selectedCommodityLabels.push(commodityLabel['label']);
				}

			}

			otherRequiredKeys.push({
				chip_group: 'Commodity Code',
				chip_values: selectedCommodityLabels
			});
		}

		if (this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0) {

			otherRequiredKeys.push(
				{
					chip_group: 'Region',
					chip_values: this.selectedRegionList
				}
			);

		}
	}

	convertDate(data) {
		let tempDate: Array<any> = [];
		for (let i = 0; i < data.length; i++) {
			var date = new Date(data[i]),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);

			tempDate.push([day, mnth, date.getFullYear()].join("/"));
		}
		return (tempDate);
	}

	getYearsForDropDown() {
		let staticYear = 2013;
		let maxYear = this.maxYear;
		let yearsArraysForDropdown: Array<any> = [];
		for (let i = maxYear; i >= staticYear; i--) {
			let obj = {}
			obj["label"] = i;
			obj["value"] = i;
			yearsArraysForDropdown.push(obj);
		}
		return (yearsArraysForDropdown)
	}

	onCheckedPreferences(event, obj) {
		this.impExportCheck = event.checked;
		
		if (event && obj.checkBoxName == 'Importer') {
			this.selectedExporter = false;
		} else if (event && obj.checkBoxName == 'Exporter') {
			this.selectedImporter = false;
		}
	}

	goToSearchData(chipDataValueTo, chipDataValueFrom){
		chipDataValueTo = chipDataValueTo ? + chipDataValueTo : chipDataValueTo;
		chipDataValueFrom = chipDataValueFrom ? + chipDataValueFrom : chipDataValueFrom;
		let industryFilterArray = JSON.parse(JSON.stringify(this.globalFilterDataObject.filterData))
		
			industryFilterArray.push(
				{
					chip_group: "Export Amount (in £)",
					chip_values:
					[ [chipDataValueTo, chipDataValueFrom] ]
					
				}
			);
			let urlStr: string = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(industryFilterArray) } }));

			window.open(urlStr, '_blank');
	}

	goToSearchAblForIndustry(industryName, industryValue, tradeMonth) {

		let industryFilterArray = JSON.parse(JSON.stringify(this.globalFilterDataObject.filterData))
		let sicCodeObj = {
			chip_group: "SIC Codes",
			chip_values: [industryName],
			chip_industry_sic_codes: [industryValue],
		}
		if (industryFilterArray.length === 0) {
			industryFilterArray.push(sicCodeObj);
		} else {
			let tempArray = industryFilterArray.filter(obj => obj.chip_group === "SIC Codes")
			if (tempArray.length === 0) {
				industryFilterArray.push(sicCodeObj)
			} else {
				let index = industryFilterArray.indexOf(tempArray[0]);
				industryFilterArray.splice(index, 1)
				industryFilterArray.push(sicCodeObj)
			}

			if (tradeMonth) {
				tradeMonth = tradeMonth.toString().length < 2 ? ('0' + tradeMonth) : tradeMonth;
				let internationalTradeMonthObj = {
					chip_group: "International Trade Month",
					chip_values: [tradeMonth]
				}
				industryFilterArray.push(internationalTradeMonthObj)
			}
		}

		let urlStr: string = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(industryFilterArray) } }));

		window.open(urlStr, '_blank');
	}

	validateInputField( inputValue ) {

		if ( inputValue > 999 ) {
			this.showInputFieldMessage = true;
		} else {
            this.showInputFieldMessage = false;
        }
		
	}

}
