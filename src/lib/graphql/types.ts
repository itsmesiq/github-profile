interface GithubRepository {
    isFork: boolean;
    languages: {
        edges: Array<{
            size: number;
            node: {
                name: string;
            };
        }>;
    };
}

interface GithubRepositoryConnection {
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
    };
    nodes: GithubRepository[];
}

export interface GithubProfileQueryResponse {
    user: {
        name: string | null;
        login: string;
        repositories: GithubRepositoryConnection & {
            totalCount: number;
        };
        pullRequests: {
            totalCount: number;
        };
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number;
                weeks: Array<{
                    contributionDays: Array<{
                        date: string;
                        contributionCount: number;
                    }>;
                }>;
            };
        };
    };
}

export interface GithubRepositoriesQueryResponse {
    user: {
        repositories: GithubRepositoryConnection;
    };
}
