import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTableStamp1635211718839 implements MigrationInterface {
    name = 'AddTableStamp1635211718839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`stamp\` (\`stampId\` int NOT NULL AUTO_INCREMENT, \`authorId\` varchar(255) NOT NULL, \`position_page\` int NOT NULL, \`position_x\` double NOT NULL, \`position_y\` double NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`stampId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`stamp\``);
    }

}
