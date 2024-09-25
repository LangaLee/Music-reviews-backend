/*
  Warnings:

  - A unique constraint covering the columns `[article_id]` on the table `UserLikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLikes_article_id_key" ON "UserLikes"("article_id");
