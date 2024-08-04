export type userDataType = Array<{
  username: string;
  password: string;
  profile_pic_url: string;
}>;

export type topicDataType = Array<{ topic_name: string; description: string }>;

export type articleDataType = Array<{
  title: string;
  body: string;
  article_image_url: string;
  author_id: number;
  topic_id: number; // what have I done to need topic and topic Id ??? reapeating data ??
  likes: number;
  dislikes: number;
}>;

export type commentDataType = Array<{
  author_id: number;
  body: string;
  article_id: number;
}>;

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
