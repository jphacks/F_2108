resource "aws_s3_bucket" "main" {
  bucket = var.project
  acl    = "public-read"

  policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Sid : "",
        Effect : "Allow",
        Principal : "*",
        Action : ["s3:GetObject", "s3:GetObjectVersion"],
        Resource : ["arn:aws:s3:::${var.project}/*"]
      }
    ]
  })

  tags = {
    Project = var.project
  }
}
