// import { defineConfig } from "vite";

// export default defineConfig(({ command }) => ({
//     base: command === "build" ? "/WAVE-CYBER-CAFE/" : "/"
// }));

// import { defineConfig } from "vite";

// export default defineConfig({
//     base: process.env.VITE_BASE || "/"
// });

import { defineConfig } from "vite";

export default defineConfig({
    base: process.env.VITE_BASE || "/wave_technology_hub/"
});