import Image from 'next/image';

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: 'md' | 'lg' }) {
  const className = size === 'lg' ? 'h-28 w-28 text-3xl' : 'h-14 w-14 text-lg';

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size === 'lg' ? 112 : 56}
        height={size === 'lg' ? 112 : 56}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${className} flex shrink-0 items-center justify-center rounded-full bg-primary-light font-extrabold text-primary-dark`}>
      {initials(name)}
    </div>
  );
}
