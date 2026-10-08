import { githubGraphql } from '../graphql/client';
import { GITHUB_PROFILE_QUERY } from '../graphql/queries';
import type { GithubProfileQueryResponse } from '../graphql/types';
import type { GithubUser } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export interface GithubProfileStats {
    profile: GithubUser;
    pullRequests: number;
    contributions: number;
    activeDays: number;
}

export async function getGithubProfileStats(): Promise<GithubProfileStats> {
    const data = await githubGraphql<GithubProfileQueryResponse>(GITHUB_PROFILE_QUERY, {
        login: GITHUB_USERNAME,
    });

    const contributionDays = data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (week) => week.contributionDays,
    );

    const activeDays = contributionDays.filter((day) => day.contributionCount > 0).length;

    return {
        profile: {
            login: data.user.login,
            name: data.user.name,
            public_repos: data.user.repositories.totalCount,
        },
        pullRequests: data.user.pullRequests.totalCount,
        contributions: data.user.contributionsCollection.contributionCalendar.totalContributions,
        activeDays,
    };
}
