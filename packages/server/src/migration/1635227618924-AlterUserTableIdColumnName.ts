import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserTableIdColumnName1635227618924 implements MigrationInterface {
    name = 'AlterUserTableIdColumnName1635227618924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_df950727221b7c53576e03800d8\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e1b1af341c80fafd98f699c50b6\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_48e4a5e142bbe22409882ce7bad\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`id\` \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`stamp\` CHANGE \`authorId\` \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`authorId\` \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`authorId\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedById\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`updatedByUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userId\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP COLUMN \`authorUserId\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`authorUserId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_7eee896e4871f7de5b7adb16370\` FOREIGN KEY (\`updatedByUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_4f114e32f3561a3fca9ce71eff2\` FOREIGN KEY (\`authorUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_8a2bed90c38a46f48a2eca953b8\` FOREIGN KEY (\`authorUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_4281174f108641dbdbe8ec124c2\` FOREIGN KEY (\`authorUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_4281174f108641dbdbe8ec124c2\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_8a2bed90c38a46f48a2eca953b8\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_4f114e32f3561a3fca9ce71eff2\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_7eee896e4871f7de5b7adb16370\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`authorUserId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP COLUMN \`authorUserId\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD \`authorUserId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`authorUserId\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedByUserId\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`updatedById\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`authorUserId\` \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`stamp\` CHANGE \`authorUserId\` \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`userId\` \`id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_48e4a5e142bbe22409882ce7bad\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e1b1af341c80fafd98f699c50b6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_df950727221b7c53576e03800d8\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
