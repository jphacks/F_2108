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
      },
      {
        Sid : "",
        Effect : "Allow",
        Principal : { AWS : "arn:aws:iam::${var.account_id}:user/${var.project}" },
        Action : ["s3:GetBucketPolicy", "s3:PutBucketPolicy"],
        Resource : ["arn:aws:s3:::${var.project}/*", "arn:aws:s3:::${var.project}"]
      }
    ]
  })

  tags = {
    Project = var.project
  }
}

resource "aws_iam_policy" "read-write-s3" {
  name = "${var.project}-read-write-s3"

  policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject",
          "s3:PutObject",
          "s3:PutObjectAcl"
        ],
        Resource : [
          "arn:aws:s3:::${aws_s3_bucket.main.bucket}/*"
        ]
      }
    ]
  })

  tags = {
    Project = var.project
  }
}
