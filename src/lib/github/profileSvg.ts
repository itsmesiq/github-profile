import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { GithubLanguageStat, GithubProfileData } from './types';

const SVG_WIDTH = 1940;
const SVG_HEIGHT = 800;

const COLORS = {
    background: '#08080b',
    surface: '#111116',
    foreground: '#f2f0f5',
    muted: '#a7a7b3',
    stroke: '#1c1c24',
    primary: '#3df2bc',
    secondary: '#ff2d78',
    tertiary: '#c4b5fd',
    blue: '#47cbff',
};

const LAYOUT = {
    outer: { x: 10, y: 10, width: 1900, height: 768 },
    headerHeight: 62,
    portrait: { x: 41, y: 102, width: 644, height: 644 },
    info: { x: 715, y: 102, width: 1164, height: 644 },
};

const LANGUAGE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.blue,
    COLORS.tertiary,
    COLORS.muted,
];

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength - 3)}...`;
}

function createText(
    x: number,
    y: number,
    value: string,
    options: {
        size?: number;
        color?: string;
        weight?: number;
        anchor?: 'start' | 'middle' | 'end';
        letterSpacing?: number;
    } = {},
): string {
    const {
        size = 14,
        color = COLORS.primary,
        weight = 400,
        anchor = 'start',
        letterSpacing = 1,
    } = options;

    return `
        <text
            x="${x}"
            y="${y}"
            fill="${color}"
            font-family="Consolas, monospace"
            font-size="${size}"
            font-weight="${weight}"
            text-anchor="${anchor}"
            letter-spacing="${letterSpacing}"
        >${escapeXml(value)}</text>
    `;
}

function createDashedLine(x1: number, y: number, x2: number): string {
    return `
        <line
            x1="${x1}"
            y1="${y}"
            x2="${x2}"
            y2="${y}"
            stroke="${COLORS.primary}"
            stroke-width="1"
            stroke-dasharray="1 8"
            stroke-linecap="round"
        />
    `;
}

function createInfoRow(
    label: string,
    value: string,
    y: number,
    options: { status?: boolean } = {},
): string {
    const labelX = 745;
    const valueX = 1612;
    const leaderStartX = 850;
    const leaderEndX = 1575;

    return `
        ${createText(labelX, y, label, {
            size: 18,
        })}

        ${createDashedLine(leaderStartX, y - 5, leaderEndX)}

        ${
            options.status
                ? `
                    <circle
                        cx="${valueX}"
                        cy="${y - 5}"
                        r="5"
                        fill="${COLORS.primary}"
                    >
                        <animate
                            attributeName="opacity"
                            values="1;0.35;1"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    ${createText(valueX + 18, y, value, {
                        size: 18,
                    })}
                `
                : createText(valueX, y, value, {
                      size: 18,
                  })
        }
    `;
}

function createLanguageRow(
    language: GithubLanguageStat,
    index: number,
    x: number,
    y: number,
): string {
    const labelWidth = 120;
    const barX = x + labelWidth + 20;
    const barWidth = 338;
    const percentageX = barX + barWidth + 62;
    const barHeight = 9;

    const percentage = Math.max(0, Math.min(100, language.percentage));

    const color = LANGUAGE_COLORS[index % LANGUAGE_COLORS.length];
    const filledWidth = (barWidth * percentage) / 100;

    return `
        <g>
            ${createText(x, y, language.name, {
                size: 18,
            })}

            <rect
                x="${barX}"
                y="${y - 8}"
                width="${barWidth}"
                height="${barHeight}"
                rx="4.5"
                fill="${COLORS.stroke}"
            />

            <rect
                x="${barX}"
                y="${y - 8}"
                width="${filledWidth}"
                height="${barHeight}"
                rx="4.5"
                fill="${color}"
            />

            ${createText(percentageX, y, `${percentage}%`, {
                size: 18,
                anchor: 'end',
            })}
        </g>
    `;
}

function createLanguages(data: GithubProfileData): string {
    const languages = [...data.languages].sort((a, b) => b.percentage - a.percentage).slice(0, 5);

    if (languages.length === 0) {
        return createText(745, 442, 'No languages available', {
            size: 16,
            color: COLORS.muted,
        });
    }

    const middleIndex = Math.ceil(languages.length / 2);

    const leftLanguages = languages.slice(0, middleIndex);
    const rightLanguages = languages.slice(middleIndex);

    const rowPositions = [455, 505, 555];

    const leftColumn = leftLanguages
        .map((language, index) => createLanguageRow(language, index, 745, rowPositions[index]))
        .join('');

    const rightColumn = rightLanguages
        .map((language, index) =>
            createLanguageRow(language, middleIndex + index, 1318, rowPositions[index]),
        )
        .join('');

    return leftColumn + rightColumn;
}

function createStatCard(x: number, label: string, value: number, width: number): string {
    return `
        <g>
            <rect
                x="${x}"
                y="600"
                width="${width}"
                height="115"
                fill="${COLORS.background}"
            />

            <rect
                x="${x}"
                y="600"
                width="3"
                height="115"
                fill="${COLORS.primary}"
            />

            ${createText(x + 28, 635, label.toUpperCase(), {
                size: 16,
                letterSpacing: 2,
            })}

            <circle
                cx="${x + width - 28}"
                cy="630"
                r="2.5"
                fill="${COLORS.primary}"
            >
                <animate
                    attributeName="opacity"
                    values="1;0.35;1"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            ${createText(x + 28, 686, value.toLocaleString('en-US'), {
                size: 39,
                color: COLORS.foreground,
                weight: 700,
                letterSpacing: 4,
            })}
        </g>
    `;
}

function createStats(data: GithubProfileData): string {
    const stats = [
        {
            label: 'Repositories',
            value: data.profile.public_repos,
        },
        {
            label: 'Pull Requests',
            value: data.pullRequests,
        },
        {
            label: 'Contributions',
            value: data.contributions,
        },
        {
            label: 'Active Days',
            value: data.activeDays,
        },
    ];

    const startX = 746;
    const cardWidth = 253;
    const gap = 30;

    return stats
        .map((stat, index) =>
            createStatCard(startX + index * (cardWidth + gap), stat.label, stat.value, cardWidth),
        )
        .join('');
}

export async function generateProfileSvg(data: GithubProfileData): Promise<string> {
    const imagePath = join(process.cwd(), 'public', 'images', 'profile.png');

    const imageBuffer = await readFile(imagePath);

    const imageDataUri = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const displayName = truncate(data.profile.name?.trim() || data.profile.login, 40);

    const username = truncate(data.profile.login, 30);

    const { outer, headerHeight, portrait, info } = LAYOUT;

    const languages = createLanguages(data);
    const stats = createStats(data);

    const infoRows = [
        createInfoRow('Subject', displayName, 181),
        createInfoRow('Handle', username, 231),
        createInfoRow('Role', 'Fullstack Developer', 281),
        createInfoRow('Status', 'Available', 331, { status: true }),
    ].join('');

    return `
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="auto"
    viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}"
    preserveAspectRatio="xMidYMid meet"
    style="display: block; max-width: 100%; height: auto;"
    role="img"
    aria-labelledby="widget-title widget-description"
>
    <title id="widget-title">GitHub profile: ${escapeXml(username)}</title>

    <desc id="widget-description">
        GitHub profile with portrait, profile information,
        programming language statistics and contribution metrics.
    </desc>

    <defs>
        <clipPath id="portrait-clip">
            <rect
                x="${portrait.x}"
                y="${portrait.y}"
                width="${portrait.width}"
                height="${portrait.height}"
                rx="20"
            />
        </clipPath>

        <linearGradient
            id="scanline-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
        >
            <stop
                offset="0%"
                stop-color="${COLORS.primary}"
                stop-opacity="0"
            />
            <stop
                offset="20%"
                stop-color="${COLORS.primary}"
                stop-opacity="0.02"
            />
            <stop
                offset="50%"
                stop-color="${COLORS.primary}"
                stop-opacity="0.16"
            />
            <stop
                offset="80%"
                stop-color="${COLORS.primary}"
                stop-opacity="0.02"
            />
            <stop
                offset="100%"
                stop-color="${COLORS.primary}"
                stop-opacity="0"
            />
        </linearGradient>

        <filter
            id="scanline-glow"
            x="-20%"
            y="-100%"
            width="140%"
            height="300%"
        >
            <feGaussianBlur stdDeviation="5" />
        </filter>
    </defs>

    <g transform="translate(12 10)">

        <!-- Cabeçalho -->
        <path
            d="
                M ${outer.x + 20} ${outer.y}
                H ${outer.x + outer.width - 20}
                Q ${outer.x + outer.width} ${outer.y}
                  ${outer.x + outer.width} ${outer.y + 20}
                V ${outer.y + headerHeight}
                H ${outer.x}
                V ${outer.y + 20}
                Q ${outer.x} ${outer.y} ${outer.x + 20} ${outer.y}
                Z
            "
            fill="${COLORS.surface}"
        />

        <!-- Moldura externa -->
        <rect
            x="${outer.x}"
            y="${outer.y}"
            width="${outer.width}"
            height="${outer.height}"
            rx="20"
            fill="${COLORS.surface}"
            stroke="${COLORS.primary}"
            stroke-width="1"
        />

        <circle cx="48" cy="41" r="7.5" fill="#e01f43" />
        <circle cx="74" cy="41" r="7.5" fill="#f2aa3d" />
        <circle cx="98" cy="41" r="7.5" fill="#3df255" />

        ${createText(SVG_WIDTH / 2, 46, 'itsmesiq@github.exe', {
            size: 16,
            color: COLORS.primary,
            anchor: 'middle',
            letterSpacing: 2,
        })}

        <circle
            cx="1816"
            cy="41"
            r="5"
            fill="${COLORS.primary}"
        />

        ${createText(1830, 46, 'LIVE', {
            size: 16,
            letterSpacing: 3,
        })}

        <line
            x1="${outer.x}"
            y1="${outer.y + headerHeight}"
            x2="${outer.x + outer.width}"
            y2="${outer.y + headerHeight}"
            stroke="${COLORS.primary}"
            stroke-width="1"
        />

        <!-- Painel de identidade -->
        <rect
            x="${portrait.x}"
            y="${portrait.y}"
            width="${portrait.width}"
            height="${portrait.height}"
            rx="20"
            fill="${COLORS.surface}"
            stroke="${COLORS.primary}"
            stroke-width="1"
        />

        <g clip-path="url(#portrait-clip)">
            <image
                x="${portrait.x}"
                y="${portrait.y}"
                width="${portrait.width}"
                height="${portrait.height}"
                preserveAspectRatio="xMidYMid meet"
                href="${imageDataUri}"
            />

            ${createText(portrait.x + 26, portrait.y + 29, '// IDENTITY_MODULE', {
                size: 16,
                color: COLORS.primary,
                letterSpacing: 2,
            })}

            <!-- Scanline: glow e linha fina se movem juntos -->
            <g pointer-events="none">
                <g>
                    <rect
                        x="${portrait.x}"
                        y="${portrait.y}"
                        width="${portrait.width}"
                        height="60"
                        fill="url(#scanline-gradient)"
                    />

                    <line
                        x1="${portrait.x}"
                        y1="${portrait.y + 30}"
                        x2="${portrait.x + portrait.width}"
                        y2="${portrait.y + 30}"
                        stroke="${COLORS.primary}"
                        stroke-width="2"
                        stroke-opacity="0.3"
                    />

                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 ${portrait.height - 60}; 0 0"
                        keyTimes="0;0.5;1"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                        dur="5s"
                        repeatCount="indefinite"
                    />
                </g>
            </g>
        </g>

        <!-- Painel de informações -->
        <rect
            x="${info.x}"
            y="${info.y}"
            width="${info.width}"
            height="${info.height}"
            rx="20"
            fill="${COLORS.surface}"
            stroke="${COLORS.primary}"
            stroke-width="1"
        />

        ${createText(info.x + 30, info.y + 29, '// SYSTEM_INFO', {
            size: 16,
            color: COLORS.primary,
            letterSpacing: 2,
        })}

        ${infoRows}

        ${createText(745, 405, '// LANGUAGES_MODULE', {
            size: 16,
            color: COLORS.primary,
            letterSpacing: 2,
        })}

        ${languages}

        ${stats}
    </g>
</svg>
    `.trim();
}
