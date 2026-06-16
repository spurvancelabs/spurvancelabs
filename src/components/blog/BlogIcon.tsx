import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  CodeBracketSquareIcon,
  EnvelopeIcon,
  KeyIcon,
  LinkIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

type BlogIconProps = {
  name: string;
  className?: string;
};

export default function BlogIcon({ name, className = 'h-5 w-5' }: BlogIconProps) {
  const iconProps = {
    className,
    'aria-hidden': true,
  };

  switch (name) {
    case 'authentication':
      return <KeyIcon {...iconProps} />;
    case 'security':
      return <ShieldCheckIcon {...iconProps} />;
    case 'engineering':
      return <CodeBracketSquareIcon {...iconProps} />;
    case 'product':
      return <SparklesIcon {...iconProps} />;
    case 'book':
      return <BookOpenIcon {...iconProps} />;
    case 'clock':
      return <ClockIcon {...iconProps} />;
    case 'tag':
      return <TagIcon {...iconProps} />;
    case 'arrow':
      return <ArrowRightIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'link':
      return <LinkIcon {...iconProps} />;
    case 'bookmark':
      return <BookOpenIcon {...iconProps} />;
    case 'mail':
      return <EnvelopeIcon {...iconProps} />;
    default:
      return <BookOpenIcon {...iconProps} />;
  }
}
