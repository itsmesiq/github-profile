export interface GithubProfileQueryResponse {
    user: {
        name: string | null;
        login: string;
        repositories: {
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
