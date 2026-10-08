const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

interface GithubGraphqlResponse<T> {
    data?: T;
    errors?: Array<{
        type?: string;
        message: string;
    }>;
}

export async function githubGraphql<T>(
    query: string,
    variables: Record<string, unknown> = {},
): Promise<T> {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        throw new Error('GITHUB_TOKEN is not configured');
    }

    const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
        next: {
            revalidate: 3600, // 1 hour
        },
    });

    if (!response.ok) {
        const message = await response.text();

        throw new Error(`GitHub GraphQL request failed with status ${response.status}: ${message}`);
    }

    const result: GithubGraphqlResponse<T> = await response.json();

    if (result.errors?.length) {
        throw new Error(
            `GitHub GraphQL error: ${result.errors.map((error) => error.message).join('; ')}`,
        );
    }

    if (!result.data) {
        throw new Error('GitHub GraphQL response did not contain data');
    }

    return result.data;
}
