export const GITHUB_PROFILE_QUERY = `
    query GithubProfile($login: String!) {
        user(login: $login) {
            name
            login

            repositories(
                first: 100
                ownerAffiliations: OWNER
                privacy: PUBLIC
            ) {
                totalCount    

                nodes {
                    isFork

                    languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                        edges {
                            size
                            node {
                                name
                            }
                        }
                    }
                }
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
