// app/libraries/firebase.ts

// Mock auth interface to match Firebase Auth's interface
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Auth {
  currentUser: User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<{ user: User }>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: User }>;
  signInWithGoogle: () => Promise<{ user: User }>;
  signOut: () => Promise<void>;
}

// Mock auth implementation
class MockAuth implements Auth {
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Initialize with no user
    this.user = null;
  }

  get currentUser(): User | null {
    return this.user;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    // Initial callback
    callback(this.user);
    // Return cleanup function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful sign in
    this.user = {
      uid: `email_${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };

    this.notifyListeners();
    return { user: this.user };
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful sign up
    this.user = {
      uid: `email_${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };

    this.notifyListeners();
    return { user: this.user };
  }

  async signInWithGoogle(): Promise<{ user: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful Google sign in
    this.user = {
      uid: `google_${Date.now()}`,
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: '/images/placeholder-avatar.svg'
    };

    this.notifyListeners();
    return { user: this.user };
  }

  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.user = null;
    this.notifyListeners();
  }
}

// Export mock auth instance
export const auth = new MockAuth();
