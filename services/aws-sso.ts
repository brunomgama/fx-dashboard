import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SSOLoginResult {
	message: string;
	verificationCode: string;
	verificationUrl: string;
}

export interface AuthStatusResult {
	authenticated: boolean;
	identity?: { Account: string; Arn: string; UserId: string };
}

export function loginToSSO(profile: string): Promise<SSOLoginResult> {
	return new Promise((resolve, reject) => {
		const process = spawn('aws', ['sso', 'login', '--profile', profile, '--no-browser']);
		let output = '';
		let resolved = false;

		const tryExtract = () => {
			if (resolved) return;
			const urlMatch = output.match(/https:\/\/[^\s]+/);
			const codeMatch = output.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);
			if (urlMatch) {
				resolved = true;
				resolve({
					message: 'Please complete authentication in your browser',
					verificationCode: codeMatch?.[1] ?? '',
					verificationUrl: urlMatch[0],
				});
			}
		};

		process.stdout.on('data', (data: Buffer) => { output += data.toString(); tryExtract(); });
		process.stderr.on('data', (data: Buffer) => { output += data.toString(); tryExtract(); });

		setTimeout(() => {
			if (!resolved) {
				resolved = true;
				reject(new Error('Could not extract verification URL from AWS SSO output'));
			}
		}, 5000);

		process.on('error', (error: Error) => {
			if (!resolved) {
				resolved = true;
				reject(new Error(`Failed to start AWS SSO login: ${error.message}`));
			}
		});
	});
}

export async function getAuthStatus(profile: string): Promise<AuthStatusResult> {
	try {
		const { stdout } = await execAsync(`aws sts get-caller-identity --profile ${profile}`, { timeout: 10000 });
		const identity = JSON.parse(stdout) as { Account: string; Arn: string; UserId: string };
		return { authenticated: true, identity };
	} catch {
		return { authenticated: false };
	}
}
