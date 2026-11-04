import { Suspense } from 'react';

import { ProfileBanner } from '@/components/widgets/ProfileBanner';
import { getGithubProfileData } from '@/lib/github/data';

const DEFAULT_GITHUB_USERNAME = 'itsmesiq';

interface HomeProps {
    searchParams: Promise<{
        username?: string;
    }>;
}

async function ProfileContent({ searchParams }: HomeProps) {
    const { username } = await searchParams;
    const githubUsername = username?.trim() || DEFAULT_GITHUB_USERNAME;

    const githubData = await getGithubProfileData(githubUsername);

    return (
        <>
            <ProfileBanner />
        </>
    );
}

export default function Home({ searchParams }: HomeProps) {
    return (
        <main>
            <Suspense
                fallback={
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <span>Loading...</span>
                    </div>
                }
            >
                <ProfileContent searchParams={searchParams} />
            </Suspense>
        </main>
    );
}
