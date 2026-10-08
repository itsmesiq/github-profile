export const GITHUB_PROFILE_QUERY = `
    query GithubProfile($login: String!) {
        user(login: $login) {
            name
            login

            repositories(
                first: 100
                after: null
                ownerAffiliations: OWNER
                privacy: PUBLIC
            ) {
                totalCount 
                pageInfo {
                    hasNextPage
                    endCursor
                }   

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

export const GITHUB_REPOSITORIES_QUERY = `
    query GithubRepositories($login: String!, $cursor: String) {
        user(login: $login) {
            repositories(
                first: 100
                after: $cursor
                ownerAffiliations: OWNER
                privacy: PUBLIC
            ) {
                pageInfo {
                    hasNextPage
                    endCursor
                }    
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
        }
    }
`;
