import axios from "axios"
import BaseService from "./BaseService"

export interface PagePublisherUserInterface {
  id?: string
  page_publisher_id?: string
  user_id?: string
  privileges?: string
  deleted_at?: string
  created_at?: string
  updated_at?: string
}

export interface PagePublisherUserServiceInterface extends PagePublisherUserInterface {

}

const PagePublisherUserService = {
  
}

export default PagePublisherUserService;