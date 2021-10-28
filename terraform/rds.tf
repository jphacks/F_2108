resource "aws_db_instance" "main" {
  identifier             = "${var.project}-db-instance"
  engine                 = "mysql"
  engine_version         = "5.7"
  instance_class         = "db.t3.micro"
  name                   = var.db.name
  username               = var.db.user
  password               = var.db.password
  allocated_storage      = 20
  storage_type           = "gp2"
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = true

  tags = {
    Project = var.project
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnet-group"
  subnet_ids = [aws_subnet.public_a.id, aws_subnet.public_c.id]

  tags = {
    Project = var.project
  }
}

resource "aws_security_group" "db" {
  description = "For persistent DB. Several events, e.g. entering room, chats and reactions, are stored."
  vpc_id      = aws_vpc.main.id

  tags = {
    Project = var.project
  }
}

resource "aws_security_group_rule" "rds_public_access" {
  description       = "This allows access to postgres from public instance."
  security_group_id = aws_security_group.db.id
  type              = "ingress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  cidr_blocks       = [var.public_cidr.ipv4]
  ipv6_cidr_blocks  = [var.public_cidr.ipv6]
}

output "db_endpoint" {
  value = aws_db_instance.main.endpoint
}
