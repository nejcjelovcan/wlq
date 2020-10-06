export type GetTokenResponseData = { token: string }
export type TokenVerifier = (token: string) => Promise<string>
