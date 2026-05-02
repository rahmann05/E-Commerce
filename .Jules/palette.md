## 2026-04-27 - Add aria-label to ImmersiveSlider3D navigation buttons
**Learning:** Icon-only navigation buttons in custom components like `ImmersiveSlider3D` are prone to lacking proper accessibility labels. This makes them invisible to screen readers, reducing overall usability for visually impaired users.
**Action:** Whenever creating or modifying custom interactive components like sliders or carousels, always ensure that text-less navigation controls include descriptive `aria-label` attributes to explicitly define their purpose.

## 2026-05-15 - Add context-aware aria-labels to Cart quantity buttons
**Learning:** Icon-only quantity controls (like Plus/Minus buttons in the shopping cart) often lack descriptive labels, leaving screen reader users without context on what quantity they are adjusting. Generic labels are not enough when there are multiple items.
**Action:** When implementing quantity adjustment buttons in a list (like a cart), always use `aria-label` attributes that include the product name (e.g., `aria-label="Kurangi jumlah [Nama Produk]"`) to provide clear, item-specific context for screen reader users.
