import { githubFetch } from './client';
import type { GithubUser } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export async function getGithubProfile(): Promise<GithubUser> {
    return githubFetch<GithubUser>(`/users/${GITHUB_USERNAME}`);
}
