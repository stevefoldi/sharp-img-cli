# sharp-img-cli Cheat Sheet

Quick reference for using the `imgtool` CLI.

---

# Basic Command

Process images from an input folder to an output folder:

```bash
imgtool process <input> <output>
```

Example:

```bash
imgtool process ./images ./dist
```

---

# Resize Variants

Variants allow you to generate **multiple sizes of each image**.

### Example

```bash
imgtool process ./images ./dist \
  --variant 600x400:cover:top \
  --variant 1000x
```

### Result

| Variant             | Behavior                                                    |
| ------------------- | ----------------------------------------------------------- |
| `600x400:cover:top` | Resize to 600px width and crop height to 400px from the top |
| `1000x`             | Resize width to 1000px while maintaining aspect ratio       |

---

# Variant Format

```
WIDTHxHEIGHT:FIT:POSITION
```

Examples:

```bash
600x400
600x400:cover
600x400:cover:top
1000x
```

### Fit Options

```
cover
contain
fill
inside
outside
```

### Position Options

```
center
top
bottom
left
right
```

Example:

```bash
--variant 600x400:cover:top
```

---

# Presets

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

# Optional Project Config

Create a file in your project root:

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

Now you can run:

```bash
imgtool process
```

---

# Supported Formats

Output formats can include:

```
webp
jpeg
png
avif
```

Example config:

```javascript
formats: ["webp"]
```

---

# Recursive Directory Processing

Process images inside nested folders:

```bash
imgtool process ./images ./dist --recursive
```

---

# Dry Run (Test Without Processing)

Preview what the CLI will do:

```bash
imgtool process ./images ./dist --dry-run
```

This prints the planned operations without modifying files.

---

# Parallel Processing

Control how many images are processed simultaneously.

Example:

```bash
imgtool process ./images ./dist --concurrency 4
```

---

# Global CLI Installation

Link the CLI globally during development:

```bash
npm link
```

Then use it anywhere:

```bash
imgtool process ./images ./dist
```

---

# Run Without Global Install

You can run the CLI directly:

```bash
node bin/cli.js process ./images ./dist
```

---

# Typical Workflow

Example project structure:

```
project/
  images/
  dist/
  imgtool.config.js
```

Process images:

```bash
imgtool process
```

Output:

```
dist/
  image-600x400.webp
  image-1000.webp
  photo-600x400.webp
  photo-1000.webp
```

---

# Helpful Commands

Show CLI help:

```bash
imgtool --help
```

Show command help:

```bash
imgtool process --help
```
