import {
  getDatabase,
  ref as dbRef,
  set,
  get,
  update,
  remove,
} from "firebase/database";
//import { useCurrentUser } from "vuefire";
//import { computed } from "vue";

class UserService {
  constructor() {
    //this.store = store;
    //this.authenticated = computed(() => this.store.isAuthenticated);
    this.db = getDatabase();
    this.usersRef = dbRef(this.db, "appUsers/");
    //this.user = user;
    //this.user = { id: "1234" };
  }

  // watch(this.authenticated.value, () => {
  //   // Code to be executed when the value of 'authenticated' changes
  //   this.initializeUser();
  // });

  // initializeUser() {
  //   this.user = useCurrentUser();
  // }

  buildNewUserData(uid, email, displayName, phone, emailVerified) {
    return {
      userId: uid,
      email: email,
      userName: displayName,
      phone: phone,
      registered: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLoginAt: Date.now(),
      emailVerified,
      //token: user.refreshToken,
      //tokenExpiration: user.refreshToken,
      //autoLogout: false,
    };
  }

  buildUserData(
    uid,
    email,
    displayName,
    phone,
    registered,
    createdAt,
    updatedAt,
    lastLoginAt,
    emailVerified
  ) {
    return {
      userId: uid,
      email,
      userName: displayName,
      phone: phone,
      registered,
      createdAt,
      updatedAt,
      lastLoginAt,
      emailVerified,
      //token: user.refreshToken,
      //tokenExpiration: user.refreshToken,
      //autoLogout: false,
    };
  }

  // Create a new user
  async createUser(userId, userData) {
    await set(dbRef(this.db, `appUsers/${userId}`), userData);
  }

  // Read a user's data
  async getUser(userId) {
    //dbRef(db, 'users', user.value.id, 'contacts')
    const snapshot = await get(dbRef(this.db, `appUsers/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No user data available");
    }
  }

  // Update a user's data
  async updateUser(userId, userData) {
    userData.updatedAt = Date.now();
    await update(dbRef(this.db, `appUsers/${userId}`), userData);
  }

  // Delete a user
  async deleteUser(userId) {
    await remove(dbRef(this.db, `appUsers/${userId}`));
  }
}

export default UserService;
