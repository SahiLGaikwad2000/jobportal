<!-- JobPortal.svelte -->
<script>
    import {fetch_jobs} from '../../services/job_service'
    import { onMount } from 'svelte';
    let jobs = [];
    let currentPage = 1;
    let jobsPerPage = 10; // Number of jobs to display per page
    let selectedJob;
    let email;
    let name;
    let selectedFile;
    let is_apply=false
    // Function to fetch job data
    async function fetchJobs() {
      const response = await fetch_jobs(currentPage,jobsPerPage);
      console.log(response)
      if (response.status=='green') {
        jobs = response.data
      }
    }

    function nextPage() {
        currentPage++;
        fetchJobs();
        }

    function prevPage() {
    currentPage--;
    fetchJobs();
    }


    const applyForJob=()=>{
        console.log(selectedFile)
    }


    onMount(fetchJobs);
    function splitSkills(skills) {
        return skills.split(',').map(skill => skill.trim());
    } // Fetch data when the component is mounted
  </script>

<main class="min-h-screen flex items-center justify-center">
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
                  on:click={() => {selectedJob = job,is_apply=false}}
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
            <input type="file" id="resume" on:change={e => selectedFile = e.target.files[0]} accept=".pdf" class="w-full p-2 mb-2" required>

            <button type="button" on:click={applyForJob} class="apply-button w-full mt-2">Submit Application</button>
            </form>
            {/if}
        </div>

      {/if}
      </div>
    </div>


  </main>
