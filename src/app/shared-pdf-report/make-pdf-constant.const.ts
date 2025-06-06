import { PageConfig } from "./page-config.interface";

export const pageConfigsStore: PageConfig[] = [
    {
        key: 'frontPage',
        title: '',
        description: '',
        headerImage: 'pdf/first_page.svg',
        layout: {
            type: 'custom',
            content: {},
        },
    },

     // =======FIRST CARD: OWNERSHIP=============
    {
        key: 'ownership',
        title: '',
        description:
            'Ethnic Minority Businesses (EMBs) are companies owned and controlled by individuals from minority ethnic groups.',
        bullets: [
            'They contribute significantly to economic diversity and innovation.',
            'EMBs often face unique challenges in accessing finance and markets.',
            'Supporting EMBs helps promote economic inclusion and social mobility.',
        ],
        value: '',
        headerImage: 'pdf/header_ownership_group.svg',
        iconImage: 'pdf/icon_ownership_group.svg',
        backgroundColor: '#F5F0FF',
        textColor: '#4A148C',
        valueColor: '#7B1FA2',
        // layout: {
        // 	type: 'fullWidth',
        // 	content: {
        // 		imagePosition: 'top',
        // 		textAlignment: 'center'
        // 	}
        // }
        layout: {
            type: 'standard',
            content: {
                leftWidth: '50%',
                rightWidth: '50%',
            },
        },
    },
    {
        key: 'bcorpCertification',
        title: 'B Corp Certified Businesses',
        description:
            'B Corp Certified businesses are recognised for meeting rigorous standards of social and environmental performance, transparency, and accountability. Certification is granted by the non-profit B Lab and reflects a company’s commitment to balancing purpose and profit.',
        bullets: [
            `Demonstrated leadership in ethical business, focusing on social and environmental performance.`,
            'Encouraged long-term sustainability and corporate responsibility through transparency and stakeholder-focused governance.',
        ],
        value: '',
        headerImage: 'pdf/header_bcorp.svg',
        iconImage: 'pdf/icon_bcorp.svg',
        backgroundColor: '#F7FFFE',
        textColor: '#1f4286',
        valueColor: '#91C84F',
        layout: {
            type: 'standard',
            content: {
                leftWidth: '50%',
                rightWidth: '50%',
            },
        },
    },
    {
        key: 'female',
        title: 'Woman Owned Businesses',
        description:
          'Businesses led or founded by women, highlighting the role of gender diversity in leadership and innovation.',
        bullets: [
          'Promoted gender equality and diverse leadership. ',
          'Drove inclusive innovation and influenced gender-balanced decision-making environments across sectors. '
        ],
        value: '',
        headerImage: 'pdf/header_woman_owned.svg',
        iconImage: 'pdf/icon_woman_owned.svg',
        backgroundColor: '#FFF0F6',
        textColor: '#880E4F',
        valueColor: '#F06292',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'militaryVeterans',
        title: 'Military Veterans',
        description:
            'Military Veteran-Owned Businesses are founded and led by individuals who have served in the armed forces. These enterprises leverage the leadership, discipline, and resilience developed during military service to contribute meaningfully to the economy.',
        bullets: [
            'Showcased leadership, discipline, and resilience transferred from military to business. ',
            'Helped with the economic reintegration of veterans and enriched the business landscape with unique skill sets.'
        ],
        value: '',
        headerImage: 'pdf/header_military_veterans.svg',
        iconImage: 'pdf/icon_military_veterans.svg',
        backgroundColor: '#F3E5F5', // light purple
        textColor: '#6A1B9A',
        valueColor: '#8E24AA',
        layout: {
            type: 'standard',
            content: {
                leftWidth: '50%',
                rightWidth: '50%',
            },
        },
    },
    // =======SECOND CARD: MISSION=============
    {
        key: 'mission',
        title: 'Mission Spectrum',
        description:
            'Mission-driven businesses operate with a clear focus on creating positive social, environmental, or ethical impact alongside financial success. This spectrum includes B Corp Certified companies, net-zero committed businesses, VCSEs (Voluntary, Community, and Social Enterprises), and those adhering to the Prompt Payment Code.',
        bullets: [
            'These organisations prioritize sustainability, transparency, and social responsibility.',
            'They drive innovation by aligning business strategies with ethical and environmental goals.',
            'Their practices promote fair treatment of workers, suppliers, and communities.',
            'Supporting mission-led businesses helps build a more inclusive and resilient economy.',
        ],
        value: '',
        headerImage: 'pdf/header_mission_spectrum.svg',
        iconImage: 'pdf/icon_mission_spectrum.svg',
        backgroundColor: '#FFF3E0', // light orange
        textColor: '#EF6C00',
        valueColor: '#FB8C00',
        layout: {
            type: 'standard',
            content: {
                leftWidth: '50%',
                rightWidth: '50%',
            },
        },
    },
    {
        key: 'registeredCharitableOrganizationCount',
        title: 'Registered Charitable Organisation',
        description:
          'Registered Charitable organisations are legally recognised entities established to advance public benefit causes such as education, health, poverty relief, and social welfare. They operate on a non-profit basis and are governed by specific regulatory frameworks.',
        bullets: [
          'Addressed systemic social challenges, from poverty to education and healthcare. ',
          'Reinvested surplus into missions, supported by volunteers and grants, driving grassroots change',
        ],
        value: '789 (£789,012)',
        headerImage: 'pdf/header_charitable.svg',
        iconImage: 'pdf/icon_charitable.svg',
        backgroundColor: '#E3F2FD',
        textColor: '#1565C0',
        valueColor: '#1E88E5',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'non-profitCount',
        title: 'Non-Profit Organisation',
        description:
          'Entities that operate for social good rather than profit, reinvesting any surplus into their mission.',
        bullets: [
          'Focus on community impact and social value.',
          'Operate with transparency and ethical accountability.',
          'Funded through donations, grants, and volunteers.',
          'Include charities, foundations, and NGOs.',
        ],
        value: '60 (£320,000)',
        headerImage: 'pdf/header_nonprofit.svg',
        iconImage: 'pdf/icon_nonprofit.svg',
        backgroundColor: '#F3F6FF',
        textColor: '#283593',
        valueColor: '#5C6BC0',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'communityInterestBusinessCount',
        title: 'Community Interest Business',
        description:
          'Businesses that operate for community benefit, with restrictions on profit distribution to ensure social focus.',
        bullets: [
          'Operated for community benefit, reinvesting profits into local causes. ',
          'Played vital roles in sectors like health, education, and public welfare.',
        ],
        value: '',
        headerImage: 'pdf/header_cic.svg',
        iconImage: 'pdf/icon_cic.svg',
        backgroundColor: '#E8F5E9',
        textColor: '#2E7D32',
        valueColor: '#81C784',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'ppcCategoryCount',
        title: 'Prompt Payment Code Signatories',
        description:
          'Organisation committed to paying their suppliers promptly and fairly, improving cash flow in the supply chain.',
        bullets: [
          'Enhanced cash flow for small businesses by committing to timely payments. ',
          'Fostered trust and stability in supply chain ecosystems. ',
        ],
        value: '',
        headerImage: 'pdf/header_ppc.svg',
        iconImage: 'pdf/icon_ppc.svg',
        backgroundColor: '#FFFDE7',
        textColor: '#FBC02D',
        valueColor: '#FFEB3B',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },

    // ==========THIRD CARD:- RISK REGISTER===========
    
    {
        key: 'netZeroTargetCounts',
        title: 'Net Zero Target Businesses',
        description:
          'Organisations committed to achieving net-zero carbon emissions, contributing to global climate goals.',
        bullets: [
          'Committed to reducing emissions, supporting the fight against climate change. ',
          'Invested in green technologies and aligned with global climate goals like the Paris Accord. ',
        ],
        value: '',
        headerImage: 'pdf/header_netzero.svg',
        iconImage: 'pdf/icon_netzero.svg',
        backgroundColor: '#F0FFF4',
        textColor: '#1B5E20',
        valueColor: '#66BB6A',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'modernSlaveryCount',
        title: 'Modern Slavery Statements',
        description:
          'Businesses reporting on actions taken to prevent modern slavery and human trafficking within operations and supply chains.',
        bullets: [
          'Advanced human rights by tackling modern slavery in supply chains. ',
          'Strengthened ethical procurement and labour practices across industries. ',
        ],
        value: '45 (£210,000)',
        headerImage: 'pdf/header_slavery.svg',
        iconImage: 'pdf/icon_slavery.svg',
        backgroundColor: '#FFF8E1',
        textColor: '#F57F17',
        valueColor: '#FFCA28',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
        key: 'genderpayGapReportingCount',
        title: 'Gender Pay Gap Reporting',
        description:
          'Organisations that submit mandatory reports outlining the difference in pay between men and women within their workforce.',
        bullets: [
          'Promoted pay transparency and accountability in the workforce. ',
          'Helped identify and reduce gender-based wage disparities, supporting workplace equity. ',
        ],
        value: '',
        headerImage: 'pdf/header_genderpay.svg',
        iconImage: 'pdf/icon_genderpay.svg',
        backgroundColor: '#FCE4EC',
        textColor: '#AD1457',
        valueColor: '#EC407A',
        layout: {
          type: 'standard',
          content: {
            leftWidth: '50%',
            rightWidth: '50%',
          },
        },
    },
    {
      key: 'dataControllersCount',
      title: 'ICO Registered Businesses',
      description:
        'Organisations registered as data controllers with the Information Commissioner’s Office (ICO) to ensure proper data protection practices.',
      bullets: [
        'Upheld data rights by ensuring compliance with GDPR and ethical data practices. ',
        'Strengthened public trust in data protection and corporate transparency. ',
      ],
      value: '',
      headerImage: 'pdf/header_data_controller.svg',
      iconImage: 'pdf/icon_data_controller.svg',
      backgroundColor: '#E0F7FA',
      textColor: '#00838F',
      valueColor: '#00ACC1',
      layout: {
        type: 'standard',
        content: {
          leftWidth: '50%',
          rightWidth: '50%',
        },
      },
    },

    // ==========FOURTH CARD:- PUBLIC SECTOR SPENT===========
    
    {
      key: 'isGovtDeptsCounts',
      title: 'Government Departments',
      description:
        'National-level government bodies responsible for implementing policies, delivering public services, and overseeing sectoral governance.',
      bullets: [
        'Ensured the delivery of public services and policy implementation across various sectors. ',
        'Played a foundational role in national and local development, with entities like local councils and departments providing community infrastructure and governance. '
      ],
      value: '',
      headerImage: 'pdf/header_government.svg',
      iconImage: 'pdf/icon_government.svg',
      backgroundColor: '#FFF3E0',
      textColor: '#EF6C00',
      valueColor: '#FFB74D',
      layout: {
        type: 'standard',
        content: {
          leftWidth: '50%',
          rightWidth: '50%',
        },
      },
    },
    {
      key: 'isCouncilCounts',
      title: 'Local Councils',
      description:
        'Local government authorities providing public services and administration at the community level.',
      bullets: [
        'Deliver services like housing, planning, and waste management.',
        'Operate under elected councillor.',
        'Funded through council tax and government grants.',
        'Support community development and local infrastructure.',
      ],
      value: '',
      headerImage: 'pdf/header_council.svg',
      iconImage: 'pdf/icon_council.svg',
      backgroundColor: '#F1F8E9',
      textColor: '#558B2F',
      valueColor: '#AED581',
      layout: {
        type: 'standard',
        content: {
          leftWidth: '50%',
          rightWidth: '50%',
        },
      },
    },
    {
      key: 'isUniversityCounts',
      title: 'Universities',
      description:
        'Higher education institutions offering undergraduate and postgraduate degrees, and conducting academic research.',
      bullets: [
        'Drove knowledge creation, innovation, and social mobility. ',
        'Supplied skilled graduates and research that propelled industrial and societal progress. ',
      ],
      value: '',
      headerImage: 'pdf/header_university.svg',
      iconImage: 'pdf/icon_university.svg',
      backgroundColor: '#EDE7F6',
      textColor: '#6A1B9A',
      valueColor: '#BA68C8',
      layout: {
        type: 'standard',
        content: {
          leftWidth: '50%',
          rightWidth: '50%',
        },
      },
    },
    {
      key: 'isOtherCounts',
      title: 'Other Public Sector Entities',
      description:
        'A category capturing other miscellaneous government-affiliated organisations that serve public interest but do not fall under major listed groups.',
      bullets: [
        'Include regulatory bodies, executive agencies, and commissions.',
        'Operate across various sectors like health, transport, and justice.',
        'Support government operations with specialised functions.',
        'Often governed by independent boards or authorities.',
      ],
      value: '',
      headerImage: 'pdf/header_others.svg',
      iconImage: 'pdf/icon_others.svg',
      backgroundColor: '#F9FBE7',
      textColor: '#827717',
      valueColor: '#D4E157',
      layout: {
        type: 'standard',
        content: {
          leftWidth: '50%',
          rightWidth: '50%',
        },
      },
    },
    {
        key: 'lastPage',
        title: '',
        description: '',
        headerImage: 'pdf/last_page.svg',
        layout: {
            type: 'custom',
            content: {},
        },
        height: '270px'
    },

    

    // {
    //     key: 'ethnic',
    //     title: 'Ethnic Minority Business',
    //     description:
    //         'Ethnic Minority Businesses are enterprises owned and operated by individuals from minority ethnic backgrounds. These businesses play a vital role in fostering diversity, innovation, and inclusion within the economy.',
    //     bullets: [
    //         'Contributed to economic diversity, innovation, and inclusive growth. ',
    //         'Faced challenges in accessing finance and networks, but support to these businesses fosters social mobility and representation in the economy. '
    //     ],
    //     value: '',
    //     headerImage: 'pdf/header_ethnic_minority.svg',
    //     iconImage: 'pdf/icon_ethnic_minority.svg',
    //     backgroundColor: '#F5F0FF',
    //     textColor: '#4A148C',
    //     valueColor: '#7B1FA2',
    //     layout: {
    //         type: 'standard',
    //         content: {
    //             leftWidth: '50%',
    //             rightWidth: '50%',
    //         },
    //     },
    //     // layout: {
    //     //     type: 'fullWidth',
    //     //     content: {
    //     //         imagePosition: 'top',
    //     //         textAlignment: 'center',
    //     //     },
    //     // },
    // }, 
    // {
    //   key: 'raceAtWork',
    //   title: 'Race at Work Charter Signatories',
    //   description:
    //     'Organisations committed to improving outcomes for Black, Asian, and minority ethnic employees in the UK.',
    //   bullets: [
    //     'Publicly committed to racial equity and inclusive hiring. ',
    //     'Improved opportunities for Black, Asian, and minority ethnic employees in the UK workforce. ',
    //   ],
    //   value: '',
    //   headerImage: 'pdf/header_raceatwork.svg',
    //   iconImage: 'pdf/icon_raceatwork.svg',
    //   backgroundColor: '#E8EAF6',
    //   textColor: '#3F51B5',
    //   valueColor: '#7986CB',
    //   layout: {
    //     type: 'standard',
    //     content: {
    //       leftWidth: '50%',
    //       rightWidth: '50%',
    //     },
    //   },
    // },
    
];
