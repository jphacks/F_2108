import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsAnonymousToUser1636791508938 implements MigrationInterface {
    name = 'AddIsAnonymousToUser1636791508938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`is_anonymous\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_anonymous\``);
    }

}
