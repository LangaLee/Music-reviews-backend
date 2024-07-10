/*
  Warnings:

  - Added the required column `dislikes` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "dislikes" INTEGER NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "password" VARCHAR(500) NOT NULL;
