/** @type {import('next').NextConfig} */
// eslint-disable-next-line
module.exports = {
  reactStrictMode: true,
  images: {
    // eslint-disable-next-line no-undef
    domains: [
      "lh3.googleusercontent.com",
      "f-2108.s3.ap-northeast-1.amazonaws.com",
      "f-2108.s3.amazonaws.com.s3.ap-northeast-1.amazonaws.com",
    ],
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
