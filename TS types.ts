import express from "express";

export type userDataType = Array<userToInsert>;
export type topicDataType = Array<{ topic_name: string; description: string }>;
export type articleDataType = Array<article>;
export type commentDataType = Array<{
  author_id: number;
  body: string;
  article_id: number;
}>;
export type likesDataType = Array<{
  user_id: number;
  article_id: number;
  value: number;
}>;
export type article = {
  title: string;
  body: string;
  article_image_url: string;
  author_id: number;
  topic_id: number;
  likes: number;
  dislikes: number;
};
export type returnedUsers = {
  user_id: number;
  created_at: Date;
  profile_pic_url: string;
  username: string;
  password: string;
};

export type returnedTopics = {
  topic_id: number;
  topic_name: string;
  description: string;
};

export type returnedArticles = {
  article_id: number;
  created_at: Date;
  title: string;
  article_image_url: string;
  author: string;
  topic: string;
  likes: number;
  dislikes: number;
  commentCount: number;
};

export interface errorThrown extends express.Errback {
  msg: string;
  status: number;
}

export type returnedComments = {
  article_id: number;
  body: string;
  author: string;
  created_at: Date;
};
export type userToInsert = {
  username: string;
  password: string;
  profile_pic_url: string;
};

export type topicToInsert = {
  topic_name: string;
  description: string;
};
