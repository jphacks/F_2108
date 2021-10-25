// NOTE: react-pdfをNext.jsで動作させるために、動的に読み込むスクリプトを変更する（https://codesandbox.io/s/react-pdf-next-js-y4ev2）
/* eslint-disable no-undef */
if (process.env.NODE_ENV === "production") {
  // use minified verion for production
  // @ts-ignore
  module.exports = require("pdfjs-dist/build/pdf.worker.min.js")
} else {
  // @ts-ignore
  module.exports = require("pdfjs-dist/build/pdf.worker.js")
}
