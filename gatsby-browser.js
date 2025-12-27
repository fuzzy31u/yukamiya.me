export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )

  if (answer === true) {
    window.location.reload()
  }
}

// Add Google Fonts for About page redesign
export const onClientEntry = () => {
  // Create link element for Google Fonts
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Sans+JP:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}
