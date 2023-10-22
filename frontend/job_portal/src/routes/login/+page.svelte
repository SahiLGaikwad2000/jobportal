<script>
  import {login} from '../../services/authentication'
    import { error_toast, success_toast } from '../../services/toast_theme';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  let email = "";
  let password = "";
  let error = null;

  async function login_handler() {
    const userData = {
      email,
      password,
    };

    try {
      let response = await login(JSON.stringify(userData))
      console.log(response)

      if (response.status=='green') {
        success_toast('Login Successful')
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

<main class="min-h-screen flex items-center justify-center">
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h2 class="text-2xl mb-4">Login</h2>
    <input type="text" placeholder="Email" bind:value={email} class="mb-4" />
    <input type="password" placeholder="Password" bind:value={password} class="mb-4" />
    <button on:click={login_handler} class="w-full bg-blue-500 text-white p-2 rounded">
      Login
    </button>
    <p class="mt-4 text-center">
      New here? <a href="/" class="text-blue-500">Signup</a>
    </p>
  </div>
</main>
<SvelteToast/>