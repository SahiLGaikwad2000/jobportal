<script>
    // You can pass props or customize the spinner further if needed
  </script>

  <style>
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }

    .lds-ring {
      display: inline-block;
      position: relative;
      width: 80px; /* Increase the size of the spinner for better visibility */
      height: 80px;
    }

    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px; /* Adjust the size of the circular segments */
      height: 64px; /* Adjust the size of the circular segments */
      margin: 8px; /* Increase the margin to separate the segments */
      border: 8px solid transparent;
      border-top-color: #3498db; /* Adjust the color as needed */
      border-radius: 50%;
      animation: lds-ring 0.6s linear infinite;
    }

    @keyframes lds-ring {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>

  <div class="spinner-container">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
