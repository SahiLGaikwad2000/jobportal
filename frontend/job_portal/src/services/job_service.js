
let global_url = 'http://localhost:3000/api/'

const fetch_jobs = async(search_term,currentPage,jobsPerPage)=>{
    const response = await fetch(
        global_url+`jobs?search_term=${search_term}&page=${currentPage}&perPage=${jobsPerPage}`

        ).then(
        async(response)=>{
            return await response.json()
            }
        );
        return response
}

const applyJob = async(data)=>{
    const response = await fetch(
        global_url+'applyJob',{
            method: "POST",
            body: data,
        }

        ).then(
        async(response)=>{
            return await response.json()
            }
        );
        return response
}

const applied_jobs = async(user_id)=>{
    const response = await fetch(
        global_url+`applied_jobs?user_id=${user_id}`

        ).then(
        async(response)=>{
            return await response.json()
            }
        );
        return response
}

const get_user_email = async(user_id)=>{
    const response = await fetch(
        global_url+`user?user_id=${user_id}`

        ).then(
        async(response)=>{
            return await response.json()
            }
        );
        return response
}


export{
    fetch_jobs,
    applyJob,
    applied_jobs,
    get_user_email
}

