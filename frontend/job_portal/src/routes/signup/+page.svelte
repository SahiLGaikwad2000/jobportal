<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  import { error_toast, success_toast } from '../../services/toast_theme';
  import { goto } from "$app/navigation";
  import {signup} from '../../services/authentication'
  import Spinner from '../components/spinner.svelte';
    let username = "";
    let email = "";
    let password = "";

    let show_spinner=false


    const reset_val=()=>{
      username = "";
      email = "";
      password = "";
    }
    async function signup_handler() {
      // const response = await fetch("http://localhost:3000/api/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ username, email, password }),
      // });
      show_spinner = true
      let response = await signup(JSON.stringify({ username, email, password }))
        console.log(response)

      if (response.status=='green') {
        // Handle successful signup

        success_toast("Signed up successfully",2000)
        setTimeout(()=>{
          show_spinner=false
          goto("login")
        },1000)

      } else {
        let error = response.error;
        error_toast(error,2000)
        reset_val()
        // Handle signup error
      }
    }
  </script>
  {#if show_spinner}
<Spinner />
{/if}
<main class="min-h-screen flex items-center justify-center">
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl w-full mx-auto">
    <h2 class="text-2xl mb-4 text-center" >Sign up</h2>
    <div class="mb-4">
      <input type="text" placeholder="Username" bind:value={username} class="w-full p-2" required />
    </div>
    <div class="mb-4">
      <input type="email" placeholder="Email" bind:value={email} class="w-full p-2" required />
    </div>
    <div class="mb-4">
      <input type="password" placeholder="Password" bind:value={password} class="w-full p-2" required />
    </div>
    <button on:click={signup_handler} class="w-full bg-blue-500 text-white p-2 rounded">
      Sign up
    </button>
    <p class="mt-4 text-center">
      Already have an account? <a href="/login" class="text-blue-500">Log in</a>
    </p>
  </div>
</main>


<SvelteToast/>