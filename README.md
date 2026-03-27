# sharp-img-cli

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-blue)
![CLI](https://img.shields.io/badge/type-CLI-orange)

A fast and flexible **Node.js CLI for batch image processing** powered by **Sharp**.

Resize, crop, and convert large sets of images using configurable variants, presets, and parallel processing.

Perfect for:

- Web developers optimizing images
- Static site image pipelines
- React / WordPress / Jamstack projects
- Batch resizing image folders

---

# Quick Example

Resize and crop images:

```bash
imgtool process ./images ./dist \
  --variant 600x400:cover:top \
  --variant 1000x
```

Output:

```
dist/
  photo-600x400.webp
  photo-1000.webp
  image-600x400.webp
  image-1000.webp
```

---

# Features

- Batch image processing
- Multiple resize variants
- Crop control (`top`, `center`, etc.)
- Format conversion (`webp`, `png`, `jpeg`, etc.)
- Compression without resizing (`--no-resize`)
- Recursive directory scanning
- Parallel processing
- Optional project configuration
- Custom presets
- Progress bar output

---

# Installation

Clone the repository:

```bash
git clone git@github.com:stevefoldi/sharp-img-cli.git
cd sharp-img-cli
```

Install dependencies:

```bash
npm install
```

Link the CLI globally:

```bash
npm link
```

Verify installation:

```bash
imgtool --help
```

---

# Basic Usage

Process images from an input directory:

```bash
imgtool process ./images ./dist
```

---

# Resize Variants

Generate multiple versions of each image.

Example:

```bash
imgtool process ./images ./dist \
  --variant 600x400:cover:top \
  --variant 1000x
```

| Variant             | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `600x400:cover:top` | Resize width to 600px and crop height to 400px from the top |
| `1000x`             | Resize width to 1000px while maintaining aspect ratio       |

---

# Format Conversion

Convert images to another format:

```bash
imgtool process ./images ./dist --format webp
```

Multiple formats:

```bash
imgtool process ./images ./dist --format webp png
```

---

# Compression Only (No Resize)

Keep original dimensions:

```bash
imgtool process ./images ./dist \
  --format png \
  --no-resize
```

---

# Using Presets

Presets allow reusable image transformations.

Example:

```bash
imgtool process ./images ./dist --preset blog
```

Example preset definition:

```javascript
export const presets = {
	blog: [{ width: 600, height: 400, fit: "cover", position: "top" }, { width: 1000 }],
};
```

Default presets:

```js
presets: {
  thumbnail: {
    variants: ["600x400:cover:top"]
  },
  large: {
    variants: ["1000x"]
  },
  blog: {
    variants: ["600x400:cover:top", "1000x"]
  }
}
```

---

# Project Configuration

You can place an optional configuration file in any project.

```bash
imgtool.config.js
```

Example:

```javascript
export default {
	input: "./images",
	output: "./dist",
	formats: ["webp"],
	quality: 80,
	recursive: true,
};
```

Then simply run:

```bash
imgtool process
```

---

# CLI Options

| Option           | Description         |
| ---------------- | ------------------- |
| `--variant`      | Resize variants     |
| `--preset`       | Use preset          |
| `--format`       | Output formats      |
| `--quality`      | Compression quality |
| `--concurrency`  | Parallel processing |
| `--dry-run`      | Preview only        |
| `--no-recursive` | Disable subfolders  |
| `--no-resize`    | Disable resizing    |

---

## Force Reprocessing

By default, existing images are skipped to improve performance.

To reprocess all images, use:

````bash
imgtool process ./images ./dist --force

---

# Development

Run the CLI without installing globally:

```bash
node bin/cli.js process ./images ./dist
````

---

# Documentation

See the full command reference:

**CHEATSHEET.md**

---

# Tech Stack

- Node.js
- Sharp
- Commander
- Glob
- cli-progress

---

# License

MIT License © 2026 Steve Foldi
