export const GITHUB_PROFILE_QUERY = `
    query GithubProfile($login: String!) {
        user(login: $login) {
            name
            login

            repositories(
                first: 1
                ownerAffiliations: OWNER
            ) {
                totalCount    
            }

            pullRequests(first: 1) {
                totalCount
            }

            contributionsCollection {
                contributionCalendar {
                    totalContributions

                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
            }
        }
    }
`;
