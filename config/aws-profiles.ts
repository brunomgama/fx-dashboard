import { ENVIRONMENTS } from '@/config/environments';
import type { AWSProfile } from '@/types/aws-sso';

export const AWS_PROFILES: AWSProfile[] = Object.values(ENVIRONMENTS).map((env) => ({
	accountId: env.awsAccount,
	displayName: env.displayName,
	name: env.awsProfile,
}));
