import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateGratitudesTable1603715435520 implements MigrationInterface {
    name = 'CreateGratitudesTable1603715435520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gratitudes" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "from" character varying(16), "to" character varying(16) NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_8bff544a9491742ff17b39b8580" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "gratitudes"`);
    }

}
