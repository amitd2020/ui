export const safeAlertObj: any = [
    {
        "CODE": "5A",
        "DSC": "A Director of this company is also appointed to a company which has become insolvent within the last 12 months."
    },
    {
        "CODE": "1A",
        "DSC": "A Director of this company is currently disqualified and there is an exception linked to the bankruptcy."
    },
    {
        "CODE": "1B",
        "DSC": "A Director of this company is currently disqualified and there is no exception linked to the bankruptcy."
    },
    {
        "CODE": "2A",
        "DSC": "This company has filed a turnover greater than 2 million in their first set of annual accounts which were submitted to Companies House."
    },
    {
        "CODE": "2B",
        "DSC": "This company was previously dormant/non-trading yet have submitted a new set of annual accounts with Companies House where the turnover is greater than 1 million."
    },
    {
        "CODE": "3",
        "DSC": "This company has filed accounts that match those filed by at least one other company. We have matched the companys accounts on the following three fields Turnover, Shareholders Funds and Total Assets."
    },
    {
        "CODE": "4",
        "DSC": "This company has changed their registered address with Companies House on more than one occasion in the last 6 months."
    },
    {
        "CODE": "5B",
        "DSC": "A Director of this company was previously appointed to a company which has become insolvent within the last 12 months."
    },
    {
        "CODE": "6",
        "DSC": "A Director of this company is also appointed to a Creditor listed within their Statement of Affairs which has been submitted by the Insolvency Practitioner to Companies House."
    },
    {
        "CODE": "7",
        "DSC": "This company is facing Dissolution which is usually issued if a company is late in filing the correct documentation with Companies House."
    },
    {
        "CODE": "8",
        "DSC": "This company has had multiple board changes within the last 6 months."
    },
    {
        "CODE": "9",
        "DSC": "This company has had multiple key changes within a 4 month period over the last 12 months."
    },
    {
        "CODE": "11",
        "DSC": "This company has filed its first set of accounts before their accounts due date."
    },
    {
        "CODE": "13",
        "DSC": "This company has not filed accounts within a 48-month period from the previous filed accounts."
    },
    {
        "CODE": "7B",
        "DSC": "This company has voluntarily applied to be struck off and dissolved."
    },
    {
        "CODE": "10",
        "DSC": "This company has filed more than one set of Accounts within the last 6 months."
    }
];

export const safeAlertColumns: any = [
    {field : 'CODE', header: 'Code', minWidth: '40px', maxWidth: '80px', },
    {field : 'DSC', header: 'Description', minWidth: '280px', maxWidth: 'none', },
]