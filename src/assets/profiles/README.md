Custom profile images drop zone
===============================

Use this folder when you want to override built-in profile images.

How to add images
-----------------

1) Create one folder per profile key:

- `female_001`
- `female_002`
- ...

2) Inside each profile folder, add exactly these files:

- `card.png` (or `.jpg` / `.jpeg` / `.webp`)
- `avatar.png` (or `.jpg` / `.jpeg` / `.webp`)

Supported pattern
-----------------

- `src/assets/profiles/<profile_key>/card.(png|jpg|jpeg|webp)`
- `src/assets/profiles/<profile_key>/avatar.(png|jpg|jpeg|webp)`

Example
-------

`src/assets/profiles/female_001/card.jpg`
`src/assets/profiles/female_001/avatar.jpg`

Notes
-----

- The app uses your local files only when both `card` and `avatar` exist.
- If either file is missing, it automatically falls back to the built-in image set.
