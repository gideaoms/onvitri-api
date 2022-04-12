type Crypto = {
  compare(plain: string, hashed: string): Promise<boolean>
  hash(plain: string, round?: number): Promise<string>
}

export { Crypto }
