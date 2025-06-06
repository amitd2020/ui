
import { FeatureCollection, Point } from 'geojson';
import * as L from 'leaflet';

export const ukRegions = [
    { name: 'Wales', latitude: 52.7126, longitude: -3.8652 },
    { name: 'London', latitude: 51.5074, longitude: -0.1278 },
    { name: 'south_east', latitude: 50.85, longitude: 0.6 },
    { name: 'Northern Ireland', latitude: 54.7877, longitude: -5.979 },
    { name: 'Scotland', latitude: 56.4907, longitude: -4.2026 },
    { name: 'south_west', latitude: 50.38, longitude: 50.38 },
    { name: 'east_of_england', latitude: 52.35, longitude: 0.9999999 },
    { name: 'west_midlands', latitude: 52.75, longitude: -12 },
    { name: 'east_midlands', latitude: 53.35, longitude: -0.3 },
    { name: 'north_west', latitude: 53.9, longitude: -7.5 },
    { name: 'north_east', latitude: 55.50, longitude: -1.7 }
];

export const dropdownMultiCheckboxArray = [
  {
      label: 'Industry',
      chipGroup: 'SIC Codes',
      options: [],
      ngModel: [],
      placeHolder: 'Select Industry',
      key: '',
      withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }
  },
  {
      label: 'Region',
      options: [],
      ngModel: [],
      autoSelect: ['London'],
      placeHolder: 'Select Region',
      key: 'RegAddress_Modified.region.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }
  },
  // {
  //     label: 'Post Code',
  //     options: [],
  //     ngModel: [],
  //     placeHolder: 'Select Post Code',
  //     key: 'RegAddress_Modified.postalCode.keyword',
  //     withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }
  // },
  {
      label: 'County',
      options: [],
      ngModel: [],
      placeHolder: 'Select County',
      key: 'RegAddress_Modified.county.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }
  },
  {
      label: 'District Council',
      chipGroup: 'District Council',
      options: [],
      ngModel: [],
      placeHolder: 'Select District Council',
      key: 'RegAddress_Modified.districtCouncil.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' },
      disable: false,
  },
  {
      label: 'County Council',
      options: [],
      ngModel: [],
      placeHolder: 'Select County Council',
      key: 'RegAddress_Modified.countyCouncil.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' },
      disable: false,
  },
  {
      label: 'Unitary Council',
      options: [],
      ngModel: [],
      placeHolder: 'Select Unitary Council',
      key: 'RegAddress_Modified.unitaryCouncil.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' },
      disable: false,
  },
  {
      label: 'Metropolitan Council',
      options: [],
      ngModel: [],
      placeHolder: 'Select Metropolitan Council',
      key: 'RegAddress_Modified.metropolitanCouncil.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' },
      disable: false,
  },
  {
      label: 'London Boroughs Council',
      options: [],
      ngModel: [],
      placeHolder: 'Select London Boroughs Council',
      key: 'RegAddress_Modified.londonBoroughsCouncil.keyword',
      withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' },
      disable: false,
  },
];

export const geojsonFeature: FeatureCollection<Point, { name: string }> = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'England' },
            geometry: {
                type: 'Point',
                coordinates: [-1.1743, 52.3555],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Scotland' },
            geometry: {
                type: 'Point',
                coordinates: [-4.2026, 56.4907],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Wales' },
            geometry: {
                type: 'Point',
                coordinates: [-3.8652, 52.7126],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Northern Ireland' },
            geometry: {
                type: 'Point',
                coordinates: [-5.979, 54.7877],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'London' },
            geometry: {
                type: 'Point',
                coordinates: [-0.1278, 51.5074],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Manchester' },
            geometry: {
                type: 'Point',
                coordinates: [-2.2426, 53.4831],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Edinburgh' },
            geometry: {
                type: 'Point',
                coordinates: [-3.1883, 55.9533],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Cardiff' },
            geometry: {
                type: 'Point',
                coordinates: [-3.1791, 51.4816],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Belfast' },
            geometry: {
                type: 'Point',
                coordinates: [-5.9301, 54.5973],
            },
        },
    ],
};

export const mapData = {
    "totalCompanies": 670,

    "industry": [
      {
        "industry": "manufacturing",
        "count": 36,
        "count_percentage": 19.148936170212767
      },
      {
        "industry": "construction",
        "count": 24,
        "count_percentage": 12.76595744680851
      },
      {
        "industry": "wholesale and retail trade; repair of motor vehicles and motorcycles",
        "count": 23,
        "count_percentage": 12.23404255319149
      },
      {
        "industry": "administrative and support service activities",
        "count": 15,
        "count_percentage": 7.9787234042553195
      },
      {
        "industry": "other service activities",
        "count": 7,
        "count_percentage": 3.723404255319149
      },
      {
        "industry": "professional, scientific and technical activities",
        "count": 7,
        "count_percentage": 3.723404255319149
      },
      {
        "industry": "transportation and storage",
        "count": 7,
        "count_percentage": 3.723404255319149
      },
      {
        "industry": "information and communication",
        "count": 5,
        "count_percentage": 2.6595744680851063
      },
      {
        "industry": "accommodation and food service activities",
        "count": 4,
        "count_percentage": 2.127659574468085
      },
      {
        "industry": "arts, entertainment and recreation",
        "count": 4,
        "count_percentage": 2.127659574468085
      },
      {
        "industry": "human health and social work activities",
        "count": 2,
        "count_percentage": 1.0638297872340425
      },
      {
        "industry": "electricity, gas, steam and air conditioning supply",
        "count": 1,
        "count_percentage": 0.5319148936170213
      },
      {
        "industry": "financial and insurance activities",
        "count": 1,
        "count_percentage": 0.5319148936170213
      },
      {
        "industry": "water supply, sewerage, waste management and remediation activities",
        "count": 1,
        "count_percentage": 0.5319148936170213
      },
      {
        "industry": "not specified",
        "count": 51,
        "count_percentage": 27.127659574468083
      }
    ],


    "region": [
      {
        "field": "london",
        "count": 400
      },
      {
        "field": "north east",
        "count": 200
      },
      {
        "field": "west midlands",
        "count": 70
      }
    ],
    "county": [
      {
        "field": "greater london",
        "count": 670,
        "latLong": [
          51.4893335,
          -0.14405508452768728
        ]
      }
    ],
    "postCode": [
      {
        "field": "WC2H9JQ",
        "count": 279,
        "latLong": [
          51.514897,
          -0.123615
        ]
      },
      {
        "field": "EC1V2NX",
        "count": 194,
        "latLong": [
          51.527304,
          -0.088894
        ]
      },
      {
        "field": "N17GU",
        "count": 134,
        "latLong": [
          51.530737,
          -0.09371
        ]
      },
      {
        "field": "NW107PQ",
        "count": 63,
        "latLong": [
          51.530737,
          -0.09371
        ]
      }
    ],

    "employees_analysis": [
      {
        "field": "not specified",
        "count": 188,
        "count_percentage": 100,
        "label": "Not Specified",
        "value": {
          "rangeFrom": "",
          "rangeTo": "not specified"
        }
      },
      {
        "field": "1-2",
        "count": 0,
        "count_percentage": 0,
        "label": "1 to 2",
        "value": {
          "rangeFrom": "1",
          "rangeTo": "2"
        }
      },
      {
        "field": "3-5",
        "count": 0,
        "count_percentage": 0,
        "label": "3 to 5",
        "value": {
          "rangeFrom": "3",
          "rangeTo": "5"
        }
      },
      {
        "field": "6-10",
        "count": 0,
        "count_percentage": 0,
        "label": "6 to 10",
        "value": {
          "rangeFrom": "6",
          "rangeTo": "10"
        }
      },
      {
        "field": "11-25",
        "count": 0,
        "count_percentage": 0,
        "label": "11 to 25",
        "value": {
          "rangeFrom": "11",
          "rangeTo": "25"
        }
      },
      {
        "field": "26-50",
        "count": 0,
        "count_percentage": 0,
        "label": "26 to 50",
        "value": {
          "rangeFrom": "26",
          "rangeTo": "50"
        }
      },
      {
        "field": "51-100",
        "count": 0,
        "count_percentage": 0,
        "label": "51 to 100",
        "value": {
          "rangeFrom": "51",
          "rangeTo": "100"
        }
      },
      {
        "field": "101-250",
        "count": 0,
        "count_percentage": 0,
        "label": "101 to 250",
        "value": {
          "rangeFrom": "101",
          "rangeTo": "250"
        }
      },
      {
        "field": "251-500",
        "count": 0,
        "count_percentage": 0,
        "label": "251 to 500",
        "value": {
          "rangeFrom": "251",
          "rangeTo": "500"
        }
      },
      {
        "field": "501-1000",
        "count": 0,
        "count_percentage": 0,
        "label": "501 to 1000",
        "value": {
          "rangeFrom": "501",
          "rangeTo": "1000"
        }
      },
      {
        "field": "1000+",
        "count": 0,
        "count_percentage": 0,
        "label": "1000+",
        "value": {
          "rangeFrom": "1001",
          "rangeTo": ""
        }
      }
    ],


    "financialTurnoversPlusEstimatedTurnoversArray": [
      {
        "field": "not specified",
        "count": 0,
        "count_percentage": null,
        "label": "Not Specified",
        "value": {
          "greaterThan": "",
          "lessThan": "not specified"
        }
      },
      {
        "field": "1to1M",
        "count": 0,
        "label": "1 to 1M",
        "value": {
          "greaterThan": "1",
          "lessThan": "1000000"
        },
        "count_percentage": null
      },
      {
        "field": "1Mto5M",
        "count": 0,
        "label": "1M to 5M",
        "value": {
          "greaterThan": "1000000",
          "lessThan": "5000000"
        },
        "count_percentage": null
      },
      {
        "field": "5Mto10M",
        "count": 0,
        "label": "5M to 10M",
        "value": {
          "greaterThan": "5000000",
          "lessThan": "10000000"
        },
        "count_percentage": null
      },
      {
        "field": "10Mto100M",
        "count": 0,
        "label": "10M to 100M",
        "value": {
          "greaterThan": "10000000",
          "lessThan": "100000000"
        },
        "count_percentage": null
      },
      {
        "field": "100Mto500M",
        "count": 0,
        "label": "100M to 500M",
        "value": {
          "greaterThan": "100000000",
          "lessThan": "500000000"
        },
        "count_percentage": null
      },
      {
        "field": "500Mto1B",
        "count": 0,
        "label": "500M to 1B",
        "value": {
          "greaterThan": "500000000",
          "lessThan": "1000000000"
        },
        "count_percentage": null
      },
      {
        "field": "greaterThan1B",
        "count": 0,
        "label": "Greater Than 1B",
        "value": {
          "greaterThan": "1000000000",
          "lessThan": ""
        },
        "count_percentage": null
      },
      {
        "field": "greaterThan10B",
        "count": 0,
        "label": "Greater Than 10B",
        "value": {
          "greaterThan": "10000000000",
          "lessThan": ""
        },
        "count_percentage": null
      }
    ],

    "turnoverArray": [
      {
        "field": "1to1M",
        "count": 0,
        "count_percentage": 0,
        "label": "1 to 1M",
        "value": {
          "greaterThan": "1",
          "lessThan": "1000000"
        }
      },
      {
        "field": "1Mto5M",
        "count": 0,
        "count_percentage": 0,
        "label": "1M to 5M",
        "value": {
          "greaterThan": "1000000",
          "lessThan": "5000000"
        }
      },
      {
        "field": "5Mto10M",
        "count": 0,
        "count_percentage": 0,
        "label": "5M to 10M",
        "value": {
          "greaterThan": "5000000",
          "lessThan": "10000000"
        }
      },
      {
        "field": "10Mto100M",
        "count": 0,
        "count_percentage": 0,
        "label": "10M to 100M",
        "value": {
          "greaterThan": "10000000",
          "lessThan": "100000000"
        }
      },
      {
        "field": "100Mto500M",
        "count": 0,
        "count_percentage": 0,
        "label": "100M to 500M",
        "value": {
          "greaterThan": "100000000",
          "lessThan": "500000000"
        }
      },
      {
        "field": "500Mto1B",
        "count": 0,
        "count_percentage": 0,
        "label": "500M to 1B",
        "value": {
          "greaterThan": "500000000",
          "lessThan": "1000000000"
        }
      },
      {
        "field": "greaterThan1B",
        "count": 0,
        "count_percentage": 0,
        "label": "Greater Than 1B",
        "value": {
          "greaterThan": "1000000000",
          "lessThan": ""
        }
      },
      {
        "field": "greaterThan10B",
        "count": 0,
        "count_percentage": 0,
        "label": "Greater Than 10B",
        "value": {
          "greaterThan": "10000000000",
          "lessThan": ""
        }
      },
      {
        "field": "not specified",
        "count": 188,
        "count_percentage": 0,
        "label": "Not Specified",
        "value": {
          "greaterThan": "",
          "lessThan": "not specified"
        }
      }
    ],

    "turnoverGrowth3YearsInfo": [
      {
        "field": "not specified",
        "count": 188,
        "count_percentage": 100,
        "label": "Not Specified",
        "value": {
          "greaterThan": "",
          "lessThan": "not specified"
        }
      },
      {
        "field": "less_than_25",
        "count": 0,
        "count_percentage": 0,
        "label": "Less Than 25",
        "value": {
          "greaterThan": "",
          "lessThan": "25"
        }
      },
      {
        "field": "26-50",
        "count": 0,
        "count_percentage": 0,
        "label": "26-50",
        "value": {
          "greaterThan": "26",
          "lessThan": "50"
        }
      },
      {
        "field": "51-75",
        "count": 0,
        "count_percentage": 0,
        "label": "51-75",
        "value": {
          "greaterThan": "51",
          "lessThan": "75"
        }
      },
      {
        "field": "76-100",
        "count": 0,
        "count_percentage": 0,
        "label": "76-100",
        "value": {
          "greaterThan": "76",
          "lessThan": "100"
        }
      },
      {
        "field": "above_100",
        "count": 0,
        "count_percentage": 0,
        "label": "100+",
        "value": {
          "greaterThan": "101",
          "lessThan": ""
        }
      }
    ],

    "turnoverGrowth1YearInfo": [
      {
        "field": "not specified",
        "count": 188,
        "count_percentage": 100,
        "label": "Not Specified",
        "value": {
          "greaterThan": "",
          "lessThan": "not specified"
        }
      },
      {
        "field": "less_than_25",
        "count": 0,
        "count_percentage": 0,
        "label": "Less Than 25",
        "value": {
          "greaterThan": "",
          "lessThan": "25"
        }
      },
      {
        "field": "26-50",
        "count": 0,
        "count_percentage": 0,
        "label": "26-50",
        "value": {
          "greaterThan": "26",
          "lessThan": "50"
        }
      },
      {
        "field": "51-75",
        "count": 0,
        "count_percentage": 0,
        "label": "51-75",
        "value": {
          "greaterThan": "51",
          "lessThan": "75"
        }
      },
      {
        "field": "76-100",
        "count": 0,
        "count_percentage": 0,
        "label": "76-100",
        "value": {
          "greaterThan": "76",
          "lessThan": "100"
        }
      },
      {
        "field": "above_100",
        "count": 0,
        "count_percentage": 0,
        "label": "100+",
        "value": {
          "greaterThan": "101",
          "lessThan": ""
        }
      }
    ],
    
    "turnoverGrowth5YearsInfo": [
      {
        "field": "not specified",
        "count": 188,
        "count_percentage": 100,
        "label": "Not Specified",
        "value": {
          "greaterThan": "",
          "lessThan": "not specified"
        }
      },
      {
        "field": "less_than_25",
        "count": 0,
        "count_percentage": 0,
        "label": "Less Than 25",
        "value": {
          "greaterThan": "",
          "lessThan": "25"
        }
      },
      {
        "field": "26-50",
        "count": 0,
        "count_percentage": 0,
        "label": "26-50",
        "value": {
          "greaterThan": "26",
          "lessThan": "50"
        }
      },
      {
        "field": "51-75",
        "count": 0,
        "count_percentage": 0,
        "label": "51-75",
        "value": {
          "greaterThan": "51",
          "lessThan": "75"
        }
      },
      {
        "field": "76-100",
        "count": 0,
        "count_percentage": 0,
        "label": "76-100",
        "value": {
          "greaterThan": "76",
          "lessThan": "100"
        }
      },
      {
        "field": "above_100",
        "count": 0,
        "count_percentage": 0,
        "label": "100+",
        "value": {
          "greaterThan": "101",
          "lessThan": ""
        }
      }
    ],

    "risk_analysis": [
        {
          "field": "veryLowRisk",
          "count": 8,
          "count_percentage": 30.76923076923077
        },
        {
          "field": "lowRisk",
          "count": 7,
          "count_percentage": 26.923076923076923
        },
        {
          "field": "moderateRisk",
          "count": 5,
          "count_percentage": 19.230769230769234
        },
        {
          "field": "notScored",
          "count": 5,
          "count_percentage": 19.230769230769234
        },
        {
          "field": "highRisk",
          "count": 1,
          "count_percentage": 3.8461538461538463
        }
    ],

    "yearly_employees": [
      {
        "year": 2020,
        "count": 2121
      },
      {
        "year": 2021,
        "count": 2154
      },
      {
        "year": 2022,
        "count": 2121
      },
      {
        "year": 2023,
        "count": 2421
      },
      {
        "year": 2024,
        "count": 2421
      }
    ],
    "yearly_turnover": [
      {
        "year": 2020,
        "count": 2121
      },
      {
        "year": 2021,
        "count": 2154
      },
      {
        "year": 2022,
        "count": 2121
      },
      {
        "year": 2023,
        "count": 2421
      },
      {
        "year": 2024,
        "count": 2421
      }
    ],
    "yearly_new_registered_company": [
      {
        "year": 2020,
        "count": 2121
      },
      {
        "year": 2021,
        "count": 2154
      },
      {
        "year": 2022,
        "count": 2121
      },
      {
        "year": 2023,
        "count": 2421
      },
      {
        "year": 2024,
        "count": 2421
      }
    ],


    "result": [
      {
        "companyContactInformation": {
          "company_name": "OTTER STOP LIMITED",
          "company_reg": "08403289",
          "companyStatus": "live",
          "logo": "https://static-exp1.licdn.com/sc/h/9rxpcj33wtsq3w7nxb3u3ku6e"
        },
        "latLong": [
          51.3852947,
          -0.1099483
        ],
        "industryType": "agriculture forestry and fishing"
      }
    ]
}

export const mapLayerStoreData = {
    openStreetMapLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),

    googleMapsLayer: L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),

    Thunderforest_Neighbourhood: L.tileLayer('https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=75316729042d4837aea9c796ff17c5e8', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),

    Landscape: L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=75316729042d4837aea9c796ff17c5e8', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),

    Transport: L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=75316729042d4837aea9c796ff17c5e8', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
}