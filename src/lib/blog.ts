export type BlogCategory = {
  name: string;
  slug: string;
  description: string;
};

export type BlogCategoryWithCount = BlogCategory & {
  count: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: BlogCategory['slug'];
  categoryName: string;
  author: string;
  readTime: string;
  gradient: string;
  content: string[];
};

const categories: BlogCategory[] = [
  {
    name: 'Authentication',
    slug: 'authentication',
    description: 'Hard-won lessons from building login flows that don\'t make users quit.',
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Practical security decisions that actually matter for small-to-mid product teams.',
  },
  {
    name: 'Engineering',
    slug: 'engineering',
    description: 'Frontend architecture opinions, war stories, and the tools we actually use.',
  },
  {
    name: 'Product',
    slug: 'product',
    description: 'Notes from the trenches on shipping features people actually want to use.',
  },
];

const blogPosts: BlogPost[] = [
  {
    id: 'post-auth-nextjs',
    slug: 'nextjs-auth-mistakes-we-made',
    title: 'The 3 Auth Mistakes That Cost Us 2 Weeks',
    excerpt: 'We shipped a Next.js auth flow that looked perfect on paper. Then real users started hitting walls. Here\'s what we wish we\'d known before.',
    date: '2026-03-14',
    category: 'authentication',
    categoryName: 'Authentication',
    author: 'Marcus Webb',
    readTime: '8 min read',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    content: [
      'We launched our auth flow in a single sprint. Everything passed code review. The PR got approved. Then production traffic showed us how wrong we were.',
      'Mistake one was treating "remember me" as a checkbox instead of a contract. We stored sessions differently on mobile than desktop. Users on iOS kept getting logged out mid-task. Took four days to realize our token refresh had a race condition.',
      'Mistake two was hiding the sign-up form behind a "Get started" button. Analytics showed 60% of visitors never saw it. We moved it above the fold and conversions tripled. The old design looked cleaner. It also converted worse.',
      'Mistake three was not testing with real passwords. Our dev database used "password123" for every account. Production users had actual password managers, special characters, and 32-character passphrases. Our validation regex was too strict and rejected about 8% of signups.',
      'The fix was shorter than the bug. A one-line regex change, a session config update, and moving a button up the page. But finding those three things took two weeks of support tickets and frustrated users.',
      'If you\'re building auth right now: test with real passwords, test on real devices, and measure where users actually click, not where you think they click.',
    ],
  },
  {
    id: 'post-session-management',
    slug: 'session-management-what-actually-matters',
    title: 'Session Management: The Parts Nobody Talks About',
    excerpt: 'Most session guides cover the basics and stop. Here are the edge cases that actually break production.',
    date: '2026-02-28',
    category: 'security',
    categoryName: 'Security',
    author: 'Priya Nair',
    readTime: '10 min read',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
    content: [
      'I\'ve reviewed a lot of session implementations. Most of them handle the happy path. The unhappy path is where things get interesting.',
      'Refresh token rotation sounds simple on paper. Rotate on use, revoke the old one, done. But what happens when the network drops halfway through? Or the user has three tabs open and they all try to refresh at once?',
      'We had a bug where concurrent refreshes would invalidate all but one tab. Users would refresh one tab and suddenly get logged out of the other two. Not a security disaster, but definitely an annoyance.',
      'The solution was a short-lived access token with a generous refresh window. Instead of rotating on every use, we rotate on a 5-minute sliding window. It\'s simpler and handles the concurrent case gracefully.',
      'Logout is trickier than it looks. Clearing cookies client-side is not enough. The server needs to blacklist the refresh token. But that blacklist needs to be checked on every authenticated request, which adds latency.',
      'We compromised: blacklist for 10 minutes, then trust that the token is effectively dead after its expiry. It\'s not perfect, but it\'s good enough for most products.',
      'The real takeaway: security is a series of trade-offs. Know which ones you\'re making and why.',
    ],
  },
  {
    id: 'post-ui-forms',
    slug: 'forms-that-dont-suck',
    title: 'I Spent 3 Days on a Single Form Field',
    excerpt: 'The password strength meter took longer than the entire login flow. Here\'s why that was worth it.',
    date: '2026-01-19',
    category: 'engineering',
    categoryName: 'Engineering',
    author: 'James Okonkwo',
    readTime: '6 min read',
    gradient: 'linear-gradient(135deg, #581c87 0%, #a21caf 100%)',
    content: [
      'Our login form was done in a day. The password field took three. Not because it was complex, but because we kept arguing about what "strong" means.',
      'The first version showed a generic "password must be at least 8 characters" message. Users hated it. They\'d type a 12-character password with numbers and symbols, see the error, and assume our system was broken.',
      'We switched to a live strength meter. Green, yellow, red. Simple. But we spent hours deciding what the thresholds should be. Length only? Mixed case? Special characters? Dictionary words?',
      'Turns out, NIST agrees with most users: length matters more than character chaos. A 12-character password with common words is harder to crack than an 8-character one with every symbol you can find.',
      'We went with a 12-character minimum and a zxcvbn score above 2. No forced special characters. Users stopped complaining. Password reset requests dropped by 40%.',
      'The lesson: trust users to make good choices. Guide them, don\'t fight them.',
    ],
  },
  {
    id: 'post-privacy-first',
    slug: 'privacy-isnt-a-feature',
    title: 'Privacy Is Not a Feature',
    excerpt: 'Adding a privacy toggle is not the same as building a product that respects people. The distinction matters more than ever.',
    date: '2025-12-05',
    category: 'product',
    categoryName: 'Product',
    author: 'Elena Vasquez',
    readTime: '5 min read',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 100%)',
    content: [
      'Every product review now includes a "privacy score." Every feature launch mentions "privacy-first." But most of this is marketing.',
      'Real privacy is not a toggle. It\'s the default. It\'s not asking users to opt in to data protection. It\'s not collecting the data in the first place.',
      'I worked on a product that collected location data "to improve recommendations." The feature was optional. But the opt-out was buried in settings most users never reached.',
      'We fixed it by making location collection opt-in from the start. The app still worked. Recommendations were slightly less accurate. Users trusted us more.',
      'The privacy paradox: users say they want privacy, but they also want personalization. The companies that win will be the ones that make privacy the default, not the exception.',
      'If you\'re building a product in 2026, ask yourself: what data am I collecting that I don\'t actually need? Start there.',
    ],
  },
  {
    id: 'post-static-pages',
    slug: 'why-we-still-use-static-pages',
    title: 'Why Our Team Still Prefers Static Pages for Launches',
    excerpt: 'In a world of headless CMSs and dynamic everything, sometimes a good old HTML file is the right call.',
    date: '2026-04-02',
    category: 'engineering',
    categoryName: 'Engineering',
    author: 'James Okonkwo',
    readTime: '4 min read',
    gradient: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
    content: [
      'Our marketing site is still mostly static HTML. No CMS. No build step for content changes. Just files we can drag to S3.',
      'People think static is a limitation. We think it\'s a feature. No database to hack. No admin panel to secure. No dependency updates that break the production build at 5 PM on Friday.',
      'When we need dynamic content, we add a small API layer. But the page structure, the copy, the design — that stays static. It\'s faster, more reliable, and easier to debug.',
      'The CMS vendors will tell you that every marketing team needs a content editor. Our marketing team prefers Google Docs and a deployment script. Different teams have different needs.',
      'Static doesn\'t mean boring. Our pages still have animations, interactions, and personalization where it counts. We just don\'t let a CMS dictate the architecture.',
    ],
  },
  {
    id: 'post-password-recovery',
    slug: 'password-reset-flows-that-work',
    title: 'Password Reset: The Flow Everyone Hates But Nobody Fixes',
    excerpt: 'The password reset flow is the most neglected part of most auth systems. It doesn\'t have to be that way.',
    date: '2026-01-07',
    category: 'authentication',
    categoryName: 'Authentication',
    author: 'Marcus Webb',
    readTime: '7 min read',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    content: [
      'Password reset is the last thing anyone wants to build. It\'s also the flow that generates the most support tickets after launch.',
      'The most common mistake: making the reset email the only recovery path. Not everyone has access to their email. Not everyone checks it regularly. Some people use aliases they forgot about.',
      'We added a backup recovery code option. Users can generate a set of codes during signup and store them somewhere safe. If email fails, they still have access.',
      'The reset token itself should be short-lived. Ours expires in 15 minutes. If the user doesn\'t use it, they can request a new one. No "token already used" errors because we don\'t try to be clever about reuse.',
      'The password reset form should accept the new password and confirm it inline. No separate confirmation step. Just two fields that match and a submit button.',
      'After reset, log the user in automatically. Don\'t make them type the new password again. They just set it. Send them to a safe page. Let them explore.',
    ],
  },
];

export function getBlogPosts() {
  return [...blogPosts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getFeaturedPost() {
  return getBlogPosts()[0];
}

export function getBlogPostBySlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function getBlogCategories() {
  return categories.map((category) => ({
    ...category,
    count: blogPosts.filter((post) => post.category === category.slug).length,
  }));
}

export function getPostsByCategory(category: string) {
  return getBlogPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return getBlogPosts()
    .filter((item) => item.id !== post.id && item.category === post.category)
    .slice(0, limit);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
