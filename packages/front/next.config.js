// eslint-disable-next-line no-undef
const IMAGE_SRC_DOMAIN = process.env.NEXT_PUBLIC_IMAGE_SRC_DOMAIN
/** @type {import('next').NextConfig} */
// eslint-disable-next-line
module.exports = {
  reactStrictMode: true,
  images: {
    // eslint-disable-next-line no-undef
    domains: IMAGE_SRC_DOMAIN != null ? [IMAGE_SRC_DOMAIN] : undefined,
  },
  webpack: (config) => {
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker",
          },
        },
      ],
    })

    return config
  },
}
