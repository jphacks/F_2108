variable "project" {
  type = string
}

variable "my_global_ip" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "subnet_cidr" {
  type = map(string)

  default = {
    public_a  = "",
    public_c  = "",
    private_a = "",
    private_c = ""
  }
}

variable "db" {
  type = map(string)
  default = {
    user     = ""
    password = ""
    name     = ""
  }
}

variable "firebase" {
  type = map(string)
  default = {
    project_id   = ""
    client_email = ""
    private_key  = ""
  }
}

variable "public_cidr" {
  type = map(string)
  default = {
    ipv4 = "0.0.0.0/0"
    ipv6 = "::/0"
  }
}

variable "region" {
  type    = string
  default = "ap-northeast-1"
}

variable "az" {
  type = map(string)
  default = {
    az_a = "ap-northeast-1a"
    az_c = "ap-northeast-1c"
    az_d = "ap-northeast-1d"
  }
}

variable "ami" {
  type = map(string)

  default = {
    amazon-linux-2     = "ami-06098fd00463352b6"
    amazon-linux-2-ecs = "ami-0822fa1ed6836019b"
  }
}
