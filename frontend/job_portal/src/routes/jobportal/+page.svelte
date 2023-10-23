<!-- JobPortal.svelte -->
<script>
    import {fetch_jobs,applyJob,applied_jobs,get_user_email} from '../../services/job_service'
    import { onMount } from 'svelte';
    import {isLoggedIn,get_user_id} from '../../services/authentication'
    import { error_toast, success_toast } from '../../services/toast_theme';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
    import { goto } from "$app/navigation";

    import {show_logout_store} from '../../stores/user_detail'
    import Spinner from '../components/spinner.svelte';
    let jobs = [];
    let currentPage = 1;
    let jobsPerPage = 10;
    let totalJobs = 0; // Number of jobs to display per page
    let selectedJob;
    let email;
    let name;
    let selectedFile;
    let is_apply=false
    let base64String
    let formData
    let applied_job_id=[]
    let already_applied=false
    let show_spinner = false
    let maxSize = 5 * 1024 * 1024;
    let fileInput;
    // let searchTerm = '';
    // Function to fetch job data
    async function fetchJobs() {
      show_spinner=true
      const response = await fetch_jobs('',currentPage,jobsPerPage);

      if (response.status=='green') {
        jobs = response.data
        totalJobs = response.totalJobs;
      }
      show_spinner=false
    }


    async function get_email_by_id(){
      const response = await get_user_email(get_user_id())
      console.log(response)
      email = response.result.email
      console.log(email)
    }

    async function applied_user_jobs(){
      show_spinner=true
        const response = await applied_jobs(get_user_id());
        console.log(response)
        if (response.data){
            applied_job_id = response.data.map((e)=>{return e.job_id})
            console.log(applied_job_id)
        }
        show_spinner=false

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
        if (selectedFile.size > maxSize) {

          alert("File size exceeds 5MB. Please choose a smaller file.");

          e.target.value = null;
        }
    }


    const applyForJob=async()=>{
        console.log(selectedJob.job_id)
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!email || email.trim()=='' || !email.match(emailRegex)){
            error_toast('Email is invalid')
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
            'user_id':get_user_id(),
            'job_id':selectedJob.job_id,
            'filename':selectedFile.name

        }
        formData = new FormData();
        formData.append('file',selectedFile)
        formData.append('other_params',JSON.stringify(payload))

        console.log(formData)
        show_spinner=true
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
        show_spinner=false

    }




    onMount(()=>{
      show_spinner=true
        if (!isLoggedIn()) {
            // Redirect to the login page
            goto('login');
        }

        get_email_by_id()
        applied_user_jobs()
        fetchJobs()
        show_spinner=false


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
{#if show_spinner}
<Spinner />
{/if}

<div class="content">
<main class="flex flex-col items-center justify-center">

    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">

      <h1 class="text-2xl mb-4">Job Portal</h1>

      <div class="details-container">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="border-b">
                <th class="p-2 font-semibold">Job ID</th>
                <th class="p-2 font-semibold">Job Title</th>
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
                  <td class="p-2">{job.job_title}</td>
                  <td class="p-2">{job.job_location}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          <div class="mt-4 flex justify-between">
            <button on:click={prevPage} disabled={currentPage === 1} class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Previous</button>
            <span class="text-blue-500">Page {currentPage}</span>
            <button on:click={nextPage} disabled={currentPage * jobsPerPage >= totalJobs} class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Next</button>
          </div>
        </div>

        {#if selectedJob}
        <div class="w-1/2 px-4 selected-job-container job-details">
          <h2 class="text-2xl mb-4">Job Details</h2>
          <ul>
            <li><strong>Job ID:</strong> {selectedJob.job_id}</li>
            <li><strong>Job Title:</strong> {selectedJob.job_title}</li>
            <li><strong>Job Desciption:</strong> {selectedJob.job_description}</li>
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
            <input type="file" id="fileInput" bind:this={fileInput} on:change={handle_upload} accept=".pdf" class="w-full p-1 mb-1" required>
            {#if selectedFile}
            <button type="button" on:click={(e)=>{ fileInput.value = '';e.target.value=null,selectedFile=null}} class="text-red-500 p-1 mb-1">Remove File</button>
            {/if}
            <button type="button" on:click={applyForJob} class="apply-button w-full mt-2">Submit Application</button>
            </form>
            {/if}
            {/if}
        </div>





        {:else}





        <div class="w-1/2 px-4 selected-job-container job-details">
          <h2 class="text-2xl mb-4">Job Details</h2>







          <div class="info-message">
           Select a job to view details
          </div>

        </div>







      {/if}
      </div>
    </div>


  </main>
</div>
  <SvelteToast/>