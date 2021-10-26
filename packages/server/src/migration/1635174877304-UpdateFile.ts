import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateFile1635174877304 implements MigrationInterface {
  name = "UpdateFile1635174877304"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`authorId\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`url\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`thumbnail\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`postedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updatedBy\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`id\` \`id\` int NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE \`file\` DROP PRIMARY KEY`)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``)
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``)
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    )
    await queryRunner.query(`ALTER TABLE \`file\` ADD PRIMARY KEY (\`id\`)`)
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    )
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedBy\``)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedAt\``)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`postedAt\``)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`thumbnail\``)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`url\``)
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`authorId\``)
  }
}
