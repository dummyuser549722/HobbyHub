import { v4 as uuidv4 } from 'uuid';
import supabase from '../supabaseClient';

export const getActiveUserId = async () => {
  const { data } = await supabase.auth.getUser();
  const authUser = data?.user;

  if (authUser?.id) {
    return authUser.id; // Supabase auth UID
  }

  let guestId = localStorage.getItem('userId');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('userId', guestId);
    console.log("🆕 Assigned guest ID:", guestId);
  }

  return guestId;
};
