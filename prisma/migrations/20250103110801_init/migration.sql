/*
  Warnings:

  - You are about to drop the column `article_id` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `article_id` on the `UserLikes` table. All the data in the column will be lost.
  - You are about to drop the `Articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `review_id` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_id` to the `UserLikes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_article_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLikes" DROP CONSTRAINT "UserLikes_article_id_fkey";

-- DropIndex
DROP INDEX "UserLikes_article_id_key";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "article_id",
ADD COLUMN     "review_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserLikes" DROP COLUMN "article_id",
ADD COLUMN     "review_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Articles";

-- DropTable
DROP TABLE "Topics";

-- CreateTable
CREATE TABLE "Genres" (
    "genre_id" SERIAL NOT NULL,
    "genre_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "review_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "review_title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "review_image_url" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genres_genre_name_key" ON "Genres"("genre_name");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genres"("genre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Reviews"("review_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Reviews"("review_id") ON DELETE RESTRICT ON UPDATE CASCADE;
