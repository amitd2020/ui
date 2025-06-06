export const PreferencesOptionIndex = [
    {
        header: 'Employee Contact',
        items: [   
            {
                label: 'Email',
                chckbxNgModel: true,
                checkBoxName: 'employeeEmailYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasPersonEmail: 'true' },
                chipValue: 'Person must have employee email',
                disable: false,
            },
            {
                label: 'LinkedIn',
                chckbxNgModel: true,
                checkBoxName: 'employeeLinkedInYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasPersonLinkedIn: 'true' },
                chipValue: 'Person must have employee linkedIn',
                disable: false,
            }
        ]
    },
    {
        header: 'Director Contact',
        items: [   
            {
                label: 'Email',
                chckbxNgModel: false,
                checkBoxName: 'directorEmailYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasDirectorEmail: 'true' },
                chipValue: 'Person must have director email',
                disable: false,
            },
            {
                label: 'LinkedIn',
                chckbxNgModel: false,
                checkBoxName: 'directorLinkedInYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasDirectorLinkedIn: 'true' },
                chipValue: 'Person must have director linkedIn',
                disable: false,
            }
        ]
    },
    {
        header: 'Person With Significant Control',
        items: [   
            {
                label: 'Email',
                chckbxNgModel: false,
                checkBoxName: 'pscEmailYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasPSCEmail: 'true' },
                chipValue: 'Person must have PSC email',
                disable: false,
            },
            {
                label: 'LinkedIn',
                chckbxNgModel: false,
                checkBoxName: 'pscLinkedInYes',
                checkBxlabel: 'Yes',
                checkBxValue: 'Yes',
                preferenceOperator: { hasPSCLinekdIn: 'true' },
                chipValue: 'Person must have PSC linkedIn',
                disable: false,
            }
        ]
    }
]