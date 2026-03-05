import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs/promises";

/**
 * Parse variant string
 */
function parseVariant(str) {
    const [size, fit = "cover", position = "center"] = str.split(":");

    const [width, height] = size.split("x").map(Number);

    return {
        width: width || null,
        height: height || null,
        fit,
        position,
    };
}

export async function processImages(config) {
    const {
        input,
        output,
        variants,
        formats,
        quality,
        dryRun,
    } = config;

    const files = await glob(`${input}/**/*.{jpg,jpeg,png,webp}`);

    if (files.length === 0) {
        console.log("No images found.");
        return;
    }

    const tasks = [];

    for (const file of files) {
        const relativePath = path.relative(input, file);
        const dir = path.dirname(relativePath);
        const ext = path.extname(file);
        const name = path.basename(file, ext);

        for (const variant of variantList) {
            for (const format of formats) {
                const width = variant.width;
                const height = variant.height;

                const outputDir = path.join(output, dir);
                const outputName = `${name}-${width || ""}x${height || ""}.${format}`;
                const outputPath = path.join(outputDir, outputName);

                tasks.push(async () => {
                    if (dryRun) {
                        console.log("DRY RUN:", outputPath);
                        return;
                    }

                    await fs.mkdir(outputDir, { recursive: true });

                    let image = sharp(file);

                    image = image.resize({
                        width,
                        height,
                        fit: variant.fit,
                        position: variant.position,
                    });

                    await image
                        .toFormat(format, { quality })
                        .toFile(outputPath);

                    console.log("✓", outputPath);
                });
            }
        }
    }

    /**
   * Parallel processing
   */
    const concurrency = 5;
    const pool = [];

    for (const task of tasks) {
        const p = task();

        pool.push(p);

        if (pool.length >= concurrency) {
            await Promise.race(pool).catch(() => {});
            pool.splice(pool.findIndex(p => p.isFulfilled), 1);
        }
    }

    await Promise.all(pool);
}