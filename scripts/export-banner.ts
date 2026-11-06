import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const CONFIG = {
    url: 'http://localhost:3000/export/profile-banner',
    width: 1536,
    height: 600,
    duration: 6000,
    fps: 15,
    outputDir: path.resolve('public/images'),
    videoName: 'profile-banner.webm',
    gifName: 'profile-banner.gif',
};

async function main() {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });

    const videoPath = path.join(CONFIG.outputDir, CONFIG.videoName);
    const gifPath = path.join(CONFIG.outputDir, CONFIG.gifName);

    const browser = await chromium.launch({
        headless: true,
    });

    try {
        const context = await browser.newContext({
            viewport: { width: CONFIG.width, height: CONFIG.height },
            deviceScaleFactor: 1,
            recordVideo: {
                dir: CONFIG.outputDir,
                size: {
                    width: CONFIG.width,
                    height: CONFIG.height,
                },
            },
        });

        const page = await context.newPage();

        console.log('Opening profile banner...');

        await page.goto(CONFIG.url, {
            waitUntil: 'networkidle',
        });

        await page.evaluate(async () => {
            await document.fonts.ready;

            const images = Array.from(document.images);

            await Promise.all(
                images.map((image) => {
                    if (image.complete) {
                        return Promise.resolve();
                    }

                    return new Promise<void>((resolve) => {
                        image.addEventListener('load', () => resolve(), {
                            once: true,
                        });

                        image.addEventListener('error', () => resolve(), {
                            once: true,
                        });
                    });
                }),
            );

            const banner = page.locator('#profile-banner-export');

            await banner.waitFor({
                state: 'visible',
            });

            console.log('Recording banner...');

            await page.waitForTimeout(CONFIG.duration);

            const video = page.video();

            await context.close();

            if (!video) {
                throw new Error('Could not generate the recording');
            }

            const recordedVideoPath = await video.path();

            await fs.rename(recordedVideoPath, videoPath);

            console.log('Converting video to GIF...');

            const filter = [
                `fps=${CONFIG.fps}`,
                'scale=1536:-1:flags=lanczos',
                'split[s0][s1]',
                '[s0]palettegen=max_colors=128:stats_mode=diff[p]',
                '[s1][p]paletteuse=dither=bayer',
            ].join(',');

            await execFileAsync('ffmped', [
                '-y',
                '-i',
                videoPath,
                '-vf',
                filter,
                '-loop',
                '0',
                gifPath,
            ]);

            const stats = await fs.stat(gifPath);

            console.log('\nExport completed!');
            console.log(`GIF: ${gifPath}`);
            console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        });
    } finally {
        await browser.close();
    }
}

main().catch((error) => {
    console.error('Export failed:', error);
    process.exit(1);
});
