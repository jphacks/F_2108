resource "aws_s3_bucket" "main" {
  bucket = var.project
  acl    = "private"

  tags = {
    Project = var.project
  }
}
