<script>
    import { goto } from '$app/navigation';
  import {login,login_token} from '../../services/authentication'
  import { v4 as uuidv4 } from 'uuid';
    import { error_toast, success_toast } from '../../services/toast_theme';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
    import {show_logout_store} from '../../stores/user_detail'
    import Spinner from '../components/spinner.svelte';
  let email = "";
  let password = "";
  let error = null;
  let show_spinner=false
  let valid_email=true
  let valid_pass=true


  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



  function validateForm() {
    // Validate email
    valid_email=true
    valid_pass=true
  
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let emailValid = email.match(emailRegex);
    if (!emailValid) {
      error = "Email is invalid"
      valid_email=false
      // error_toast("Email is invalid")
      return false

    }

    if (!password) {
      error = "Password is required"
      valid_pass=false
      // error_toast("Password is required")
      return false
    }

    return true;
    }






  async function login_handler() {
    if (validateForm()) {
    const userData = {
      email,
      password,
    };

    try {
      show_spinner=true
      let response = await login(JSON.stringify(userData))
      console.log(response)
      show_spinner=false
      if (response.status=='green') {
        login_token(uuidv4(),response.data);
        $show_logout_store.show=true
        success_toast('Login Successful',1000)

        goto('jobportal')


      } else {
        error_toast(response.error)

      }
    } catch (error) {
      console.error('An error occurred:', error);
      error = 'An unexpected error occurred';
    }
    }
  }
</script>
{#if show_spinner}
<Spinner />
{/if}
<main class="min-h-screen flex items-center justify-center">
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  max-w-2xl w-full mx-auto">
    <h2 class="text-2xl mb-4 text-center">Login</h2>
    <div class="mb-4">
      <input type="text" placeholder="Email" bind:value={email} class=" w-full p-2" />
      {#if !valid_email}
      <div class="text-sm p-2 text-red-500">{error}</div>
      {/if}
    </div>
    <div class="mb-4">
      <input type="password" placeholder="Password" bind:value={password} class="w-full p-2" />
      {#if !valid_pass}
      <div class="text-sm p-2 text-red-500">{error}</div>
      {/if}
    </div>
    <button on:click={login_handler} class="w-full bg-blue-500 text-white p-2 rounded">
      Login
    </button>
    <p class="mt-4 text-center">
      New here? <a href="/" class="text-blue-500">Signup</a>
    </p>
  </div>
</main>

<SvelteToast/>