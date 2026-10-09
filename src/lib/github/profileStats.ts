import { githubGraphql } from '../graphql/client';
import { GITHUB_PROFILE_QUERY, GITHUB_REPOSITORIES_QUERY } from '../graphql/queries';
import type { GithubProfileQueryResponse, GithubRepositoriesQueryResponse } from '../graphql/types';
import type { GithubLanguages, GithubUser } from './types';

export interface GithubProfileStats {
    profile: GithubUser;
    languages: GithubLanguages;
    pullRequests: number;
    contributions: number;
    activeDays: number;
}

function validateGithubUsername(username: string): string {
    const normalizedUsername = username.trim();

    const isValid = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(normalizedUsername);

    if (!isValid) {
        throw new Error('Invalid GitHub username');
    }

    return normalizedUsername;
}

export async function getGithubProfileStats(username: string): Promise<GithubProfileStats> {
    const githubUsername = validateGithubUsername(username);

    const data = await githubGraphql<GithubProfileQueryResponse>(GITHUB_PROFILE_QUERY, {
        login: githubUsername,
    });

    if (!data.user) {
        throw new Error(`GitHub profile "${githubUsername}" not found`);
    }

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
                login: githubUsername,
                cursor,
            },
        );

        if (!nextPage.user) {
            throw new Error(`GitHub profile "${githubUsername}" not found`);
        }

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
