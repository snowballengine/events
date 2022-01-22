const { resolve } = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    output: {
        path: resolve(__dirname, "dist"),
        filename: "index.js",

        library: {
            name: "events",
            type: "umd",
        },
    },
    mode: "production",
};
