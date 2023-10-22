import { json } from "@sveltejs/kit"

let global_url = 'http://localhost:3000/api/'

const signup = async(data)=>{
    const response = await fetch(global_url+"signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }).then(async(response)=>{
        return await response.json()
            }
      )
      return response

}



const login = async(data)=>{
    let response = await fetch(global_url+'login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
    }).then(async(response)=>{
        return await response.json()
            }
    )
    return response;
}

export{
    signup,
    login
}