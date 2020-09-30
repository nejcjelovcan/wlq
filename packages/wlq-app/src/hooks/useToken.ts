import { useEffect } from 'react'
import { useOvermind } from '../overmind'

const useToken = () => {
  const {
    state: {
      user: { token },
    },
    actions: {
      user: { getToken },
    },
  } = useOvermind()

  useEffect(() => {
    if (!token) {
      getToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return token
}
export default useToken
