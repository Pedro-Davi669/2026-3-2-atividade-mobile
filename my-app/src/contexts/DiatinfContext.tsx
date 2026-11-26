import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  INITIAL_COMMENTS,
  INITIAL_POSTS,
  INITIAL_RATINGS,
  INITIAL_USERS,
} from '@/data/seed';
import type {
  CommentItem,
  HydratedComment,
  HydratedPost,
  InteractionStat,
  PostItem,
  RatingItem,
  User,
} from '@/types/diatinf';

const STORAGE_KEY = 'diatinf_x_mobile_state_v1';

type PersistedState = {
  users: User[];
  posts: PostItem[];
  comments: CommentItem[];
  ratings: RatingItem[];
  currentUserId: string | null;
};

type DiatinfContextValue = {
  ready: boolean;
  currentUser: User | null;
  users: User[];
  posts: HydratedPost[];
  login: (username: string, password: string) => { ok: boolean; error?: string };
  register: (input: { username: string; name: string; bio?: string }) => { ok: boolean; error?: string };
  logout: () => void;
  switchUser: (username: string) => void;
  createPost: (content: string) => HydratedPost | null;
  deletePost: (postId: string) => void;
  toggleLike: (postId: string) => void;
  ratePost: (postId: string, value: 1 | 2 | 3) => void;
  addComment: (postId: string, content: string, parentId?: string | null) => void;
  deleteComment: (commentId: string) => void;
  getPostById: (postId: string) => HydratedPost | undefined;
  getCommentsForPost: (postId: string) => HydratedComment[];
  getUserByUsername: (username: string) => User | undefined;
  getUserCounts: (userId: string) => { posts: number; comments: number };
  socialStats: {
    whoICommentMost: InteractionStat[];
    whoCommentsMeMost: InteractionStat[];
  };
};

const DiatinfContext = createContext<DiatinfContextValue | null>(null);

export function DiatinfProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [ratings, setRatings] = useState<RatingItem[]>(INITIAL_RATINGS);
  const [currentUserId, setCurrentUserId] = useState<string | null>('u-pedrodavi');

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (Array.isArray(parsed.users) && parsed.users.length > 0) setUsers(parsed.users);
        if (Array.isArray(parsed.posts)) setPosts(parsed.posts);
        if (Array.isArray(parsed.comments)) setComments(parsed.comments);
        if (Array.isArray(parsed.ratings)) setRatings(parsed.ratings);
        if (parsed.currentUserId !== undefined) setCurrentUserId(parsed.currentUserId);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const state: PersistedState = { users, posts, comments, ratings, currentUserId };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [ready, users, posts, comments, ratings, currentUserId]);

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const currentUser = useMemo(
    () => (currentUserId ? userMap.get(currentUserId) ?? null : null),
    [currentUserId, userMap]
  );

  const hydratePost = useCallback(
    (post: PostItem): HydratedPost => {
      const author = userMap.get(post.authorId) ?? users[0];
      const postComments = comments
        .filter((c) => c.postId === post.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const topComments = postComments.filter((c) => !c.parentId);
      const first = topComments[0] ?? postComments[0] ?? null;

      const postRatings = ratings.filter((r) => r.postId === post.id);
      const ratingCount = postRatings.length;
      const average =
        ratingCount > 0
          ? Number((postRatings.reduce((sum, r) => sum + r.value, 0) / ratingCount).toFixed(1))
          : 0;
      const myRating = currentUser
        ? postRatings.find((r) => r.userId === currentUser.id)?.value ?? null
        : null;

      return {
        ...post,
        author,
        commentCount: postComments.length,
        firstComment: first
          ? {
              id: first.id,
              content: first.content,
              createdAt: first.createdAt,
              author: userMap.get(first.authorId) ?? users[0],
            }
          : null,
        rating: {
          average,
          count: ratingCount,
          myValue: myRating,
        },
      };
    },
    [comments, currentUser, ratings, userMap, users]
  );

  const hydratedPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(hydratePost),
    [hydratePost, posts]
  );

  const login = useCallback(
    (username: string, password: string) => {
      const clean = username.trim().toLowerCase().replace(/^@/, '');
      if (!clean || !password.trim()) {
        return { ok: false, error: 'Informe usuário e senha.' };
      }
      const found = users.find((u) => u.username.toLowerCase() === clean);
      if (!found) {
        return { ok: false, error: 'Usuário não encontrado. Tente pedrodavi, joaosouza ou mariasilva.' };
      }
      if (password !== 'diatinf123' && password.length < 3) {
        return { ok: false, error: 'Senha inválida (dica: use diatinf123).' };
      }
      setCurrentUserId(found.id);
      return { ok: true };
    },
    [users]
  );

  const register = useCallback(
    ({ username, name, bio }: { username: string; name: string; bio?: string }) => {
      const clean = username.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      if (!clean || !name.trim()) {
        return { ok: false, error: 'Preencha nome completo e nome de usuário.' };
      }
      if (users.some((u) => u.username.toLowerCase() === clean)) {
        return { ok: false, error: 'Esse @usuário já existe.' };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        username: clean,
        name: name.trim(),
        bio: bio?.trim() || 'Estudante da DIATINF / CNAT-IFRN.',
        badge: 'Infoweb',
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUserId(newUser.id);
      return { ok: true };
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  const switchUser = useCallback(
    (username: string) => {
      const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (found) setCurrentUserId(found.id);
    },
    [users]
  );

  const createPost = useCallback(
    (content: string): HydratedPost | null => {
      const trimmed = content.trim();
      if (!trimmed || !currentUser) return null;
      const newPost: PostItem = {
        id: `p-${Date.now()}`,
        authorId: currentUser.id,
        content: trimmed,
        createdAt: new Date().toISOString(),
        likes: [],
      };
      setPosts((prev) => [newPost, ...prev]);
      return hydratePost(newPost);
    },
    [currentUser, hydratePost]
  );

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => prev.filter((c) => c.postId !== postId));
    setRatings((prev) => prev.filter((r) => r.postId !== postId));
  }, []);

  const toggleLike = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const has = p.likes.includes(currentUser.id);
          return {
            ...p,
            likes: has ? p.likes.filter((id) => id !== currentUser.id) : [...p.likes, currentUser.id],
          };
        })
      );
    },
    [currentUser]
  );

  const ratePost = useCallback(
    (postId: string, value: 1 | 2 | 3) => {
      if (!currentUser) return;
      setRatings((prev) => {
        const existing = prev.find((r) => r.postId === postId && r.userId === currentUser.id);
        if (existing) {
          return prev.map((r) =>
            r.postId === postId && r.userId === currentUser.id ? { ...r, value } : r
          );
        }
        return [...prev, { postId, userId: currentUser.id, value }];
      });
    },
    [currentUser]
  );

  const addComment = useCallback(
    (postId: string, content: string, parentId: string | null = null) => {
      const trimmed = content.trim();
      if (!trimmed || !currentUser) return;
      const next: CommentItem = {
        id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        postId,
        authorId: currentUser.id,
        parentId,
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, next]);
    },
    [currentUser]
  );

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => {
      const toRemove = new Set<string>([commentId]);
      let added = true;
      while (added) {
        added = false;
        for (const item of prev) {
          if (item.parentId && toRemove.has(item.parentId) && !toRemove.has(item.id)) {
            toRemove.add(item.id);
            added = true;
          }
        }
      }
      return prev.filter((c) => !toRemove.has(c.id));
    });
  }, []);

  const getPostById = useCallback(
    (postId: string) => hydratedPosts.find((p) => p.id === postId),
    [hydratedPosts]
  );

  const getCommentsForPost = useCallback(
    (postId: string): HydratedComment[] => {
      const list = comments
        .filter((c) => c.postId === postId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const nodes = new Map<string, HydratedComment>();
      for (const item of list) {
        nodes.set(item.id, {
          ...item,
          author: userMap.get(item.authorId) ?? users[0],
          replies: [],
        });
      }

      const roots: HydratedComment[] = [];
      for (const item of list) {
        const node = nodes.get(item.id)!;
        if (item.parentId && nodes.has(item.parentId)) {
          nodes.get(item.parentId)!.replies.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    },
    [comments, userMap, users]
  );

  const getUserByUsername = useCallback(
    (username: string) => users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
    [users]
  );

  const getUserCounts = useCallback(
    (userId: string) => ({
      posts: posts.filter((p) => p.authorId === userId).length,
      comments: comments.filter((c) => c.authorId === userId).length,
    }),
    [comments, posts]
  );

  const socialStats = useMemo(() => {
    const activeId = currentUser?.id ?? 'u-pedrodavi';
    const postAuthorById = new Map(posts.map((p) => [p.id, p.authorId]));

    const iCommentMap = new Map<string, number>();
    const commentsMeMap = new Map<string, number>();

    for (const u of users) {
      if (u.id !== activeId) {
        iCommentMap.set(u.id, 0);
        commentsMeMap.set(u.id, 0);
      }
    }

    for (const c of comments) {
      const targetAuthor = postAuthorById.get(c.postId);
      if (!targetAuthor || targetAuthor === c.authorId) continue;

      if (c.authorId === activeId) {
        iCommentMap.set(targetAuthor, (iCommentMap.get(targetAuthor) ?? 0) + 1);
      }
      if (targetAuthor === activeId) {
        commentsMeMap.set(c.authorId, (commentsMeMap.get(c.authorId) ?? 0) + 1);
      }
    }

    const toSortedList = (map: Map<string, number>): InteractionStat[] =>
      Array.from(map.entries())
        .map(([uid, count]) => ({ user: userMap.get(uid)!, count }))
        .filter((entry) => Boolean(entry.user))
        .sort((a, b) => b.count - a.count || a.user.name.localeCompare(b.user.name));

    return {
      whoICommentMost: toSortedList(iCommentMap),
      whoCommentsMeMost: toSortedList(commentsMeMap),
    };
  }, [comments, currentUser, posts, userMap, users]);

  const value = useMemo<DiatinfContextValue>(
    () => ({
      ready,
      currentUser,
      users,
      posts: hydratedPosts,
      login,
      register,
      logout,
      switchUser,
      createPost,
      deletePost,
      toggleLike,
      ratePost,
      addComment,
      deleteComment,
      getPostById,
      getCommentsForPost,
      getUserByUsername,
      getUserCounts,
      socialStats,
    }),
    [
      addComment,
      createPost,
      currentUser,
      deleteComment,
      deletePost,
      getCommentsForPost,
      getPostById,
      getUserByUsername,
      getUserCounts,
      hydratedPosts,
      login,
      logout,
      ratePost,
      ready,
      register,
      socialStats,
      switchUser,
      toggleLike,
      users,
    ]
  );

  return <DiatinfContext.Provider value={value}>{children}</DiatinfContext.Provider>;
}

export function useDiatinf() {
  const ctx = useContext(DiatinfContext);
  if (!ctx) {
    throw new Error('useDiatinf must be used inside DiatinfProvider');
  }
  return ctx;
}
