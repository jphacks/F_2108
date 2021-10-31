import { Lambda } from "aws-sdk"
import { ThumbnailGenerator } from "./ThumbnailGenerator"

export class LambdaThumbnailGenerator implements ThumbnailGenerator {
  constructor(
    private readonly lambda = new Lambda({
      region: process.env.AWS_REGION,
    }),
  ) {}

  generate(fileId: string, url: string) {
    const args = {
      url,
      fileId,
    }
    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? "",
      InvocationType: "Event",
      Payload: JSON.stringify(args),
    }

    this.lambda.invoke(params)
  }
}
