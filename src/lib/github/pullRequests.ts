import { githubFetch } from './client';
import type { GithubSearchResult } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export async function getGithubPullRequests(): Promise<number> {
    const result = await githubFetch<GithubSearchResult>(
        `/search/issues?q=author:${GITHUB_USERNAME}+is:pr`,
    );

    return result.total_count;
}
