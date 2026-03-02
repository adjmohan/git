# **App Name**: CommerceStream

## Core Features:

- Secure User Authentication: Enable user sign-up, login, and password recovery via Firebase Authentication with robust form validation using React Hook Form and Zod.
- Dynamic Product Catalog: Display products across a home page with banners, categories, featured items, and deals. Implement product listing pages with advanced filtering (category, price, rating), sorting, and pagination, with data sourced from Firestore.
- Detailed Product Views: Provide comprehensive product detail pages featuring image galleries, detailed descriptions, specifications, pricing, user ratings, and reviews, using data from Firestore.
- Shopping Cart Management: Allow users to add, remove, and update quantities of items in their shopping cart, displaying a real-time price summary using Zustand for state management.
- Personalized Wishlist: Enable users to save favorite products to a wishlist for later viewing and purchasing, with wishlist items persisted in Firestore.
- Streamlined Checkout Process: Facilitate a multi-step checkout workflow, including address input, order summary display, and final order placement, creating order documents in Firestore.
- User Dashboard & Order History: Offer a dedicated user dashboard where users can manage profile information, addresses, and review their past order history retrieved from Firestore.

## Style Guidelines:

- Primary brand color: A confident and trustworthy blue (#366FF0). It's vibrant enough to catch attention but maintains a professional feel.
- Background color: A very light, subtle cool white (#F5F7FC) to ensure maximum content readability and a clean interface.
- Accent color: A bright, energetic sky blue (#19B9F2) to highlight calls-to-action, active elements, and important notifications, ensuring high visibility.
- Headlines and prominent text: 'Space Grotesk' (sans-serif) for a modern, slightly tech-inspired, and strong visual impact. Body text and longer content: 'Inter' (sans-serif) for excellent legibility and a neutral, objective feel suitable for detailed product information.
- Utilize crisp, modern line icons provided by ShadCN UI to maintain a consistent and intuitive user experience across all navigation and action elements.
- Adopt a flexible, grid-based layout for product displays and content sections, ensuring full responsiveness across mobile, tablet, and desktop viewports, with adequate spacing for visual clarity.
- Implement subtle, fast loading animations for hero banner carousels, product hover states, modal transitions, and navigation interactions to enhance user engagement without impeding performance.