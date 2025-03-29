import { makeAutoObservable } from "mobx"
import { UserResponse } from "@/@app_types/user.dto"
import { useUserRoutes } from "@/api/userRoutes";	

class AuthStore {
  user: UserResponse = {username: '', id: ''}

  constructor() {
    makeAutoObservable(this)
  }
  
  getUserInfo() {
    const { getUserInfo } = useUserRoutes(() => {});
    getUserInfo().then((rs) => {
      if (rs) {
        this.user.id = rs.data.id
        this.user.username = rs.data.username
      }
    });
  }
}

export default new AuthStore()