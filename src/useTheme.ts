import theme from './theme';
import { useColorMode } from '@chakra-ui/core';

type themeKey = keyof typeof theme;

export default function useTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  const themeColors: Record<themeKey, string> = (Object.keys(
    theme
  ) as themeKey[]).reduce<Record<themeKey, string>>(
    (acc, field) => ({ ...acc, [field]: theme[field][colorMode] }),
    {} as Record<themeKey, string>
  );

  return {
    ...themeColors,
    toggleTheme: toggleColorMode,
    theme: colorMode,
  };
}
