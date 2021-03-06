import { Lambda } from "aws-sdk"
import { ThumbnailGenerator } from "./ThumbnailGenerator"

export class LambdaThumbnailGenerator implements ThumbnailGenerator {
  constructor(
    private readonly lambda = new Lambda({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_THUMBNAIL_GENERATOR_EXEC_USER_KEY,
      secretAccessKey: process.env.AWS_THUMBNAIL_GENERATOR_EXEC_USER_SECRET,
    }),
  ) {}

  generate(fileId: string, url: string) {
    const args = {
      url,
      fileId,
    }
    const params: Lambda.InvokeAsyncRequest = {
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? "",
      InvokeArgs: JSON.stringify(args),
    }

    this.lambda.invokeAsync(params, (err, data) => {
      if (err) {
        console.error(err, err.stack)
      }
    })
  }
}
