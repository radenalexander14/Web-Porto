# Alexander Portfolio Website

Simple responsive personal portfolio website made with:
- HTML
- CSS
- JavaScript

## Files

- `index.html`
- `style.css`
- `script.js`

## How to use

1. Open this folder in Visual Studio Code.
2. Open `index.html` directly in the browser, or use the Live Server extension.
3. Replace placeholder links:
   - Email
   - LinkedIn
   - GitHub
4. Replace the "YOUR PHOTO" placeholder with your profile photo if needed.
5. Edit projects and descriptions based on your real portfolio.

## Adding a profile photo

Put your image inside the project folder, for example:

`profile.jpg`

Then replace:

```html
<div class="profile-photo">
  <span>YOUR<br>PHOTO</span>
</div>
```

with:

```html
<div class="profile-photo">
  <img src="profile.jpg" alt="Alexander profile photo">
</div>
```

Then add this CSS:

```css
.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Deployment

You can deploy this website easily using:
- GitHub Pages
- Netlify
- Vercel

## Contact form (Netlify Forms)

The "Send a Direct Message" form uses Netlify Forms. It only works once the site is deployed on Netlify
(it will show a "couldn't send" message with a mailto fallback when opened locally).

After the first deploy:
1. Netlify dashboard > your site > **Forms** — confirm the form named `contact` is detected.
2. **Site configuration > Forms > Form notifications > Add notification > Email notification**.
3. Choose the `contact` form, enter `radenalexander14@gmail.com`, save.
4. Send a test message from the live site and check your inbox (and spam folder).
