export interface GithubProfileQueryResponse {
    user: {
        name: string | null;
        login: string;
        repositories: {
            totalCount: number;
            nodes: Array<{
                isFork: boolean;
                languages: {
                    edges: Array<{
                        size: number;
                        node: {
                            name: string;
                        };
                    }>;
                };
            }>;
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
