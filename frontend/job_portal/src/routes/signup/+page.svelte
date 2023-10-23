<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  import { error_toast, success_toast } from '../../services/toast_theme';
  import { goto } from "$app/navigation";
  import {signup} from '../../services/authentication'
  import Spinner from '../components/spinner.svelte';
    let username = "";
    let email = "";
    let password = "";
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let error
    let show_spinner=false
    let valid_username=true
    let valid_email = true
    let valid_pass=true


    const reset_val=()=>{
      username = "";
      email = "";
      password = "";
    }


    function validateForm() {

    valid_username=true
    valid_email = true
    valid_pass=true
    // Validate username
    let usernameValid = username.trim() !== "";
    if (!usernameValid) {
      valid_username=false
      error='Username is required'
      // error_toast('Username is required')
      return false

    }

    // Validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let emailValid = email.match(emailRegex);
    if (!emailValid) {
      valid_email=false
      error="Email is invalid"
      // error_toast("Email is invalid")
      return false

    }

    // Validate password
    let passwordValid = strongPasswordRegex.test(password);
    if (!passwordValid) {
      valid_pass=false
      error='Password must be strong: at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character.'
      // error_toast("Password must be strong: at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character.")
      return false
    }

    return true;
  }








    async function signup_handler() {
      if (validateForm()) {
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
        show_spinner=false
        // Handle signup error
      }
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
      {#if !valid_username}
      <div class="text-sm p-2 text-red-500">{error}</div>
      {/if}
    </div>
    <div class="mb-4">
      <input type="email" placeholder="Email" bind:value={email} class="w-full p-2" required />
      {#if !valid_email}
      <div class="text-sm p-2 text-red-500">{error}</div>
      {/if}
    </div>
    <div class="mb-4">
      <input type="password" placeholder="Password" bind:value={password} class="w-full p-2" required />
      {#if !valid_pass}
      <div class="text-sm p-2 text-red-500">{error}</div>
      {/if}
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