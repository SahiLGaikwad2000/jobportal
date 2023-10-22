
let global_url = 'http://localhost:3000/api/'

const fetch_jobs = async(currentPage,jobsPerPage)=>{
    const response = await fetch(
        global_url+`jobs?page=${currentPage}&perPage=${jobsPerPage}`

        ).then(
        async(response)=>{
            return await response.json()
            }
        );
        return response
}


export{
    fetch_jobs
}

