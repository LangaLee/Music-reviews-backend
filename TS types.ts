export type userData = Array<{
  username: string;
  password: string;
  profile_pic_url: string;
  user_id: number;
}>;

export type topicData = Array<{
  topic_name: string;
  description: string;
  topic_id: number;
}>;

export type articleData = Array<{
  title: string;
  body: string;
  author: string;
  topic: string;
  article_image_url: string;
  topic_id: number;
  likes: number;
  dislikes: number;
  author_id: number;
}>;

export type commentData = Array<{
  author: string;
  body: string;
  article_id: number;
  author_id: number;
}>;
