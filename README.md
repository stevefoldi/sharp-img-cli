# sharp-img-cli

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-blue)
![CLI](https://img.shields.io/badge/type-CLI-orange)

A fast and flexible **Node.js CLI for batch image processing** powered by **Sharp**.

Resize, crop, and convert large sets of images using configurable variants, presets, and parallel processing.

Perfect for:

* Web developers optimizing images
* Static site image pipelines
* React / WordPress / Jamstack projects
* Batch resizing image folders

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

* Batch image processing
* Multiple resize variants
* Crop control (`top`, `center`, etc.)
* Recursive directory scanning
* Parallel processing
* Optional project configuration
* Custom presets
* Web-optimized formats

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

# Using Presets

Presets allow reusable image transformations.

Example:

```bash
imgtool process ./images ./dist --preset blog
```

Example preset definition:

```javascript
export const presets = {
  blog: [
    { width: 600, height: 400, fit: "cover", position: "top" },
    { width: 1000 }
  ]
};
```

---

# Project Configuration

You can place an optional configuration file in any project.

```
imgtool.config.js
```

Example:

```javascript
export default {
  input: "./images",
  output: "./dist",
  formats: ["webp"],
  quality: 80,
  recursive: true
};
```

Then simply run:

```bash
imgtool process
```

---

# Development

Run the CLI without installing globally:

```bash
node bin/cli.js process ./images ./dist
```

---

# Documentation

See the full command reference:

**CHEATSHEET.md**

---

# Tech Stack

* Node.js
* Sharp
* Commander
* Glob

---

# License

MIT License © 2026 Steve Foldi
