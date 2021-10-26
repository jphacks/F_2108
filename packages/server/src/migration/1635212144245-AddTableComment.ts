import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTableComment1635212144245 implements MigrationInterface {
    name = 'AddTableComment1635212144245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comment\` (\`commentId\` int NOT NULL AUTO_INCREMENT, \`authorId\` varchar(255) NOT NULL, \`dataType\` enum ('audio', 'text') NOT NULL, \`content\` varchar(255) NOT NULL, \`postedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`commentId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`comment\``);
    }

}
