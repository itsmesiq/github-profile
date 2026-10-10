import Image from 'next/image';

import type { GithubProfileData } from '@/lib/github/types';

interface ProfileHeroProps {
    data: GithubProfileData;
}

export function ProfileHero({ data }: ProfileHeroProps) {
    return (
        <article className="w-full rounded-2xl border border-primary bg-surface">
            <div className="flex items-center justify-between border-b border-primary px-6 py-4 font-mono text-xs text-primary">
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-[#e01f43]"></div>
                    <div className="size-3 rounded-full bg-[#f2aa3d]"></div>
                    <div className="size-3 rounded-full bg-[#3df255]"></div>
                </div>
                <span>itsmesiq@github ~ $ ./profile-scan --live</span>
                <div className="flex items-center gap-2">
                    <div className="size-2 animate-pulse rounded-full bg-primary"></div>
                    <span className="uppercase">Live</span>
                </div>
            </div>
            <div className="flex items-center gap-6 p-6">
                <div className="relative flex min-h-[515px] min-w-[515px] items-center justify-center overflow-hidden rounded-2xl border border-primary shadow-[inset_0_0_20px_0_#3df2bc]/20">
                    <span className="absolute top-3 left-5 font-mono text-[10px] tracking-[4px] text-primary uppercase">
                        visual.map
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
                    <span className="absolute top-3 left-5 font-mono text-[10px] tracking-[4px] text-primary uppercase">
                        system.info
                    </span>
                    <div className="mt-6 flex w-full items-center gap-6 font-mono text-xs text-primary">
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
                                    className="my-2 h-[1px] w-full border border-dashed border-primary"
                                ></div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-5 whitespace-nowrap">
                            <span className="pb-[1px]">{data.profile.name}</span>
                            <span className="pb-[1px]">{data.profile.login}</span>
                            <span className="pb-[1px]">Fullstack Developer</span>
                            <span className="pb-[1px]">Building | Learning | Shipping</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] tracking-[4px] text-primary uppercase">
                            languages.info
                        </span>
                        <div className="flex w-full flex-col items-center gap-4 font-mono text-xs text-primary">
                            {data.languages.map((language) => (
                                <div
                                    key={language.name}
                                    className="flex w-full items-center justify-between gap-5"
                                >
                                    <span className="min-w-[80px]">{language.name}</span>
                                    <div className="relative w-full">
                                        <div
                                            className="absolute inset-0 z-10 h-2 bg-primary"
                                            style={{ width: `${language.percentage}%` }}
                                        ></div>
                                        <div className="relative h-2 w-full bg-muted/5"></div>
                                    </div>
                                    <span>{language.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-15 border-t border-dashed border-primary pt-5">
                        <div className="w-full">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-mono text-xs text-primary uppercase">
                                    Repositories
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.profile.public_repos}
                            </span>
                        </div>
                        <div className="w-full">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-mono text-xs text-primary uppercase">
                                    Pull Requests
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.pullRequests}
                            </span>
                        </div>
                        <div className="w-full">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-mono text-xs text-primary uppercase">
                                    Contributions
                                </span>
                                <div className="size-1 animate-pulse rounded-full bg-primary"></div>
                            </div>
                            <span className="text-3xl font-bold tracking-[4px] text-foreground">
                                {data.contributions}
                            </span>
                        </div>
                        <div className="w-full">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-mono text-xs text-primary uppercase">
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
