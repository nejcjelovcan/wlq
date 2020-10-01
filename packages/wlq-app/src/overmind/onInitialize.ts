import { OnInitialize } from 'overmind'

export const onInitialize: OnInitialize = async ({
  state: { user },
  effects: { localStorage },
}) => {
  const token = localStorage.getItem('token')
  if (token) user.token = token
}
