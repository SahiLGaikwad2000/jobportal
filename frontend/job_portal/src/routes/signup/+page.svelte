<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  import { error_toast, success_toast } from '../../services/toast_theme';
    let username = "";
    let email = "";
    let password = "";

    async function signup() {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Handle successful signup
        const data = await response.json();
        console.log(data);
      } else {
        const errorData = await response.json();
        let error = errorData.error;
        error_toast(error)
        // Handle signup error
      }
    }
  </script>

  <main class="min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 class="text-2xl mb-4">Sign up</h2>
      <input type="text" placeholder="Username" bind:value={username} class="mb-4" />
      <input type="email" placeholder="Email" bind:value={email} class="mb-4" />
      <input type="password" placeholder="Password" bind:value={password} class="mb-4" />
      <button on:click={signup} class="w-full bg-blue-500 text-white p-2 rounded">
        Sign up
      </button>
    </div>
  </main>
<SvelteToast/>