<!-- NavBar.svelte -->
<script>
    import { isLoggedIn, logout } from '../../services/authentication';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    function handleLogout() {
      logout();
      goto('/login');
    }
    let is_login=false
    onMount(()=>{
        if (isLoggedIn()) {
            is_login=true
            // Redirect to the login page

        }


    });
  </script>

  <nav class="bg-white shadow-md p-4 w-full mb-2">
    <div class="flex items-center justify-between">
      <div class="text-2xl font-bold text-blue-500">Job Feed</div>
      {#if is_login}
        <div class="flex items-center">
          <!-- <div class="mr-2">Welcome</div> -->
          <button
            on:click={handleLogout}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      {:else}
        <a href="/login" class="text-blue-500 hover:underline">Login</a>
        <a href="/signup" class="ml-4 text-blue-500 hover:underline">Signup</a>
      {/if}
    </div>
  </nav>
