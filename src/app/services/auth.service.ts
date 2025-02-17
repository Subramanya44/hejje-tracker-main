/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { BehaviorSubject, Observable } from 'rxjs'
import { Profile } from "../models/profile"
import { SupabaseService } from './supabase.service'


// @ts-nocheck
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient
  private currentUser: BehaviorSubject<User | boolean | null> = new BehaviorSubject<User | boolean | null>(null)
  private currentUserProfile: BehaviorSubject<Profile | boolean | null> = new BehaviorSubject<Profile | boolean | null>(null)

  constructor(private router: Router,private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient()

    this.supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {

        if (sess != null && "user" in sess) {
          this.currentUser.next(sess.user)
        }
      } else {
        this.currentUserProfile.next(false)
        localStorage.removeItem('profile')
        localStorage.removeItem('profile_role')
        this.currentUser.next(false)
      }
    })

    // Trigger initial session load
    this.loadUser()
  }


  async loadUser() {
    if (this.currentUser.value) {
      // User is already set, no need to do anything else
      return
    }
    const user = await this.supabase.auth.getUser()

    if (user.data.user) {
      this.currentUser.next(user.data.user)
      this.getProfile()
    } else {
      this.currentUser.next(false)
    }
  }

  async getProfile(): Promise<Observable<boolean | Profile | null>> {
    const profile_data = localStorage.getItem('profile')

    if (profile_data != null) {
      const profile = JSON.parse(profile_data)
      this.currentUserProfile.next(profile);
      return this.currentUserProfile.asObservable()
    } else {

      if (this.currentUserProfile.value) {
        return this.currentUserProfile.asObservable()
      }

      if (this.getCurrentUserId() == null) {
        return this.currentUserProfile.asObservable()
      }

      await this.supabase.from('tbl_profiles').select('*').eq('id', this.getCurrentUserId()).then(async (response) => {
        if (response.error) {
          this.currentUserProfile.next(false)
        } else {
          if (undefined !== response.data[0]) {
            const profile = new Profile(response.data[0].id, response.data[0].updated_at, response.data[0].username, response.data[0].full_name, response.data[0].avatar_url, response.data[0].role, response.data[0].mobile, response.data[0].points)
            localStorage.setItem('profile_role', profile.role)
            localStorage.setItem('profile', JSON.stringify(profile));
            this.currentUserProfile.next(profile)
          }
        }
      });
      return this.currentUserProfile.asObservable()
    }

  }

  // check if local storage have profile_role then its ok else call getProfile
  async getCurrentProfileOnLocalStorage(): Promise<Observable<boolean | Profile | null>> {

    const role = localStorage.getItem('profile_role');
    if (role != null) {
      return this.currentUserProfile.asObservable();
    } else {
      await this.getProfile()

      return this.currentUserProfile.asObservable();
    }
  }

  signUp(credentials: { email: string; password: string, options: any }) {
    //@ts-ignore
    // credentials = {...credentials, options: {data: metadata}}
    return this.supabase.auth.signUp(credentials)
  }

  inviteUser(email: string) {
    this.supabase.auth.admin.inviteUserByEmail(email)
  }

  signIn(credentials: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword(credentials)
  }



  updateUser(password: string) {
    return this.supabase.auth.updateUser({
      password: password
    })
  }

  sendPwReset(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://aaneelli.imaxine.in/auth/reset-password' })
  }

  async signOut() {
    await this.supabase.auth.signOut()
    localStorage.removeItem('profile_role');
    localStorage.removeItem('profile');
    this.currentUserProfile.next(false);
    this.currentUser.next(false);
    this.router.navigateByUrl('/', { replaceUrl: true })
  }

  getCurrentUser(): Observable<User | boolean | null> {
    this.getProfile()
    return this.currentUser.asObservable()
  }

  getCurrentProfile(): Observable<Profile | boolean | null> {
    return this.currentUserProfile.asObservable()
  }

  getCurrentUserId(): string | null {
    return this.currentUser.value ? (this.currentUser.value as User).id : null;
  }

  // get all users
  async fetchAllUsers(): Promise<any> {
    try {
      // Fetch data from tbl_users table
      const { data: tbl_users, error } = await this.supabase
        .from('tbl_users')
        .select('*')
        .order('created_at', { ascending: false });
      // Check for errors
      if (error) {
        throw error;
      }

      // Return fetched data
      return tbl_users;
    } catch (error: any) {
      console.error('Error fetching tracks:', error.message);
      throw error;
    }
  }

  async updateUserStatus(userId: number, newStatus: string): Promise<any> {
    try {
      const { data: updatedData, error } = await this.supabase
        .from('tbl_users')
        .update({ status: newStatus })
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return updatedData;
    } catch (error: any) {
      console.error('Error updating User status:', error.message);
      throw error;
    }
  }

  get user() {
    // @ts-ignore
    return this.supabase.auth.getUser().then(({ data }) => data?.user)
  }

  get profile() {
    return this.user
      .then((user) => user?.id)
      .then((id) =>
        this.supabase.from('tbl_profiles').select('*').eq('id', id).single()
      ).then(({ data }) => data)
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    // @ts-ignore
    return this.supabase.auth.onAuthStateChange(callback)
  }


}
