import Image from 'next/image';

import type { GithubProfileData } from '@/lib/github/types';

interface ProfileHeroProps {
    data: GithubProfileData;
}

export function ProfileHero({ data }: ProfileHeroProps) {
    return (
        <article className="w-full rounded-2xl border border-primary bg-surface">
            <div className="flex items-center justify-between border-b border-primary px-6 py-4 font-consolas text-xs tracking-[1.5px] text-primary">
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-[#e01f43]"></div>
                    <div className="size-3 rounded-full bg-[#f2aa3d]"></div>
                    <div className="size-3 rounded-full bg-[#3df255]"></div>
                </div>
                <span>itsmesiq@github.exe</span>
                <div className="flex items-center gap-2">
                    <div className="size-2 animate-pulse rounded-full bg-primary"></div>
                    <span className="tracking-[3px] uppercase">Live</span>
                </div>
            </div>
            <div className="flex items-center gap-6 p-6">
                <div className="relative flex min-h-[515px] min-w-[515px] items-center justify-center overflow-hidden rounded-2xl border border-primary shadow-[inset_0_0_20px_0_#3df2bc]/20">
                    <span className="absolute top-3 left-5 font-consolas text-xs tracking-[1px] text-primary uppercase">
                        {'// identity_module'}
                    </span>
                    <Image
                        src="/images/profile.png"
                        alt="Profile"
                        width={463}
                        height={515}
                        className="relative z-10 object-contain"
                    />
                    <div
                        aria-hidden="true"
                        className="profile-scanline pointer-events-none absolute inset-x-0 z-20 flex items-center justify-center"
                    >
                        <div className="h-0.5 w-full bg-[linear-gradient(90deg,rgba(31,108,114,0)_0%,#1f6c72_30%,#3df2bc_50%,#1f6c72_70%,rgba(31,108,114,0)_100%)]" />
                    </div>
                </div>
                <div className="relative flex min-h-[515px] w-full flex-col justify-between rounded-2xl border border-primary p-6 shadow-[inset_0_0_20px_0_#3df2bc]/20">
                    <span className="absolute top-3 left-5 font-consolas text-xs tracking-[1px] text-primary uppercase">
                        {'// system_info'}
                    </span>
                    <div className="mt-6 flex w-full items-center gap-6 font-consolas text-sm tracking-[1px] text-primary">
                        <div className="flex flex-col gap-5 whitespace-nowrap">
                            <span className="pb-[1px]">Subject</span>
                            <span className="pb-[1px]">Handle</span>
                            <span className="pb-[1px]">Role</span>
                            <span className="pb-[1px]">Status</span>
                        </div>
                        <div className="flex w-full flex-col gap-5">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex h-[21px] w-full items-center justify-center"
                                >
                                    <div className="h-px w-full bg-[repeating-linear-gradient(to_right,var(--color-primary)_0_2px,transparent_2px_8px)]"></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-5 pr-6 whitespace-nowrap">
                            <span className="pb-[1px]">{data.profile.name}</span>
                            <span className="pb-[1px]">{data.profile.login}</span>
                            <span className="pb-[1px]">Fullstack Developer</span>
                            <div className="flex items-center gap-2">
                                <div className="size-2 animate-pulse rounded-full bg-primary"></div>
                                <span className="pb-[1px]">Available</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-consolas text-xs tracking-[1px] text-primary uppercase">
                            {'// languages_module'}
                        </span>
                        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-5 font-consolas text-sm tracking-[1px] text-primary">
                            {[...data.languages]
                                .sort((a, b) => b.percentage - a.percentage)
                                .map((language, index) => {
                                    const colorSchema = [
                                        'var(--color-primary)',
                                        'var(--color-secondary)',
                                        '#47cbff',
                                        'var(--color-tertiary)',
                                        'var(--color-muted)',
                                    ];

                                    const middleIndex = Math.ceil(colorSchema.length / 2);
                                    const columnIndex =
                                        index < middleIndex ? index : index - middleIndex;

                                    return (
                                        <div
                                            key={language.name}
                                            className="flex w-full items-center gap-6"
                                            style={{
                                                gridColumn: index < middleIndex ? 1 : 2,
                                                gridRow: columnIndex + 1,
                                            }}
                                        >
                                            <span className="min-w-[88px]">{language.name}</span>
                                            <div className="relative h-2 w-full max-w-[380px]">
                                                <div
                                                    className="absolute inset-y-0 left-0 z-10 h-2 rounded-full"
                                                    style={{
                                                        width: `${language.percentage}%`,
                                                        backgroundColor:
                                                            colorSchema[index % colorSchema.length],
                                                    }}
                                                ></div>
                                                <div className="relative h-2 w-full rounded-full bg-muted/10"></div>
                                            </div>
                                            <span>{language.percentage}%</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-6">
                        <div className="w-full border-l-3 border-primary bg-background px-5 py-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-consolas text-xs tracking-[2px] text-primary uppercase">
                                    Repositories
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.profile.public_repos}
                            </span>
                        </div>
                        <div className="w-full border-l-3 border-primary bg-background px-5 py-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-consolas text-xs tracking-[2px] text-primary uppercase">
                                    Pull Requests
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.pullRequests}
                            </span>
                        </div>
                        <div className="w-full border-l-3 border-primary bg-background px-5 py-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-consolas text-xs tracking-[2px] text-primary uppercase">
                                    Contributions
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.contributions}
                            </span>
                        </div>
                        <div className="w-full border-l-3 border-primary bg-background px-5 py-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-consolas text-xs tracking-[2px] text-primary uppercase">
                                    Active Days
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.activeDays}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
