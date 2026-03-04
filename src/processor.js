import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs/promises";

export async function processImages({ input, output, sizes, format }) {
    const files = await glob(`${input}/**/*.{jpg,jpeg,png}`);

    await fs.mkdir(output, { recursive: true });

    for (const file of files) {
        const filename = path.basename(file, path.extname(file));

        for (const size of sizes) {
            const outputPath = path.join(
                output,
                `${filename}-${size}.${format}`
            );

            await sharp(file)
                .resize(size)
                .toFormat(format, { quality: 80 })
                .toFile(outputPath);

            console.log(`✔ Created: ${outputPath}`);
        }
    }
}