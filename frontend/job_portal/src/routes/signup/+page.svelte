<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  import { error_toast, success_toast } from '../../services/toast_theme';
  import { goto } from "$app/navigation";
  import {signup} from '../../services/authentication'
    let username = "";
    let email = "";
    let password = "";




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
      let response = await signup(JSON.stringify({ username, email, password }))
        console.log(response)
      if (response.status=='green') {
        // Handle successful signup

        success_toast("Signed up successfully",2000)
        setTimeout(()=>{
          goto("login")
        },3000)

      } else {
        let error = response.error;
        error_toast(error,2000)
        reset_val()
        // Handle signup error
      }
    }
  </script>

  <main class="min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 class="text-2xl mb-4">Sign up</h2>
      <input type="text" placeholder="Username" bind:value={username} class="mb-4" required />
      <input type="email" placeholder="Email" bind:value={email} class="mb-4" required />
      <input type="password" placeholder="Password" bind:value={password}  required ="mb-4" />
      <button on:click={signup_handler} class="w-full bg-blue-500 text-white p-2 rounded">
        Sign up
      </button>
      <p class="mt-4 text-center">
        Already have an account? <a href="/login" class="text-blue-500">Log in</a>
      </p>
    </div>
  </main>
<SvelteToast/>