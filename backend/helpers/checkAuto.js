import { ObjectId } from "mongodb"

const checkAutoProfile = (user, id) => {
    
    if (user.id == id) {
        return true
    } else {
        return false
    }
}

export default checkAutoProfile