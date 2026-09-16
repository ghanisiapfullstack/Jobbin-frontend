let accessToken: string | null = localStorage.getItem('token')

export function getAccessToken() {
  return accessToken
}

export function setAccessToken(token: string | null) {
  accessToken = token
  // Remove the legacy persistent token after the first successful auth cycle.
  localStorage.removeItem('token')
}

