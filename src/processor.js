import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs/promises";

export async function processImages(config) {
    const files = await glob(`${config.input}/**/*.{jpg,jpeg,png}`);

    if (!files.length) {
        console.log("No images found.");
        return;
    }

    let totalTasks =
        files.length *
        config.sizes.length *
        config.formats.length;

    let completed = 0;

    for (const file of files) {
        const relativePath = path.relative(config.input, file);
        const dir = path.dirname(relativePath);
        const filename = path.basename(file, path.extname(file));

        for (const size of config.sizes) {
            for (const format of config.formats) {
                const outputDir = path.join(config.output, dir);
                await fs.mkdir(outputDir, { recursive: true });

                const outputPath = path.join(
                    outputDir,
                    `${filename}-${size}.${format}`
                );

                if (config.dryRun) {
                    console.log(`[DRY RUN] Would create: ${outputPath}`);
                } else {
                    await sharp(file)
                        .resize(size)
                        .toFormat(format, { quality: config.quality })
                        .toFile(outputPath);
                }

                completed++;
                console.log(
                    `[${completed}/${totalTasks}] ✔ ${outputPath}`
                );
            }
        }
    }
}