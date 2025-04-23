import supabase from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const getPosts = async () => {
  console.log("📦 getPosts() called");

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("🚨 Supabase fetch error:", error.message);
    throw error;
  }

  console.log("✅ Posts fetched:", data);
  return data;
};


export const getPostById = async (id) => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const addPost = async (post) => {
  const newPost = { ...post, id: uuidv4(), createdAt: new Date().toISOString() };
  const { data, error } = await supabase.from('posts').insert(newPost);
  if (error) throw error;
  return data;
};

export const updatePost = async (post) => {
  const { data, error } = await supabase.from('posts').update(post).eq('id', post.id);
  if (error) throw error;
  return data;
};

export const deletePost = async (id) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
};
