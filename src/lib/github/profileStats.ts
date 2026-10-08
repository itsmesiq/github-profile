import { githubGraphql } from '../graphql/client';
import { GITHUB_PROFILE_QUERY, GITHUB_REPOSITORIES_QUERY } from '../graphql/queries';
import type { GithubProfileQueryResponse, GithubRepositoriesQueryResponse } from '../graphql/types';
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

    const repositories = [...user.repositories.nodes];
    let hasNextPage = user.repositories.pageInfo.hasNextPage;
    let cursor = user.repositories.pageInfo.endCursor;

    while (hasNextPage) {
        if (!cursor) {
            throw new Error('GitHub pagination expected a cursor but none was returned');
        }

        const nextPage = await githubGraphql<GithubRepositoriesQueryResponse>(
            GITHUB_REPOSITORIES_QUERY,
            {
                login: GITHUB_USERNAME,
                cursor,
            },
        );

        const connection = nextPage.user.repositories;

        repositories.push(...connection.nodes);
        hasNextPage = connection.pageInfo.hasNextPage;
        cursor = connection.pageInfo.endCursor;
    }

    const languages: GithubLanguages = {};

    for (const repository of repositories) {
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
