/* eslint-disable no-undef */
if (process.env.NODE_ENV === "production") {
  // use minified verion for production
  // @ts-ignore
  module.exports = require("pdfjs-dist/build/pdf.worker.min.js");
} else {
  // @ts-ignore
  module.exports = require("pdfjs-dist/build/pdf.worker.js");
}
