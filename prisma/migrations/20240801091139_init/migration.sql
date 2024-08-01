/*
  Warnings:

  - The primary key for the `Articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aritcle_id` on the `Articles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_article_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLikes" DROP CONSTRAINT "UserLikes_article_id_fkey";

-- AlterTable
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_pkey",
DROP COLUMN "aritcle_id",
ADD COLUMN     "article_id" SERIAL NOT NULL,
ADD CONSTRAINT "Articles_pkey" PRIMARY KEY ("article_id");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("article_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("article_id") ON DELETE RESTRICT ON UPDATE CASCADE;
