import { githubGraphql } from '../graphql/client';
import { GITHUB_PROFILE_QUERY } from '../graphql/queries';
import type { GithubProfileQueryResponse } from '../graphql/types';
import type { GithubLanguages, GithubUser } from './types';

const GITHUB_USERNAME = 'itsmesiq';

export interface GithubProfileStats {
    profile: GithubUser;
    languages: GithubLanguages;
    pullRequests: number;
    contributions: number;
    activeDays: number;
}

export async function getGithubProfileStats(): Promise<GithubProfileStats> {
    const data = await githubGraphql<GithubProfileQueryResponse>(GITHUB_PROFILE_QUERY, {
        login: GITHUB_USERNAME,
    });

    const user = data.user;
    const calendar = user.contributionsCollection.contributionCalendar;

    const languages: GithubLanguages = {};

    for (const repository of user.repositories.nodes) {
        if (repository.isFork) {
            continue;
        }

        for (const edge of repository.languages.edges) {
            const language = edge.node.name;

            languages[language] = (languages[language] ?? 0) + edge.size;
        }
    }

    const contributionDays = calendar.weeks.flatMap((week) => week.contributionDays);

    const activeDays = contributionDays.filter((day) => day.contributionCount > 0).length;

    return {
        profile: {
            login: user.login,
            name: user.name,
            public_repos: user.repositories.totalCount,
        },
        languages,
        pullRequests: user.pullRequests.totalCount,
        contributions: calendar.totalContributions,
        activeDays,
    };
}
