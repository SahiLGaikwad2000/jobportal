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

  async function login_handler() {
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

        // Login was successful, navigate to the user dashboard or other page
        // You can use Svelte's router to navigate to a new page
        // For example, navigate to a dashboard page: $router.push('/dashboard');
      } else {
        error_toast(response.error)
        // Handle the login error
        // const errorData = await response.json();
        // error = errorData.error;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      error = 'An unexpected error occurred';
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
      <input type="text" placeholder="Email" bind:value={email} class="w-full p-2" />
    </div>
    <div class="mb-4">
      <input type="password" placeholder="Password" bind:value={password} class="w-full p-2" />
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