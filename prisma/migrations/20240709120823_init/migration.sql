/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_pic_url" VARCHAR(500) NOT NULL,
    "username" VARCHAR(100) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Topics" (
    "topic_id" SERIAL NOT NULL,
    "topic_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "aritcle_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "article_image_url" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("aritcle_id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "comment_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "article_id" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "UserLikes" (
    "like_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "UserLikes_pkey" PRIMARY KEY ("like_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topics_topic_name_key" ON "Topics"("topic_name");

-- CreateIndex
CREATE UNIQUE INDEX "Articles_author_id_key" ON "Articles"("author_id");

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topics"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("aritcle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("aritcle_id") ON DELETE RESTRICT ON UPDATE CASCADE;
