import videosData from './videos.json';
import postsData from './posts.json';
import { Video, Post } from './types';

export const videos = videosData as Video[];
export const posts = postsData as Post[];
