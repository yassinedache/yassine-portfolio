# Dache Yassine - Portfolio

My personal portfolio: services, work experience, projects, certificates and a contact form.
Live on Vercel. The content can be edited from a private admin page at `/admin`.

## How it works

- `index.html` is the public site. All the text lives inside it, in the `<script id="site-data">` block.
- `uploads/` holds the photos and images.
- `api/` holds the private admin (only reachable with the admin password):
  - `/admin` shows the login page, then the admin once you're logged in.
  - Publishing from the admin makes one commit to this repository, and Vercel redeploys the site automatically.

## Settings needed on Vercel (Project, Settings, Environment Variables)

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A long password only you know |
| `GITHUB_TOKEN` | A fine-grained GitHub token with Contents: Read and write on this repository only |
| `GITHUB_REPO` | `your-github-username/yassine-portfolio` |
| `GITHUB_BRANCH` | Optional, defaults to `main` |

Never put the password or the token in this repository.
