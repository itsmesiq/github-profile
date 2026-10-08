import { githubGraphql } from '../graphql/client';
import { GITHUB_PROFILE_QUERY } from '../graphql/queries';
import type { GithubProfileQueryResponse } from '../graphql/types';
import type { GithubUser } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export async function getGithubProfile(): Promise<GithubUser> {
    const data = await githubGraphql<GithubProfileQueryResponse>(GITHUB_PROFILE_QUERY, {
        login: GITHUB_USERNAME,
    });

    return {
        login: data.user.login,
        name: data.user.name,
        public_repos: data.user.repositories.totalCount,
    };
}
