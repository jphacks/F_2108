import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1635484579287 implements MigrationInterface {
    name = 'Init1635484579287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`icon_url\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`posted_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedById\` varchar(255) NOT NULL, \`authorId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stamp\` (\`id\` int NOT NULL AUTO_INCREMENT, \`position_page\` int NOT NULL, \`position_x\` double NOT NULL, \`position_y\` double NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` varchar(255) NOT NULL, \`fileId\` char(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`data_type\` enum ('audio', 'text') NOT NULL, \`content\` varchar(255) NOT NULL, \`title\` varchar(255) NULL, \`posted_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` varchar(255) NOT NULL, \`stampId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`file_shared_to_user\` (\`fileId\` char(36) NOT NULL, \`userId\` varchar(255) NOT NULL, INDEX \`IDX_e4591775c7d11864a87f2db28f\` (\`fileId\`), INDEX \`IDX_a464e614a1da8d6d870852be77\` (\`userId\`), PRIMARY KEY (\`fileId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e1b1af341c80fafd98f699c50b6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_df950727221b7c53576e03800d8\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_48e4a5e142bbe22409882ce7bad\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stamp\` ADD CONSTRAINT \`FK_0e92039cca3deb791ccf3152706\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_30a167c644a872221b64a977410\` FOREIGN KEY (\`stampId\`) REFERENCES \`stamp\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file_shared_to_user\` ADD CONSTRAINT \`FK_e4591775c7d11864a87f2db28f5\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`file_shared_to_user\` ADD CONSTRAINT \`FK_a464e614a1da8d6d870852be775\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_shared_to_user\` DROP FOREIGN KEY \`FK_a464e614a1da8d6d870852be775\``);
        await queryRunner.query(`ALTER TABLE \`file_shared_to_user\` DROP FOREIGN KEY \`FK_e4591775c7d11864a87f2db28f5\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_30a167c644a872221b64a977410\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_0e92039cca3deb791ccf3152706\``);
        await queryRunner.query(`ALTER TABLE \`stamp\` DROP FOREIGN KEY \`FK_48e4a5e142bbe22409882ce7bad\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_df950727221b7c53576e03800d8\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e1b1af341c80fafd98f699c50b6\``);
        await queryRunner.query(`DROP INDEX \`IDX_a464e614a1da8d6d870852be77\` ON \`file_shared_to_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e4591775c7d11864a87f2db28f\` ON \`file_shared_to_user\``);
        await queryRunner.query(`DROP TABLE \`file_shared_to_user\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`stamp\``);
        await queryRunner.query(`DROP TABLE \`file\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
