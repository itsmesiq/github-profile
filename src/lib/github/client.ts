const GITHUB_API_URL = 'https://api.github.com';

export async function githubFetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        next: {
            revalidate: 3600, // 1 hour
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const text = await response.text();

    if (!text) {
        return null as T;
    }

    return JSON.parse(text);
}
