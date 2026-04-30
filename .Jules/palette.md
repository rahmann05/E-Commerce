## 2026-04-27 - Add aria-label to ImmersiveSlider3D navigation buttons
**Learning:** Icon-only navigation buttons in custom components like `ImmersiveSlider3D` are prone to lacking proper accessibility labels. This makes them invisible to screen readers, reducing overall usability for visually impaired users.
**Action:** Whenever creating or modifying custom interactive components like sliders or carousels, always ensure that text-less navigation controls include descriptive `aria-label` attributes to explicitly define their purpose.
## 2026-04-30 - Added Accessibility Labels to Cart Buttons
**Learning:** The application is primarily localized in Indonesian. When adding ARIA labels, they must be translated appropriately (e.g., 'Kurangi jumlah' instead of 'Decrease quantity').
**Action:** Ensure future accessibility additions respect the established localization language of the application.
