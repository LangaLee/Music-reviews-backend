import express from "express";

export type userDataType = Array<userToInsert>;
export type genreDataType = Array<{ genre_name: string; description: string }>;
export type reviewDataType = Array<review>;
export type commentDataType = Array<{
  author_id: number;
  body: string;
  review_id: number;
}>;
export type likesDataType = Array<like>;
export type review = {
  review_title: string;
  body: string;
  review_image_url: string;
  author_id: number;
  genre_id: number;
  likes: number;
  dislikes: number;
};
export type like = {
  user_id: number;
  review_id: number;
  value: number;
};
export type returnedUsers = {
  user_id: number;
  created_at: Date;
  profile_pic_url: string;
  username: string;
};

export type returnedGenres = {
  genre_id: number;
  genre_name: string;
  description: string;
};

export type returnedReviews = {
  review_id: number;
  created_at: Date;
  review_title: string;
  review_image_url: string;
  author: string;
  genre: string;
  likes: number;
  dislikes: number;
  commentCount: number;
};

export interface errorThrown extends express.Errback {
  msg: string;
  status: number;
}

export type returnedComments = {
  review_id: number;
  comment_id: number;
  body: string;
  author: string;
  created_at: Date;
};
export type userToInsert = {
  username: string;
  password: string;
  profile_pic_url: string;
};

export type genreToInsert = {
  genre_name: string;
  description: string;
};
