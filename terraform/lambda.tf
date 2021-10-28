resource "aws_lambda_function" "pdf-generator" {
  function_name    = "${var.project}-pdf-generator"
  filename         = "index.zip"
  source_code_hash = filebase64sha256("../packages/pdf-generator/index.zip")
  role             = aws_iam_role.pdf-generator.arn
  runtime          = "nodejs12.x"
  handler          = "index.handler"

  tags = {
    Project = var.project
  }
}

resource "aws_iam_role" "pdf-generator" {
  name = "${var.project}-pdf-generator"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Sid : ""
        Effect : "Allow",
        Action : "sts:AssumeRole",
        Principal : {
          Service : "lambda.amazonaws.com"
        },
      }
    ]
  })

  tags = {
    Project = var.project
  }
}

resource "aws_iam_role_policy_attachment" "pdf-generator-read-write-s3" {
  role       = aws_iam_role.pdf-generator.name
  policy_arn = aws_iam_policy.read-write-s3.arn
}

resource "aws_lambda_permission" "cloudwatch_logs_app" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pdf-generator.function_name
  principal     = "s3.${var.region}.amazonaws.com"
  source_arn    = aws_s3_bucket.main.arn
}
