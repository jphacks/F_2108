resource "aws_ecs_cluster" "main" {
  name = var.project

  tags = {
    Project = var.project
  }
}

resource "aws_ecs_service" "main" {
  name                               = var.project
  cluster                            = aws_ecs_cluster.main.arn
  task_definition                    = "${aws_ecs_task_definition.main.family}:${max(aws_ecs_task_definition.main.revision, data.aws_ecs_task_definition.main.revision)}"
  desired_count                      = 1
  launch_type                        = "FARGATE"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  wait_for_steady_state              = true

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_c.id]
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "nginx"
    container_port   = 80
  }

  depends_on = [aws_lb_target_group.main]

  tags = {
    Project = var.project
  }
}

data "aws_ecs_task_definition" "main" {
  task_definition = aws_ecs_task_definition.main.family
}

resource "aws_ecs_task_definition" "main" {
  family                   = var.project
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = data.aws_iam_role.ecsTaskExecutionRole.arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = aws_ecr_repository.app.repository_url
      essential = true
      environment = [
        { name : "NODE_ENV", value : "production" },
        { name : "DB_HOST", value : aws_db_instance.main.address },
        { name : "DB_PORT", value : tostring(aws_db_instance.main.port) },
        { name : "DB_USER", value : var.db.user },
        { name : "DB_PASSWORD", value : var.db.password },
        { name : "DB_NAME", value : var.db.name },
        { name : "FIREBASE_ADMIN_PROJECT_ID", value : var.firebase.project_id },
        { name : "FIREBASE_ADMIN_CLIENT_EMAIL", value : var.firebase.client_email },
        { name : "FIREBASE_ADMIN_PRIVATE_KEY", value : var.firebase.private_key },
        { name : "AWS_REGION", value : var.region },
        { name : "AWS_BUCKET_NAME", value : aws_s3_bucket.main.bucket },
        { name : "AWS_LAMBDA_FUNCTION_NAME", value : aws_lambda_function.pdf-generator.function_name },
        { name : "CORS_ORIGIN", value : var.cors_origin }
      ]
      logConfiguration = {
        logDriver : "awslogs",
        options : {
          awslogs-region : var.region,
          awslogs-stream-prefix : "app",
          awslogs-group : aws_cloudwatch_log_group.app.name
        }
      },
    },
    {
      name      = "nginx"
      image     = aws_ecr_repository.nginx.repository_url
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      logConfiguration = {
        logDriver : "awslogs",
        options : {
          awslogs-region : var.region,
          awslogs-stream-prefix : "nginx",
          awslogs-group : aws_cloudwatch_log_group.nginx.name
        }
      }
    }
  ])

  depends_on = [aws_ecr_repository.app, aws_ecr_repository.nginx, aws_cloudwatch_log_group.app, aws_cloudwatch_log_group.nginx]

  tags = {
    Project = var.project
  }
}

resource "aws_iam_role" "ecs" {
  name = "${var.project}-role-ecs"

  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Sid : "",
        Effect : "Allow",
        Principal : {
          Service : "ecs-tasks.amazonaws.com"
        },
        Action : "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = var.project
  }
}

resource "aws_iam_role_policy_attachment" "ecs-read-write-s3" {
  role       = aws_iam_role.ecs.name
  policy_arn = aws_iam_policy.read-write-s3.arn
}

data "aws_iam_role" "ecsTaskExecutionRole" {
  name = "ecsTaskExecutionRole"
}

resource "aws_security_group" "ecs" {
  description = "This is a security group for ecs."
  name        = "${var.project}-sg-ecs"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = [var.public_cidr.ipv4] #tfsec:ignore:AWS009
    ipv6_cidr_blocks = [var.public_cidr.ipv6] #tfsec:ignore:AWS009
  }

  tags = {
    Project = var.project
  }
}

resource "aws_security_group_rule" "ecs_http" {
  description              = "This allows http ALB."
  security_group_id        = aws_security_group.ecs.id
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.public_alb.id
}
