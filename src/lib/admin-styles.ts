// Shared styles for admin pages matching the public page aesthetic
// Hand-drawn, paper-like design language

export const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
} as const;

export const handDrawnBorderSubtle = {
  border: 'solid 1px hsl(220 15% 88%)',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
} as const;

// Section divider style
export const sectionDivider = {
  borderTop: 'solid 2px #41403E',
} as const;

// Card container classes for consistent styling
export const adminCardClasses = "bg-background p-6 shadow-sm";
export const adminCardWarmClasses = "bg-background-warm p-6";

// Table wrapper classes
export const adminTableWrapperClasses = "bg-background overflow-hidden";

// Filter bar classes  
export const adminFilterBarClasses = "bg-background-warm p-4 mb-6";

// Stat card classes
export const adminStatCardClasses = "bg-background p-4 shadow-sm";
