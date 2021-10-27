terraform {
  backend "s3" {
    bucket = "f-2108-terraform"
    key    = "dev/terraform.tfstate"
    region = "ap-northeast-1"
  }
}

provider "aws" {
  profile = var.project
  region  = "ap-northeast-1"
}
