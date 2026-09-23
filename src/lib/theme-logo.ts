const darkVariants: Record<string, string> = {
  '/logos/openai.svg': '/logos/openai-dark.svg',
}

export function resolveLogoSrc(src: string, isDark: boolean) {
  if (!isDark) return src
  return darkVariants[src] ?? src
}
