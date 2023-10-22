<!-- JobPortal.svelte -->
<script>
    import {fetch_jobs,applyJob,applied_jobs} from '../../services/job_service'
    import { onMount } from 'svelte';
    import {isLoggedIn} from '../../services/authentication'
    import { error_toast, success_toast } from '../../services/toast_theme';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
    import { goto } from "$app/navigation";
    import Navbar from '../components/navbar.svelte';
    import {current_user} from '../../stores/user_detail'
    let jobs = [];
    let currentPage = 1;
    let jobsPerPage = 10; // Number of jobs to display per page
    let selectedJob;
    let email;
    let name;
    let selectedFile;
    let is_apply=false
    let base64String
    let formData
    let applied_job_id=[]
    let already_applied=false
    // Function to fetch job data
    async function fetchJobs() {
      const response = await fetch_jobs(currentPage,jobsPerPage);
      console.log(response)
      if (response.status=='green') {
        jobs = response.data
      }
    }


    async function applied_user_jobs(){
        const response = await applied_jobs($current_user);
        console.log(response)
        if (response.data){
            applied_job_id = response.data.map((e)=>{return e.job_id})
            console.log(applied_job_id)
        }

    }

    function reset_val(){
        name='',
        email='',
        selectedFile=''
        is_apply=false
    }

    function nextPage() {
        currentPage++;
        fetchJobs();
        }

    function prevPage() {
    currentPage--;
    fetchJobs();
    }
    function handle_upload(event){
        selectedFile = event.target.files[0];

    }


    const applyForJob=async()=>{
        console.log(selectedJob.job_id)
        if (!email || email.trim()==''){
            error_toast('Email is mandatory')
            return
        }
        if (!name || name.trim()==''){
            error_toast('Name is mandatory')
            return
        }

        if (!selectedFile){
            error_toast('Resume is mandatory ')
            return
        }






        let payload={
            'name':name,
            'email':email,
            'user_id':$current_user,
            'job_id':selectedJob.job_id,
            'filename':selectedFile.name

        }
        formData = new FormData();
        formData.append('file',selectedFile)
        formData.append('other_params',JSON.stringify(payload))

        console.log(formData)
        let response = await applyJob(formData);
        console.log(response)
        if (response.status=='green'){
            success_toast('Job applied successfully')
            reset_val()
            applied_user_jobs()
            already_applied=true
            // handle_selected_job(selectedJob)
        }
        else{
            error_toast(response)
        }

    }




    onMount(()=>{
        if (!isLoggedIn()) {
            // Redirect to the login page
            goto('login');
        }
        console.log($current_user)
        applied_user_jobs()
        fetchJobs()


    });


    function handle_selected_job(job){
        selectedJob = job
        is_apply=false
        if(applied_job_id.includes(job.job_id)){
            already_applied=true
        }
        else{
            already_applied=false
        }
    }
    function splitSkills(skills) {
        return skills.split(',').map(skill => skill.trim());
    } // Fetch data when the component is mounted
  </script>

<main class="min-h-screen flex flex-col items-center justify-center">
    <Navbar/>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">

      <h1 class="text-2xl mb-4">Job Portal</h1>
      <div class="details-container">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="border-b">
                <th class="p-2 font-semibold">Job ID</th>
                <th class="p-2 font-semibold">Job Description</th>
                <th class="p-2 font-semibold">Job Location</th>
              </tr>
            </thead>
            <tbody>
              {#each jobs as job}
                <tr
                  class="border-b cursor-pointer {selectedJob && selectedJob.job_id == job.job_id?'selected-job':''}"
                  on:click={() => {handle_selected_job(job)}}
                >
                  <td class="p-2">{job.job_id}</td>
                  <td class="p-2">{job.job_description}</td>
                  <td class="p-2">{job.job_location}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          <div class="mt-4 flex justify-between">
            <button on:click={prevPage} disabled={currentPage === 1} class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Previous</button>
            <span class="text-blue-500">Page {currentPage}</span>
            <button on:click={nextPage} disabled={jobs.length < jobsPerPage} class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Next</button>
          </div>
        </div>

        {#if selectedJob}
        <div class="w-1/2 px-4 selected-job-container job-details">
          <h2 class="text-2xl mb-4">Job Details</h2>
          <ul>
            <li><strong>Job ID:</strong> {selectedJob.job_id}</li>
            <li><strong>Job Description:</strong> {selectedJob.job_description}</li>
            <li><strong>Job Location:</strong> {selectedJob.job_location}</li>
            <li><strong>Skills Required:</strong>
              <ul>
                {#each splitSkills(selectedJob.skills) as skill (skill)}
                  <li class="skill-tag">{skill}</li>
                {/each}
              </ul>
            </li>
          </ul>

          {#if already_applied}


          <div class="applied-message">
            Application Submitted
          </div>



        {:else}
          {#if !is_apply}
          <button class="apply-button" on:click={()=>is_apply=true} >Apply</button>
          {:else}
          <div class="separator"></div>
          <h2 class="text-2xl mt-4 mb-2">Apply for this job</h2>
            <form>
            <label for="email">Email:</label>
            <input type="email" id="email" bind:value={email} class="w-full p-2 mb-2" required>

            <label for="name">Name:</label>
            <input type="text" id="name" bind:value={name} class="w-full p-2 mb-2" required>

            <label for="resume">Upload Resume (PDF):</label>
            <input type="file" id="resume" on:change={handle_upload} accept=".pdf" class="w-full p-2 mb-2" required>

            <button type="button" on:click={applyForJob} class="apply-button w-full mt-2">Submit Application</button>
            </form>
            {/if}
            {/if}
        </div>

      {/if}
      </div>
    </div>


  </main>
  <SvelteToast/>