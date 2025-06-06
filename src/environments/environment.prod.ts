export enum subscribedPlan {
	'Start' = '5e78ea0b7851f505bc7141a8',
	'Monthly_Expand' = '5e8762a0cc486a029895cfc3',
	'Monthly_Enterprise' = '5ea577bddc13f4465c7f3a95',
	'Annually_Expand' = '5ea68b76d9015856f85f550c',
	'Annually_Enterprise' = '5ea68be2d9015856f85f550d',
	'Enterprise_Conversion_For_Ravi' = '5d0a3263f78d424990e24be5',
	'Expand_Weekly_Trial' = '5f4a11d9df0a895288540b9c',
	'Monthly_Expand_Trial' = '5f574b5ec71b033370a32bd6',
	'Annually_Expand_Trial' = '5f574bd5c71b033370a32bd7',
	'Enterprise_Weekly_Trial' = '5f4a1249df0a895288540b9d',
	'Monthly_Enterprise_Trial' = '5eb2c4f10632bc3abc81c227',
	'Annually_Enterprise_Trial' = '5f08689116f8ca0cc39eed11',
	'Monthly_Expand_Paid_Test' = '5fb6193363e4125634f68e87',
	'Monthly_Enterprise_Paid_Test' = '5fb619aa63e4125634f68e88',
	'Trial_48_Hours' = '6055da66630f50347cc5b15e',
	'Enterprise_Annual_One_Year' = '6056675c4a22712ea86388bf',
	'Enterprise_Annual_Two_Year' = '603df6c343eb4e43f0b030fd',
	'Enterprise_New_Monthly' = '6056663b4a22712ea86388be',
	'Expand_Annual_One_Year' = '605662dd4a22712ea86388bd',
	'Expand_Annual_Two_Year' = '603e2b25b3f9675980e37474',
	'Expand_New_Monthly' = '605660e94a22712ea86388bc',
	'Premium_Annual_One_Year' = '60583a9b7059320ed84d181d',
	'Premium_Annual_Two_Year' = '60583add7059320ed84d181e',
	'Premium_New_Monthly' = '60583a537059320ed84d181c',
	'Valentine_Special' = '6200f0134e5687643a5dc7b5',
	'Premium_Trial_48_Hours' = '623b0e697b35e3932cc2baa8',
	'Expand_Trial_48_Hours' = '623b0f3e7b35e3932cc2baa9'
}

export enum SalesForceConstant {
	'ClientId' = '3MVG9I9urWjeUW05K4z6TchjzCirutx3He__TEtPq6Dy..fzBFF3CrsK4zIFODBijCeaEnbzIhMhK_rvd.kVz',
	'SecrectKey' = 'BE0C1F09FC62269DD80C220EED5241D160F6308AA230DD1DA0A0BBDE3F781D93',
	'RedirectURL' = 'https://test.datagardener.com/list/salesforce-sync'
}

export const CompaniesEligibleForDataWithoutLogin = ['00041424', '01270695'];

export const environment = {
	production: true,
	json: 'assets/utilities/data',
	stripe_public_key: 'pk_test_sPSoo2Hqy7r7kMUHTu1qi8Yb',                       // JSON Path
	// server: 'http://localhost:8082',                  // Local Server
	// server: 'https://devapi.datagardener.com',         // Dev Server
	// server: 'https://preprodapi.datagardener.com',       // Preprod Server
	server: 'https://main.datagardener.com',         // Live Server
	firebase: {
		apiKey: "AIzaSyDBMKwLKRe_TjmOAEXXmIVHNdP8FgYJbDM",
		authDomain: "dg-auth-9475c.firebaseapp.com",
		projectId: "dg-auth-9475c",
		storageBucket: "dg-auth-9475c.appspot.com",
		messagingSenderId: "813681148156",
		appId: "1:813681148156:web:f2d2985b1315e40496d779",
		measurementId: "G-1W2BDCEL2W"
	}
};
