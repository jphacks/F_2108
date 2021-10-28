resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name    = "${var.project}-vpc"
    Project = var.project
  }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr.public_a
  availability_zone       = var.az.az_a
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project}-subnet-public-a"
    Project = var.project
  }
}

resource "aws_subnet" "public_c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr.public_c
  availability_zone       = var.az.az_c
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project}-subnet-public-c"
    Project = var.project
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.subnet_cidr.private_a
  availability_zone = var.az.az_a

  tags = {
    Name    = "${var.project}-subnet-private-a"
    project = var.project
  }
}

resource "aws_subnet" "private_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.subnet_cidr.private_c
  availability_zone = var.az.az_c

  tags = {
    Name    = "${var.project}-subnet-private-c"
    project = var.project
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "${var.project}-igw"
    Project = var.project
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = var.public_cidr.ipv4
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name    = "${var.project}-route-table-public"
    Project = var.project
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_c" {
  subnet_id      = aws_subnet.public_c.id
  route_table_id = aws_route_table.public.id
}
