import { build } from "esbuild";
import { rmSync } from "node:fs";

// Drop superseded content-hashed chunks before each build.
rmSync("dist/assets/interactive", { recursive: true, force: true });

await build({
  entryPoints: ["src/quote-form.jsx", "src/blog.jsx"],
  outdir: "dist/assets/interactive",
  bundle: true,
  splitting: true,
  format: "esm",
  target: ["es2022"],
  jsx: "automatic",
  minify: true,
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  assetNames: "media/[name]-[hash]",
  external: ["/js/wix/*"],
  loader: { ".woff": "file", ".woff2": "file", ".ttf": "file", ".svg": "file", ".png": "file", ".gif": "file" },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info"
});
