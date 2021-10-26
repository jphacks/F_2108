import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAssociations1635213046116 implements MigrationInterface {
    name = 'AddAssociations1635213046116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`fileId\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD \`fileFileId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`stampStampId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`authorId\` \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`stamp\` CHANGE \`authorId\` \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`authorId\` \`authorId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_df950727221b7c53576e03800d8\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_48e4a5e142bbe22409882ce7bad\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_1a779c2d9a22eb3bf82f410b11f\` FOREIGN KEY (\`fileFileId\`) REFERENCES \`file\`(\`fileId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_43042c041ad3d033fa8e10ce4a8\` FOREIGN KEY (\`stampStampId\`) REFERENCES \`stamp\`(\`stampId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_43042c041ad3d033fa8e10ce4a8\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_1a779c2d9a22eb3bf82f410b11f\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_48e4a5e142bbe22409882ce7bad\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_df950727221b7c53576e03800d8\``);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`authorId\` \`authorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`stamp\` CHANGE \`authorId\` \`authorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`authorId\` \`authorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`stampStampId\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP COLUMN \`fileFileId\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`fileId\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD PRIMARY KEY (\`id\`)`);
    }

}
