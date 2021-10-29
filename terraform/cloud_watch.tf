resource "aws_cloudwatch_log_group" "app" {
  name = "/${var.project}/ecs/app"

  tags = {
    Project = var.project
  }
}

resource "aws_cloudwatch_log_group" "nginx" {
  name = "/${var.project}/ecs/nginx"

  tags = {
    Project = var.project
  }
}