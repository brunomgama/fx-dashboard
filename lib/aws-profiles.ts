export interface AWSProfile {
	name: string;
	displayName: string;
	accountId: string;
}

export const AWS_PROFILES: AWSProfile[] = [
	{
		name: 'fixxer-administrator-058264364375',
		displayName: 'Development Account',
		accountId: '058264364375',
	},
	{
		name: 'fixxer-administrator-905418010637',
		displayName: 'Production Account',
		accountId: '905418010637',
	},
];
