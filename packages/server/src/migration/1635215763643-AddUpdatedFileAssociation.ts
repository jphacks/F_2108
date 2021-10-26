import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUpdatedFileAssociation1635215763643 implements MigrationInterface {
    name = 'AddUpdatedFileAssociation1635215763643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`updatedBy\` \`updatedById\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedById\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`updatedById\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e1b1af341c80fafd98f699c50b6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e1b1af341c80fafd98f699c50b6\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updatedById\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`updatedById\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`updatedById\` \`updatedBy\` varchar(255) NOT NULL`);
    }

}
