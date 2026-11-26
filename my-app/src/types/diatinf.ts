export type User = {
  id: string;
  username: string;
  name: string;
  bio: string;
  badge?: string;
  createdAt: string;
};

export type CommentItem = {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  authorId: string;
};

export type PostItem = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  likes: string[]; // userIds
};

export type RatingItem = {
  postId: string;
  userId: string;
  value: 1 | 2 | 3;
};

export type RatingSummary = {
  average: number;
  count: number;
  myValue: number | null;
};

export type HydratedComment = CommentItem & {
  author: User;
  replies: HydratedComment[];
};

export type HydratedPost = PostItem & {
  author: User;
  commentCount: number;
  firstComment: {
    id: string;
    content: string;
    createdAt: string;
    author: User;
  } | null;
  rating: RatingSummary;
};

export type InteractionStat = {
  user: User;
  count: number;
};
