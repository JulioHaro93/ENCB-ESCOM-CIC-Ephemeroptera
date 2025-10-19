import reactDom from 'react'
import axios from 'axios'

const token = localStorage('authtoken', token)
console.log(token)
const user = await axios.get('')