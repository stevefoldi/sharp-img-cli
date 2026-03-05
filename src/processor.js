import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { glob } from "glob";

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

async function processSingleImage(file, config, variantList) {
    const {
        input,
        output,
        formats,
        quality,
        dryRun
    } = config;
    const relativePath = path.relative(input, file);
    const dir = path.dirname(relativePath);
    const ext = path.extname(file);
    const name = path.basename(file, ext);

    for (const variant of variantList) {
        for (const format of formats) {
            const width = variant.width;
            const height = variant.height;
            const outputDir = path.join(output, dir);
            const outputName =
                `${name}-${width || ""}x${height || ""}.${format}`;
            const outputPath = path.join(outputDir, outputName);

            if (dryRun) {
                console.log("DRY RUN:", outputPath);
                continue;
            }

            await fs.mkdir(outputDir, { recursive: true });

            let image = sharp(file);

            image = image.resize({
                width,
                height,
                fit: variant.fit,
                position: variant.position
            });

            await image
                .toFormat(format, { quality })
                .toFile(outputPath);

            console.log("✓", outputPath);
        }
    }
}

export async function processImages(config) {
    const {
        input,
        variants
    } = config;
    const files = await glob(`${input}/**/*.{jpg,jpeg,png,webp}`);

    if (files.length === 0) {
        console.log("No images found.");
        return;
    }

    const variantList = variants.map(parseVariant);

    /**
   * Concurrency limit
   */
    const concurrency = 5;
    const queue = [...files];
    const workers = Array(concurrency)
    .fill(null)
    .map(async () => {
        while (queue.length > 0) {
            const file = queue.shift();

            if (!file) break;
            await processSingleImage(
                file,
                config,
                variantList
            );
        }
    });

    await Promise.all(workers);
}