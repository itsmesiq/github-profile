import { githubFetch } from './client';
import type { GithubRepository } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export async function getGithubRepositories(): Promise<GithubRepository[]> {
    return githubFetch<GithubRepository[]>(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    );
}
