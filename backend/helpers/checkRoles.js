import fs from 'fs'
const roles = JSON.parse(fs.readFileSync(new URL('../lib/roles.json', import.meta.url)))

const checkRoles = (user, action) => {
    const rolInfo = roles[user.roles]
    if (!rolInfo) return false
    if (rolInfo.total === true) {
        return true
    } else if (rolInfo.roles.includes(action)){
        return true
    } else {
        return false
    }
}

export default checkRoles