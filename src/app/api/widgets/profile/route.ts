import { NextRequest, NextResponse } from 'next/server';

import { getGithubProfileData } from '@/lib/github/data';
import { generateProfileSvg } from '@/lib/github/profileSvg';

const DEFAULT_GITHUB_USERNAME = 'itsmesiq';

const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export async function GET(request: NextRequest) {
    const requestedUsername = request.nextUrl.searchParams.get('username');

    const username = requestedUsername?.trim() || DEFAULT_GITHUB_USERNAME;

    if (!USERNAME_REGEX.test(username)) {
        return new NextResponse('Invalid GitHub username', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store',
            },
        });
    }

    try {
        const profileData = await getGithubProfileData(username);
        const svg = await generateProfileSvg(profileData);

        return new NextResponse(svg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control':
                    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('Failed to generate GitHub profile SVG:', error);

        return new NextResponse('Failed to generate GitHub profile SVG', {
            status: 502,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store',
            },
        });
    }
}
