resource "aws_ecr_repository" "app" {
  name = "${var.project}-app"

  tags = {
    Project = var.project
  }
}

resource "aws_ecr_repository" "nginx" {
  name = "${var.project}-nginx"

  tags = {
    Project = var.project
  }
}

output "ecr_repository_app" {
  value = aws_ecr_repository.app.repository_url
}

output "ecr_repository_nginx" {
  value = aws_ecr_repository.nginx.repository_url
}
