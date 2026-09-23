// Centralized branding config. Change values here — never hard-code brand
// details anywhere else in the app. Admins can also override the content
// fields (name, phone, email, address, colors, hero/about text) at runtime
// via /api/settings, which the Home/About/Contact pages fetch and prefer
// over these fallback defaults.
export const brand = {
  name: "Remon Academy",
  tagline: "Building Bright Futures Together",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.png",
  colors: {
    primary: "#0b1f4d",
    secondary: "#c9a24b",
  },
  contact: {
    phone: "+8801567936519",
    email: "info@remonacademy.com",
    address: "cumilla medical college road,cumilla.bangladesh",
  },
  social: {
    facebook: "https://facebook.com/remonacademy",
    youtube: "https://youtube.com/@remonacademy",
  },
  currency: "৳",
};
