/*
  Warnings:

  - A unique constraint covering the columns `[review_id]` on the table `UserLikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLikes_review_id_key" ON "UserLikes"("review_id");