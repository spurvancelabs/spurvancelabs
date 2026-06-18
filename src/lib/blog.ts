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
  authorImage?: string;
  readTime: string;
  gradient: string;
  coverImage?: string;
  content: string;
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

// In your blog data file (lib/blog.ts or similar)

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '10-elegant-color-palettes-for-your-website',
    title: '10 Elegant Color Palettes for Your Website',
    excerpt: 'Discover 10 carefully curated color palettes that will transform your web design and create lasting impressions.',
    author: 'Muzammil Riaz',
    authorImage: 'https://plus.unsplash.com/premium_photo-1689607809841-cbbc3595f3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    date: '2025-11-20',
    category: 'engineering',
    categoryName: 'Engineering',
    gradient: 'from-blue-500 to-purple-500',
    readTime: '9 min read',
    coverImage: 'https://images.unsplash.com/photo-1771740700854-dcb3162873a6?w=900&auto=format&fit=crop&q=70&ixlib=rb-4.1.0',
    content: `Color is one of the most powerful tools in a designer's arsenal. The right color palette can transform a website from ordinary to extraordinary, creating emotional connections with users and reinforcing brand identity. In this article, we'll explore 10 elegant color palettes that will elevate your web design projects and leave a lasting impression on your visitors.

## Why Color Palettes Matter

Before diving into our curated palettes, it's important to understand why color selection is crucial for web design. Colors influence perception, evoke emotions, and guide user behavior. Studies have shown that people make subconscious judgments about a website within 90 seconds of viewing it, and up to 90% of that assessment is based on color alone.

![Color palette inspiration](https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

A well-chosen color scheme creates harmony, establishes visual hierarchy, and makes content more readable. It also contributes to brand recognition – think of Coca-Cola's red, Facebook's blue, or Starbucks' green. These brands have built their entire identity around specific colors that resonate with their target audience.

## 1. Serene Ocean

This palette draws inspiration from the deep blue sea and sandy beaches. It combines calming navy blues with warm sandy beiges and crisp whites.

![Ocean color palette](https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

The contrast between dark and light creates a sophisticated, trustworthy feel that works exceptionally well for financial institutions, travel websites, and wellness brands. Use the deep blue for headers and primary elements, the beige for backgrounds, and white for text to ensure readability.

**Hex Codes:**
- Navy Blue: #1a2a3a
- Sandy Beige: #f5e6d3
- Crisp White: #ffffff
- Ocean Teal: #2c6e7a

## 2. Botanical Garden

Nature-inspired palettes are timeless and universally appealing. This combination features rich forest greens, earthy browns, and delicate floral pinks.

![Botanical garden colors](https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

It brings a fresh, organic feel to any website and works particularly well for eco-friendly brands, organic products, and lifestyle blogs. The green conveys growth and sustainability, while the pink adds a touch of warmth and approachability.

**Hex Codes:**
- Forest Green: #2d4a3e
- Earthy Brown: #8b7355
- Floral Pink: #e8a8b8
- Sage Green: #9cb4a0

## 3. Golden Hour

Inspired by the warm glow of sunset, this palette features rich golds, burnt oranges, and deep purples.

![Golden hour colors](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

It creates a sense of luxury, creativity, and warmth. This color combination is ideal for creative agencies, photography portfolios, and brands that want to convey sophistication and artistic flair. The warm tones are inviting and memorable, making visitors feel comfortable and engaged.

**Hex Codes:**
- Rich Gold: #c9a84c
- Burnt Orange: #d4652a
- Deep Purple: #4a2c6a
- Warm Peach: #f4c9a0

## 4. Minimalist Monochrome

Sometimes, less is more. A monochrome palette using various shades of gray, white, and black creates a clean, modern aesthetic that lets content take center stage.

![Monochrome design](https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

This timeless approach works for any industry and is particularly popular in tech, architecture, and high-end fashion. The key is to use different shades to create depth and visual interest without relying on color alone.

**Hex Codes:**
- Pure Black: #000000
- Dark Gray: #333333
- Medium Gray: #888888
- Light Gray: #dddddd
- Pure White: #ffffff

## 5. Mediterranean Vibes

This cheerful palette features terracotta, olive green, and creamy whites, reminiscent of Italian and Greek coastal towns.

![Mediterranean colors](https://images.unsplash.com/photo-1556197616-71c12a93c8e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

It brings warmth, character, and a sense of timeless beauty to any design. Perfect for restaurants, hospitality brands, and lifestyle websites, this palette creates an inviting atmosphere that feels both sophisticated and approachable.

**Hex Codes:**
- Terracotta: #c86733
- Olive Green: #7a8c5e
- Creamy White: #fdf6ec
- Deep Blue: #2c5f7a

## 6. Jewel Tones

For brands that want to exude luxury and sophistication, jewel tones offer rich, saturated colors that command attention.

![Jewel tones](https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

This palette combines emerald green, sapphire blue, ruby red, and amethyst purple. These colors work beautifully for high-end fashion, luxury goods, and premium services.

**Hex Codes:**
- Emerald: #2d6a4f
- Sapphire: #1a3a6a
- Ruby: #8b1a2a
- Amethyst: #6a2a7a

## 7. Pastel Dreams

Soft, muted pastels create a gentle, calming atmosphere that's perfect for wellness brands, children's products, and lifestyle blogs.

![Pastel colors](https://images.unsplash.com/photo-1488275373886-228f8f0de4f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

This palette features baby pink, mint green, lavender, and powder blue. The subtle tones are easy on the eyes and create a sense of tranquility and approachability.

**Hex Codes:**
- Baby Pink: #f4c2c2
- Mint Green: #b8d4c8
- Lavender: #d8c8e8
- Powder Blue: #b8d4e8

## 8. Retro Revival

Drawing inspiration from the 70s, this palette combines mustard yellow, avocado green, burnt orange, and chocolate brown.

![Retro colors](https://images.unsplash.com/photo-1558997519-3e13b46dfa3b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

It brings nostalgia and personality to brands in the creative industries, including music, fashion, and entertainment.

**Hex Codes:**
- Mustard Yellow: #d4a837
- Avocado Green: #6a7a4a
- Burnt Orange: #c86733
- Chocolate Brown: #5a3a2a

## 9. Neon Nights

For brands that want to make a bold statement, neon colors create energy, excitement, and memorability.

![Neon colors](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

This palette features electric blue, hot pink, lime green, and bright purple. Use these colors sparingly as accents against dark backgrounds for maximum impact.

**Hex Codes:**
- Electric Blue: #00d4ff
- Hot Pink: #ff2a6a
- Lime Green: #39ff14
- Bright Purple: #b026ff

## 10. Earth Tones

Natural, grounded colors create a sense of stability, authenticity, and connection to nature.

![Earth tones](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

This palette features warm browns, soft greens, and muted oranges. It works particularly well for outdoor brands, organic products, and sustainable businesses.

**Hex Codes:**
- Warm Brown: #8b7355
- Soft Green: #7a8c5e
- Muted Orange: #c9a87a
- Clay: #c86733

## Implementing Your Color Palette

Once you've selected your palette, implementing it effectively is crucial. Follow the 60-30-10 rule: use your primary color for 60% of the design, secondary for 30%, and accent for the remaining 10%.

![Color implementation](https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

Ensure sufficient contrast between text and background colors for accessibility. Test your palette across different devices and screen sizes to ensure consistency.

## Tools for Creating Color Palettes

Here are some excellent tools to help you create and test color palettes:

| Tool | Description | Best For |
|------|-------------|----------|
| **Coolors** | Fast color palette generator | Quick inspiration |
| **Adobe Color** | Advanced color wheel and trends | Professional design |
| **Paletton** | Color scheme designer | Color theory study |
| **Color Hunt** | Curated color palettes | Pre-made collections |
| **Muzli Colors** | AI-powered suggestions | Modern designs |

## Tips for Using Color Effectively

1. **Consider accessibility**: Ensure sufficient contrast for readability
2. **Test on multiple devices**: Colors appear differently on various screens
3. **Use color psychology**: Choose colors that evoke the right emotions
4. **Limit your palette**: 3-5 colors is usually enough
5. **Maintain consistency**: Use the same colors across all brand touchpoints

## Conclusion

Choosing the right color palette is an investment in your brand's future. The 10 palettes we've explored offer a range of options suitable for various industries and design styles.

Remember, the best palette is one that aligns with your brand values, resonates with your target audience, and creates a memorable user experience. Don't be afraid to experiment and iterate – sometimes the most beautiful color combinations come from unexpected places.

Start experimenting with these palettes in your next project and watch how they transform your designs. Whether you're building a new website or refreshing an existing one, these elegant color combinations will help you create something truly special that stands out in today's digital landscape.

## Further Reading

- [The Psychology of Color in Web Design](#)
- [How to Choose the Perfect Color Scheme](#)
- [Color Accessibility Guidelines](#)
- [Trending Color Palettes for 2026](#)
- [Using Color to Improve User Experience](#)`
  }
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