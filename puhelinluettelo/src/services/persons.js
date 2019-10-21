import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  console.log("haetaan kaikki")
  return axios.get(baseUrl)
}
const create = newObject => {
  return axios.post(baseUrl, newObject)
}
const del = (url) =>{
 return axios.delete(url)
}
const update = (url, updated) => {
return axios.put(url, updated)

}
export default { 
  getAll: getAll,
  create: create,
  del: del,
  update: update
}