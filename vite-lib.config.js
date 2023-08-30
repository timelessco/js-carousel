import path from "path";
import { defineConfig } from "vite";

import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.es.js`,
  umd: `${getPackageName()}.umd.js`,
};

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      outDir: path.resolve(__dirname, "lib"),
      lib: {
        entry: path.resolve(__dirname, "src/carousel.js"),
        name: getPackageNameCamelCase(),
        formats: ["es", "umd"],
        fileName: format => fileName[format],
      },
    },
  };
});
