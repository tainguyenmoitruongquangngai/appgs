import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

// Ép kiểu href thành ExternalPathString để tránh lỗi TypeScript
import type { ExternalPathString } from 'expo-router';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: ExternalPathString };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as ExternalPathString} // Ép kiểu
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
