# Velocity Design System - Modern Dark Theme

## Overview
Velocity has been completely redesigned with a modern, attractive dark theme inspired by AlgoUniversity's sophisticated aesthetic. The design features glowing effects, smooth animations, and a premium gradient-based color system.

## Color Palette

### Primary Colors
- **Background**: `#0a0e27` - Deep navy dark background
- **Card**: `#1a1f3a` - Slightly lighter card backgrounds
- **Primary**: `#6366f1` - Indigo accent (primary brand color)
- **Secondary**: `#06b6d4` - Cyan accent (supporting color)
- **Accent**: `#ec4899` - Pink accent (highlights)

### Support Colors
- **Foreground**: `#e4e6eb` - Light text color
- **Border**: `#2d3748` - Subtle border color
- **Muted**: `#374151` - Muted text
- **Input**: `#1a1f3a` - Input background

### Chart Colors
- Chart 1: `#6366f1` (Primary)
- Chart 2: `#06b6d4` (Secondary)
- Chart 3: `#ec4899` (Accent)
- Chart 4: `#f59e0b` (Amber)
- Chart 5: `#10b981` (Green)

## Visual Effects

### 1. Glowing Effects
- **Primary Glow**: `box-shadow: 0 0 20px rgba(99, 102, 241, 0.5)`
- **Secondary Glow**: `box-shadow: 0 0 20px rgba(6, 182, 212, 0.5)`
- **Accent Glow**: `box-shadow: 0 0 20px rgba(236, 72, 153, 0.5)`

### 2. Custom Animations
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.8), 0 0 20px rgba(99, 102, 241, 0.5); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### 3. Interactive Effects
- **Card Glow**: Smooth hover effect with glow intensification
- **Button Glow**: Shine animation on hover with gradient overlay
- **Smooth Hover**: 0.3s cubic-bezier transition for all interactive elements
- **Gradient Text**: Multi-color gradient effect on headings

## Component Styles

### Card (`card-glow`)
```css
.card-glow {
  @apply bg-card smooth-hover border border-border rounded-lg;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.1);
}

.card-glow:hover {
  border-color: #6366f1;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.2), inset 0 0 30px rgba(99, 102, 241, 0.05);
}
```

### Button (`button-glow`)
- Includes shimmer effect on hover
- Smooth color transitions
- Glow shadow during interaction
- Premium feel with shine animation

### Text Effects
- **Gradient Text**: Applies multi-color gradient to headings
  - Colors: Indigo → Cyan → Pink
  - Smooth, eye-catching appearance

## Updated Pages

### 1. Authentication Pages (Login & Signup)
- Dark background with floating glow orbs
- Card-based layout with glow effects
- Gradient text for headers
- Smooth input transitions
- Premium button styling

### 2. Onboarding Page
- Multi-step form with dark theme
- Floating background animations
- Glowing card containers
- Styled input fields with focus states
- Color-coded section headers

### 3. Dashboard
- Dark background with depth
- Tab-based navigation
- Glowing stat cards
- Gradient-accented section headers
- Enhanced Nova AI card with special styling
- Color-coded importance indicators

### 4. Home Page (Loading Screen)
- Dark background
- Animated loader with glow effect
- Floating background orbs
- Smooth loading experience

### 5. Dashboard Header
- Dark card background with subtle glow
- Gradient text logo
- Premium user info section
- Smooth logout button with hover effects

## Tailwind Utility Classes Added

### Glow Effects
- `.glow-primary` - Primary blue glow
- `.glow-secondary` - Cyan glow
- `.glow-accent` - Pink glow
- `.glow-hover` - Glow on hover

### Animations
- `.animate-glow` - Pulsing glow animation
- `.animate-float` - Floating animation
- `.animate-shimmer` - Shimmer effect

### Interactive
- `.smooth-hover` - Smooth transition effect
- `.card-glow` - Premium card style with glow
- `.button-glow` - Premium button with shine
- `.gradient-text` - Multi-color gradient text

## Typography

### Font Configuration
- Sans: Geist (default)
- Mono: Geist Mono (for code)
- Standard Tailwind font scaling applied

### Heading Styles
- All major headings use `.gradient-text` for premium appearance
- Maintains readability while adding visual interest
- Consistent sizing across all pages

## Responsive Design

- Mobile-first approach maintained
- Dark theme works seamlessly on all screen sizes
- Touch-friendly button sizing
- Optimized glow effects for performance

## Performance Considerations

- Glow effects use `box-shadow` (GPU accelerated)
- Animations use `transform` and `opacity` (performant)
- Floating orbs use `blur-3xl` for visual impact without performance hit
- Smooth transitions use `cubic-bezier(0.4, 0, 0.2, 1)` for optimal UX

## Accessibility

- Proper contrast ratios maintained for text
- Color not the only differentiator for important information
- Focus states clearly visible on interactive elements
- Semantic HTML preserved throughout
- ARIA labels maintained on all components

## Future Enhancement Opportunities

1. **Dark/Light Mode Toggle**: Add system preference detection
2. **Custom Theme Colors**: Allow users to personalize their accent colors
3. **Advanced Animations**: More sophisticated interaction patterns
4. **Micro-interactions**: Additional polish for button clicks, form submissions
5. **Glassmorphism**: Optional frosted glass effect on cards

## Implementation Notes

All changes are made to:
- `/app/globals.css` - Core theme and animations
- `/app/auth/login/page.tsx` - Login page styling
- `/app/auth/signup/page.tsx` - Signup page styling
- `/app/onboarding/page.tsx` - Onboarding page styling
- `/app/dashboard/page-integrated.tsx` - Dashboard styling
- `/app/page.tsx` - Home/loading page styling
- `/components/dashboard-header.tsx` - Header styling

All components maintain full functionality while featuring the new visual design.
