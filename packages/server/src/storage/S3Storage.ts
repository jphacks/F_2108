import { IStorage } from "./IStorage"
import { S3 } from "aws-sdk"
import createError from "fastify-error"
import { ERR_INTERNAL_SERVER } from "../util/errors"

export class S3Storage implements IStorage {
  constructor(
    private readonly s3 = new S3({
      accessKeyId: "AKIASURP2L2B66IBLZBZ",
      secretAccessKey: "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",
      region: process.env.AWS_REGION,
    }),
  ) {}

  async save(
    type: "file" | "audio",
    filename: string,
    content: Buffer,
  ): Promise<{ url: string }> {
    const key = `${type}/${filename}`
    const param: S3.Types.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME ?? "",
      Key: key,
      Body: content,
      ACL: "public-read",
    }

    try {
      const result = await this.s3.upload(param).promise()
      const url = result.Location

      return { url }
    } catch (e) {
      const err = createError(
        ERR_INTERNAL_SERVER,
        "Failed to upload file.",
        500,
        e,
      )
      throw new err()
    }
  }
}
