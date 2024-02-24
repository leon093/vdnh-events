// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
    devtools: { enabled: false },
    css: ["~/assets/css/reset.css", "~/assets/css/styles.css"],
    app: {
        head: {
            title: "ВДНХ",
        },
    },
    vite: {
        plugins: [svgLoader()]
    }
});
