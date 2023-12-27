import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig([
 {
   clean: true,
   sourcemap: true,
   target: ["es2020"],
   tsconfig: path.resolve(__dirname, "./tsconfig.json"),
   entry: ["./!(index).ts?(x)"],
   format: ["esm"],
   outDir: "dist/",
   esbuildOptions(options:any, context) {
     options.outbase = "./";
    },
 },
 {
   clean: true,
   target: ["es2020"],
   sourcemap: true,
   tsconfig: path.resolve(__dirname, "./tsconfig.json"),
   entry: ["index.tsx"],
   bundle: false,
   format: ["esm"],
   outDir: "dist",
   esbuildOptions(options, context) {
     options.outbase = "./";
   },
 },
]);