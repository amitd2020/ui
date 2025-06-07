let columnArragement = ['title', 'buyerName', 'lowValueOfContract', 'highValueOfContract',  'publishedDate', 'closingDate', 'contractStartDate', 'contractEndDate', , 'procurementStage', 'procurementType', 'locationOfContract', 'cpvCode' ];

let columnArragement2 = [ 'title', 'awardedValue',  'publishedDate', 'closingDate', 'contractStartDate', 'contractEndDate', 'lowValueOfContract', 'highValueOfContract', 'buyerName', 'suppliersName', 'procurementStage', 'procurementType', 'locationOfContract', 'cpvCode' ]

let additionalColumns = [
	{ field: 'lowValueOfContract', header: 'Low value of contract', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
	{ field: 'highValueOfContract', header: 'High value of contract', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
	{ field: 'publishedDate', header: 'Published Date', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
	{ field: 'closingDate', header: 'Closing date', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
]

const Scenerios: Array<any> = [

	//? *********** Contract-Pre Procurement-Pipeline (OPEN)  ****************
	{
	  match: [
		{ chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "contract", "preprocurement", "pipeline" ] },
		{ chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "open" ] }
		
	  ],
	  include: columnArragement2,
	  addcolumn: additionalColumns,
	  screen: 'screen2',
	  graph: [	
		{ graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		{ graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },

		{ graphKey: 'closingDate', header: 'CLOSING DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
	  ],
	},
	//? *********** Contract-Pre Procurement-Pipeline (CLOSED)  ****************
	{
	  match: [
		{ chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "contract", "preprocurement", "pipeline" ] },
		{ chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "closed" ] }
		
	  ],
	  include: columnArragement2,
	  addcolumn: additionalColumns,
	  screen: 'screen2',
	  graph: [	
		{ graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		{ graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },

		{ graphKey: 'ojeuContractTypePreviousSixMonthClosedDate', header: 'CONTRACT END DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		{ graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
	  ],
	},

	//? *********** Contract-Pipeline (OPEN)  ****************
	{
	  match: [
		{ chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "contract", "pipeline" ] },
		{ chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "open" ] }
		
	  ],
	  include: columnArragement2,
	  addcolumn: additionalColumns,
	  screen: 'screen2',
	  graph: [	
		{ graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		{ graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },

		{ graphKey: 'closingDate', header: 'CLOSING DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
	  ],
	},
	//? *********** Contract-Procurement (OPEN)  ****************
	{
	  match: [
		{ chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "contract", "preprocurement" ] },
		{ chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "open" ] }
		
	  ],
	  include: columnArragement2,
	  addcolumn: additionalColumns,
	  screen: 'screen2',
	  graph: [	
		{ graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		{ graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },

		{ graphKey: 'closingDate', header: 'CLOSING DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
	  ],
	},
	//? *********** Pipeline-Procurement (OPEN)  ****************
	{
	  match: [
		{ chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "pipeline", "preprocurement" ] },
		{ chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "open" ] }
		
	  ],
	  include: columnArragement2,
	  addcolumn: additionalColumns,
	  screen: 'screen2',
	  graph: [	
		{ graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		{ graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },

		{ graphKey: 'ojeuContractTypePreviousSixMonthClosedDate', header: 'CLOSING DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		{ graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
	  ],
	},
	//? *********** Contract-Pipeline (CLOSED)  ****************
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: [ "contract", "pipeline" ] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: [ "closed" ] }
		  
		],
		include: columnArragement2,
		addcolumn: additionalColumns,
		screen: 'screen2',
		graph: [	
		  { graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		  { graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },
  
		  { graphKey: 'ojeuContractTypePreviousSixMonthClosedDate', header: 'CONTRACT END DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		  { graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
		],
	},
	//? *********** Contract-preprocurement (CLOSED)  ****************
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["contract", "preprocurement"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["closed"] }
		  
		],
		include: columnArragement2,
		addcolumn: additionalColumns,
		screen: 'screen2',
		graph: [	
		  { graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		  { graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },
  
		  { graphKey: 'ojeuContractTypePreviousSixMonthClosedDate', header: 'CONTRACT END DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		  { graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
		],
	},
	//? *********** pipeline-preprocurement (CLOSED)  ****************
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["pipeline", "preprocurement"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["closed"] }
		  
		],
		include: columnArragement2,
		addcolumn: additionalColumns,
		screen: 'screen2',
		graph: [	
		  { graphKey: 'procurementStage', header: 'PROCUREMENT STAGE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph', fn: function func( callDataPrepared ) { callDataPrepared() }, graphData: {} },
		  { graphKey: 'contractType', header: 'PROCUREMENT TYPE', chartHeight: '248px', maindivClass: 'col-6', graphOption: 'verticalGraph',  fn: function func( callDataPrepared ) { callDataPrepared() } },
  
		  { graphKey: 'ojeuContractTypePreviousSixMonthClosedDate', header: 'CONTRACT END DATE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} },
		  { graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE', chartHeight: '200px', maindivClass: 'col-12', graphData: {} }
		],
	},

	//? *********** Contract  ****************
	{
		match: [
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["awarded"] },
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["contract"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypePreviousMonthStartDate', header: 'CONTRACT START DATE' },
			{ graphKey: 'ojeuContractTypeNextMonthEndDate', header: 'CONTRACT END DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: [ 'title', 'awardedValue', 'contractStartDate', 'contractEndDate', 'buyerName', 'suppliersName', 'procurementStage', 'procurementType', 'locationOfContract', 'cpvCode' ]
	},
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["contract"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["open"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypePreviousMonthPublishedDate', header: 'PUBLISHED DATE' },
			{ graphKey: 'closingDate', header: 'CLOSING DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: ['title', 'buyerName', 'lowValueOfContract', 'highValueOfContract',  'publishedDate', 'closingDate', 'contractStartDate', 'contractEndDate', , 'procurementStage', 'procurementType', 'locationOfContract', 'cpvCode' ],
		addcolumn: additionalColumns
	},
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["contract"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["closed"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypePreviousMonthStartDate', header: 'CONTRACT START DATE' },
			{ graphKey: 'ojeuContractTypeNextMonthEndDate', header: 'CONTRACT END DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: ['title', 'buyerName', 'lowValueOfContract', 'highValueOfContract',  'publishedDate', 'closingDate', 'contractStartDate', 'contractEndDate', , 'procurementStage', 'procurementType', 'locationOfContract', 'cpvCode' ],
		addcolumn: additionalColumns
	},

	//? *********** pipeline  ****************
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["pipeline"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["open"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypePreviousMonthPublishedDate', header: 'PUBLISHED DATE' },
			{ graphKey: 'closingDate', header: 'CLOSING DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: columnArragement,
		addcolumn: additionalColumns
	},
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["pipeline"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["closed"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypeNextMonthStartDate', header: 'CONTRACT START DATE' },
			{ graphKey: 'ojeuContractTypePreviousMonthEndDate', header: 'CONTRACT END DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: columnArragement,
		addcolumn: additionalColumns
	},

	//? *********** preprocurement  ****************
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["preprocurement"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["open"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypePreviousMonthPublishedDate', header: 'PUBLISHED DATE' },
			{ graphKey: 'closingDate', header: 'CLOSING DATE' },
			{ graphKey: 'suitableForSMEandVCSE', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: columnArragement,
		addcolumn: additionalColumns
	},
	{
		match: [
		  { chip_group: "Procurement Stage", label: "Procurement Stage", chip_values: ["preprocurement"] },
		  { chip_group: "Procurement Stage Status", label: "Procurement Stage Status", chip_values: ["closed"] }
		  
		],
		screen: 'screen3',
		graph: [
			{ graphKey: 'ojeuContractTypeNextMonthStartDate', header: 'CONTRACT START DATE' },
			{ graphKey: 'ojeuContractTypePreviousMonthEndDate', header: 'CONTRACT END DATE' },
			{ graphKey: 'suitableForSMEandVCSEobjPreviousSixMonths', header: 'SUITABLE FOR SME/VCSE' }
		],
		include: columnArragement,
		addcolumn: additionalColumns
	}

]

export { Scenerios }