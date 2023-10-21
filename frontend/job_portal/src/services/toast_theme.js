import { toast } from '@zerodevx/svelte-toast'

export const success_toast =(m,n=4000) => toast.push(m, {
  theme: {
    '--toastBackground': '#48BB78',
    '--toastColor': 'white',
    '--toastBarBackground': '#2F855A'
  },
  duration:n
})
export const error_toast = (m,n=4000) => toast.push(m, {
    theme: {
      '--toastBackground': '#F56565',
      '--toastColor': 'white',
      '--toastBarBackground': '#C53030'
    },
    duration:n
  })


  export const warning_toast = (m,n=4000)=> toast.push(m, {
    theme: {
      '--toastBackground': '#ffff1a',
      '--toastColor': 'black',
      '--toastBarBackground': '#ffd700'
    },
    duration:n
  })