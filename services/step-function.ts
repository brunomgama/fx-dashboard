import { DescribeStateMachineCommand, SFNClient } from '@aws-sdk/client-sfn';
import { fromIni } from '@aws-sdk/credential-providers';

interface DescribeInput {
	arn: string;
	profile: string;
	region: string;
}

export async function describeStateMachine({ arn, profile, region }: DescribeInput) {
	const client = new SFNClient({
		credentials: fromIni({ profile }),
		region,
	});

	const res = await client.send(new DescribeStateMachineCommand({ stateMachineArn: arn }));

	return {
		definition: res.definition ?? '',
		name: res.name ?? '',
		status: res.status ?? '',
	};
}
