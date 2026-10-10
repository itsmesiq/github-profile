import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { GithubProfileData } from './types';

const SVG_WIDTH = 1920;
const SVG_HEIGHT = 700;

const COLORS = {
    background: '#08080b',
    surface: '#111116',
    foreground: '#f2f0f5',
    muted: '#a7a7b3',
    stroke: '#1c1c24',
    primary: '#3df2bc',
    secondary: '#ff2d78',
    tertiary: '#c4b5fd',
};

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
        size = 18,
        color = COLORS.foreground,
        weight = 400,
        anchor = 'start',
        letterSpacing = 0,
    } = options;

    return `
        <text
            x="${x}"
            y="${y}"
            fill="${color}"
            font-family="monospace"
            font-size="${size}"
            font-weight="${weight}"
            text-anchor="${anchor}"
            letter-spacing="${letterSpacing}"
        >${escapeXml(value)}</text>
    `;
}

function createLanguageBars(data: GithubProfileData): string {
    const languages = data.languages.slice(0, 5);

    if (languages.length === 0) {
        return createText(0, 0, 'No language available.', {
            size: 11,
            color: COLORS.muted,
        });
    }

    const barWidth = 430;
    const barWeight = 8;
    const rowHeight = 57;

    return languages
        .map((language, index) => {
            const y = index * rowHeight;
            const percentage = Math.max(0, Math.min(100, language.percentage));
            const width = (barWidth * percentage) / 100;

            const color =
                index === 0
                    ? COLORS.primary
                    : index === 1
                      ? COLORS.secondary
                      : index === 2
                        ? COLORS.tertiary
                        : '#777784';

            return `
            <g transform="translate(0, ${y})">
                ${createText(0, 18, language.name, {
                    size: 16,
                    color: COLORS.foreground,
                })}

                ${createText(barWidth, 18, `${percentage}%`, {
                    size: 15,
                    color: COLORS.muted,
                    anchor: 'end',
                })}

                <rect
                    x="0"
                    y="30"
                    width="${barWidth}"
                    height="${barWeight}"
                    rx="2"
                    fill="${COLORS.stroke}"
                />

                <rect
                    x="0"
                    y="30"
                    width="${width}"
                    height="${barWeight}"
                    rx="2"
                    fill="${color}"
                />
            </g>
        `;
        })
        .join('');
}

function createStatCard(
    x: number,
    y: number,
    width: number,
    label: string,
    value: number,
    accent: string,
): string {
    return `
        <g transform="translate(${x}, ${y})">
            <rect
                width="${width}"
                height="100"
                rx="4"
                fill="${COLORS.background}"
                stroke="${COLORS.stroke}"
            />

            <rect
                width="3"
                height="100"
                fill="${accent}"
            />

            ${createText(20, 32, label.toUpperCase(), {
                size: 13,
                color: COLORS.muted,
                letterSpacing: 1,
            })}

            ${createText(20, 73, value.toLocaleString('en-US'), {
                size: 31,
                color: COLORS.foreground,
                weight: 700,
            })}
        </g>
    `;
}

export async function generateProfileSvg(data: GithubProfileData): Promise<string> {
    const imagePath = join(process.cwd(), 'public', 'images', 'profile.png');

    const imageBuffer = await readFile(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageDataUri = `data:image/png;base64,${imageBase64}`;

    const displayName = truncate(data.profile.name?.trim() || data.profile.login, 28);

    const username = truncate(data.profile.login, 30);

    const leftX = 32;
    const topY = 28;
    const panelWidth = SVG_WIDTH - 64;
    const panelHeight = SVG_HEIGHT - 56;

    const headerHeight = 56;
    const contentY = topY + headerHeight;
    const contentHeight = panelHeight - headerHeight;

    const leftPanelWidth = 640;
    const rightPanelX = leftX + leftPanelWidth;
    const rightPanelWidth = panelWidth - leftPanelWidth;

    const statsY = contentHeight - 124;
    const statGap = 16;
    const statWidth = (rightPanelWidth - 64 - statGap * 3) / 4;
    const statX = rightPanelX + 32;

    const stats = [
        {
            label: 'Repositories',
            value: data.profile.public_repos,
            color: COLORS.primary,
        },
        {
            label: 'Pull requests',
            value: data.pullRequests,
            color: COLORS.primary,
        },
        {
            label: 'Contributions',
            value: data.contributions,
            color: COLORS.primary,
        },
        {
            label: 'Active days',
            value: data.activeDays,
            color: COLORS.primary,
        },
    ];

    const statCards = stats
        .map((stat, index) =>
            createStatCard(
                statX + index * (statWidth + statGap),
                contentY + statsY,
                statWidth,
                stat.label,
                stat.value,
                stat.color,
            ),
        )
        .join('');

    const languagesY = contentY + 275;
    const languageBars = createLanguageBars(data);

    return `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="${SVG_WIDTH}"
            height="${SVG_HEIGHT}"
            viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}"
            role="img"
            aria-labelledby="widget-title widget-description"
        >
            <title id="widget-title">GitHub Profile: ${escapeXml(username)}</title>
            <desc id="widget-description">
                 GitHub profile widget with profile image, programming languages, repository statistics and an animated scanline.
            </desc>

            <defs>
                <clipPath id="portrait-clip">
                    <rect
                        x="${leftX + 1}"
                        y="${contentY + 1}"
                        width="${leftPanelWidth - 2}"
                        height="${contentHeight - 2}"
                    />
                </clipPath>

                <clipPath id="image-clip">
                    <rect
                        x="${leftX + 20}"
                        y="${contentY + 60}"
                        width="${leftPanelWidth - 40}"
                        height="${contentHeight - 90}"
                    />
                </clipPath>

                <linearGradient id="scanline-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${COLORS.primary}" stop-opacity="0"/>
                    <stop offset="50%" stop-color="${COLORS.primary}" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="${COLORS.primary}" stop-opacity="0"/>
                </linearGradient>

                <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>  
            </defs>
            <rect
                width="${SVG_WIDTH}"
                height="${SVG_HEIGHT}"
                fill="${COLORS.background}"
            />

            <!-- Outer terminal frame -->
            <rect
                x="${leftX}"
                y="${topY}"
                width="${panelWidth}"
                height="${panelHeight}"
                rx="5"
                fill="${COLORS.surface}"
                stroke="${COLORS.primary}"
                stroke-width="1.5"
            />

            <!-- Terminal header -->
            <path
                d="
                    M ${leftX + 5} ${topY}
                    H ${leftX + panelWidth - 5}
                    Q ${leftX + panelWidth} ${topY} ${leftX + panelWidth} ${topY + 5}
                    V ${topY + headerHeight}
                    H ${leftX}
                    V ${topY + 5}
                    Q ${leftX} ${topY} ${leftX + 5} ${topY}
                    Z
                "
                fill="${COLORS.background}"
            />

            <circle cx="${leftX + 24}" cy="${topY + 28}" r="6" fill="${COLORS.secondary}"/>
            <circle cx="${leftX + 44}" cy="${topY + 28}" r="6" fill="${COLORS.tertiary}"/>
            <circle cx="${leftX + 64}" cy="${topY + 28}" r="6" fill="${COLORS.primary}"/>

            ${createText(leftX + 92, topY + 34, 'GITHUB_PROFILE.exe', {
                size: 17,
                color: COLORS.foreground,
                weight: 700,
                letterSpacing: 1,
            })}
        
            ${createText(leftX + panelWidth - 26, topY + 34, 'SYSTEM ONLINE', {
                size: 13,
                color: COLORS.primary,
                anchor: 'end',
                letterSpacing: 1,
            })}
        
            <line
                x1="${leftX}"
                y1="${contentY}"
                x2="${leftX + panelWidth}"
                y2="${contentY}"
                stroke="${COLORS.primary}"
                stroke-opacity="0.6"
            />
        
            <!-- Left portrait panel -->
            <g clip-path="url(#portrait-clip)">
                <rect
                    x="${leftX}"
                    y="${contentY}"
                    width="${leftPanelWidth}"
                    height="${contentHeight}"
                    fill="${COLORS.surface}"
                />
        
                ${createText(leftX + 26, contentY + 35, '// IDENTITY_MODULE', {
                    size: 13,
                    color: COLORS.primary,
                    letterSpacing: 1,
                })}
            
                <image
                    x="${leftX + 20}"
                    y="${contentY + 60}"
                    width="${leftPanelWidth - 40}"
                    height="${contentHeight - 90}"
                    preserveAspectRatio="xMidYMid meet"
                    clip-path="url(#image-clip)"
                    href="${imageDataUri}"
                    xlink:href="${imageDataUri}"
                />
            
                <!-- Animated scanline -->
                <rect
                    x="${leftX + 20}"
                    y="${contentY + 60}"
                    width="${leftPanelWidth - 40}"
                    height="18"
                    fill="url(#scanline-gradient)"
                    filter="url(#soft-glow)"
                    pointer-events="none"
                >
                    <animate
                        attributeName="y"
                        values="${contentY + 60};${contentY + contentHeight - 30};${contentY + 60}"
                        dur="5s"
                        repeatCount="indefinite"
                    />
                </rect>
            
                <line
                    x1="${leftX + 26}"
                    y1="${contentY + contentHeight - 30}"
                    x2="${leftX + leftPanelWidth - 26}"
                    y2="${contentY + contentHeight - 30}"
                    stroke="${COLORS.primary}"
                    stroke-opacity="0.5"
                />
            
                ${createText(leftX + 26, contentY + contentHeight - 10, 'IDENTITY VERIFIED', {
                    size: 12,
                    color: COLORS.primary,
                    letterSpacing: 1,
                })}
            </g>
            
            <line
                x1="${rightPanelX}"
                y1="${contentY}"
                x2="${rightPanelX}"
                y2="${contentY + contentHeight}"
                stroke="${COLORS.primary}"
                stroke-opacity="0.6"
            />
            
            <!-- Right profile panel -->
            <g>
                ${createText(rightPanelX + 32, contentY + 36, 'SUBJECT', {
                    size: 12,
                    color: COLORS.muted,
                    letterSpacing: 2,
                })}
            
                ${createText(rightPanelX + 32, contentY + 76, displayName, {
                    size: 32,
                    color: COLORS.foreground,
                    weight: 700,
                })}
            
                ${createText(rightPanelX + 32, contentY + 108, `@${username}`, {
                    size: 16,
                    color: COLORS.primary,
                })}
            
                ${createText(rightPanelX + 32, contentY + 154, 'ROLE', {
                    size: 12,
                    color: COLORS.muted,
                    letterSpacing: 2,
                })}
            
                ${createText(rightPanelX + 32, contentY + 179, 'UI/UX DESIGNER  /  DEVELOPER', {
                    size: 16,
                    color: COLORS.foreground,
                })}
            
                ${createText(rightPanelX + 32, contentY + 220, 'STATUS', {
                    size: 12,
                    color: COLORS.muted,
                    letterSpacing: 2,
                })}
            
                <circle
                    cx="${rightPanelX + 38}"
                    cy="${contentY + 245}"
                    r="5"
                    fill="${COLORS.primary}"
                />
            
                ${createText(rightPanelX + 54, contentY + 251, 'AVAILABLE / ONLINE', {
                    size: 14,
                    color: COLORS.primary,
                })}
            
                ${createText(rightPanelX + 32, languagesY - 18, 'LANGUAGE DISTRIBUTION', {
                    size: 13,
                    color: COLORS.primary,
                    letterSpacing: 1.5,
                })}
            
                <g transform="translate(${rightPanelX + 32} ${languagesY})">
                    ${languageBars}
                </g>
            
                ${statCards}
            </g>
        </svg>
    `.trim();
}
