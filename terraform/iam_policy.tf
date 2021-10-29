resource "aws_iam_policy" "deploy" {
  name = "${var.project}-deploy"

  policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Sid : "GetAuthorizationToken",
        Effect : "Allow",
        Action : [
          "ecr:GetAuthorizationToken"
        ],
        Resource : "*"
      },
      {
        Sid : "PushEcrRepository",
        Effect : "Allow",
        Action : [
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:ListImages",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ],
        Resource : aws_ecr_repository.app.arn
      },
      {
        "Sid" : "TaskDefinition",
        "Effect" : "Allow",
        "Action" : [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition"
        ],
        "Resource" : "*"
      },
      {
        "Sid" : "PassRolesInTaskDefinition",
        "Effect" : "Allow",
        "Action" : [
          "iam:PassRole"
        ],
        "Resource" : [
          data.aws_iam_role.ecsTaskExecutionRole.arn,
          aws_iam_role.ecs.arn
        ]
      },
      {
        "Sid" : "DeployService",
        "Effect" : "Allow",
        "Action" : [
          "ecs:UpdateService",
          "ecs:DescribeServices"
        ],
        "Resource" : [
          aws_ecs_service.main.id
        ]
      }
    ]
  })

  tags = {
    Project = var.project
  }
}
