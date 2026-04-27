## 2026-04-27 - Add aria-label to ImmersiveSlider3D navigation buttons
**Learning:** Icon-only navigation buttons in custom components like `ImmersiveSlider3D` are prone to lacking proper accessibility labels. This makes them invisible to screen readers, reducing overall usability for visually impaired users.
**Action:** Whenever creating or modifying custom interactive components like sliders or carousels, always ensure that text-less navigation controls include descriptive `aria-label` attributes to explicitly define their purpose.
