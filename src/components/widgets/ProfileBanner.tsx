import Image from 'next/image';

import { techStack } from '@/data/tech-stack';

export function ProfileBanner() {
    return (
        <article className="diamond-gradient-border w-full" data-export="profile-banner">
            <div className="relative flex w-full rounded-[40px] bg-background">
                <div className="relative z-10 flex w-full items-center gap-8 p-8">
                    <Image
                        src="/images/profile_image.gif"
                        alt="Animated avatar"
                        width={480}
                        height={480}
                        unoptimized
                        className="aspect-square h-auto w-full max-w-[400px] rounded-4xl object-cover 2xl:max-w-[480px]"
                    />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">&gt;_</span>
                                <span className="font-lexend text-xl font-light tracking-[1.6px] text-muted">
                                    @itsmesiq
                                </span>
                            </div>
                            <div>
                                <span className="text-4xl text-foreground">Hey, I&apos;m Ana</span>
                                <h1 className="text-[56px] font-semibold text-primary">
                                    Fullstack Developer
                                </h1>
                            </div>
                        </div>
                        <div className="w-full" aria-hidden="true">
                            <Image
                                src="/images/section_accent.svg"
                                alt=""
                                width={488}
                                height={16}
                                className="h-auto w-full"
                            />
                        </div>
                        <p className="max-w-[428px] font-lexend text-lg font-light text-muted">
                            Bridging design and development to build useful, accessible, and
                            engaging web experiences.
                        </p>
                        <div className="flex w-full items-center gap-4">
                            {techStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="flex items-center gap-3 rounded-full border border-primary px-4 py-2 text-sm"
                                >
                                    <Image src={tech.icon} alt={tech.name} width={20} height={20} />
                                    <span>{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 h-full max-w-[500px] overflow-hidden rounded-r-[40px] 2xl:max-w-[844px]">
                    <Image
                        src="/images/profile_background.gif"
                        alt="Background image of a computer screen with code on it"
                        width={1202}
                        height={630}
                        unoptimized
                        className="aspect-[1202/630] h-full w-auto object-cover object-left"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#08080b_9.69%,rgba(10,10,11,0.00)_32.32%)]"></div>
                </div>
            </div>
        </article>
    );
}
