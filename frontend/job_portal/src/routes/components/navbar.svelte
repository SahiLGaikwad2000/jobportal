<!-- NavBar.svelte -->
<script>
    import { get_user_id, isLoggedIn, logout } from '../../services/authentication';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import {show_logout_store} from '../../stores/user_detail'
    function handleLogout() {
      logout();
      $show_logout_store.show = false
      goto('/login');
    }
    let is_login=false
   
    onMount(()=>{

        if (isLoggedIn()) {
            is_login=true
            // Redirect to the login page

        }
        if(get_user_id()){
          $show_logout_store.show=true
        }


    });
  </script>

  <nav class="bg-white shadow-md p-4 w-full mb-2 fixed top-0 left-0 right-0 z-50">
    <div class="flex items-center justify-between">
      <div class="text-2xl font-bold text-blue-500">Job Feed</div>

        <div class="flex items-center">
          <!-- <div class="mr-2">Welcome</div> -->
          {#if $show_logout_store.show}
          <button
            on:click={handleLogout}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Logout
          </button>
          {/if}
        </div>


    </div>
  </nav>
