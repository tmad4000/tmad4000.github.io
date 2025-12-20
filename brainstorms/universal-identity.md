# Universal Identity System Brainstorm

*Date: December 2024*

## The Problem

Different sites should just immediately know who I am. Authentication is annoying across lots of sites.

## Constraints

- Browsers intentionally prevent cross-domain tracking (privacy/security)
- Third-party cookies are being phased out
- Mobile browsers (Safari, Chrome) don't support extensions
- Don't want to lose identity if keys are lost
- Don't want to take action for each new domain

## Approaches Considered

### 1. Browser Extension (Desktop Only)
- Extension stores identity, broadcasts to any site that asks
- Zero friction on desktop
- **Problem**: Doesn't work on mobile (except Firefox Android)

### 2. Private GitHub Repo + PAT
- Store private content in a private repo/gist
- Enter GitHub PAT as the "key" in settings
- JavaScript fetches private content via GitHub API
- **Problem**: Per-site setup, not cross-domain identity

### 3. Encrypted Content in Public Repo
- Private content lives encrypted in public repo
- Password decrypts client-side
- **Problem**: Re-encrypt on every change

### 4. Domain as Identity (IndieAuth style)
- Own a domain, that IS you
- `.well-known/identity.json` proves you control it
- **Problem**: Still requires per-site auth action

### 5. Keypair-based (Crypto wallet style)
- Extension generates keypair on install
- Public key = your identity
- Sites challenge → extension signs → verified
- **Problem**: Lose keys = lose identity

## Preferred Solution: Central Identity + Omni-Link

### Daily Flow
1. Sites check localStorage for identity token
2. If empty, show "Verify yourself" button
3. Button redirects to central domain (e.g., `tmad4000.github.io/whoami`)
4. User is already logged in there (cookie)
5. Redirects back with token → site stores in localStorage
6. One click, no typing, works on mobile

### New Device Setup ("Omni-Link")
1. Open `tmad4000.github.io/whoami/setup`
2. Page knows all registered sites
3. Rapidly opens each site with `?auth_token=xyz` in popup
4. Each site's code stores token in localStorage, closes popup
5. All sites now know you in seconds

### Architecture
```
┌─────────────────────────────────────────┐
│  tmad4000.github.io/whoami/setup        │
│                                         │
│  Setting up your identity...            │
│                                         │
│  ✓ tmad4000.github.io                   │
│  ✓ project-a.vercel.app                 │
│  ✓ my-app.netlify.app                   │
│  ⏳ other-project.com                   │
│                                         │
│  [Opens each site with token in URL,    │
│   each stores it, auto-closes]          │
└─────────────────────────────────────────┘
```

### Site Integration (Simple)
```javascript
// Add to any project
window.addEventListener('whoami-response', (e) => {
  console.log(e.detail);
  // { name: "Jacob", email: "...", verified: true }
});
window.dispatchEvent(new CustomEvent('whoami-request'));
```

### Benefits
- Works on mobile (redirect-based, no extension needed)
- Recoverable (backed by Google/GitHub OAuth on central domain)
- One-click per new domain (acceptable trade-off)
- Omni-link for batch setup on new devices
- No complex crypto key management

## Existing Solutions (Gaps)

| Solution | What it does | Limitation |
|----------|--------------|------------|
| DID Wallet extensions | Decentralized identity | Crypto-focused, lose keys = lose identity |
| IndieAuth | Sign in with your domain | Web-based, no extension, requires site integration |
| Magic Link | Universal email wallet | Crypto/Web3 focused |
| WebAuthn/Passkeys | Browser-native, passwordless | Per-site, not "broadcast identity" |
| FedCM (Chrome) | Federated identity API | Still evolving, requires site adoption |

**Gap**: Nobody has built a simple extension/system where you log in once (with Google or normal password) and it broadcasts identity to any site that asks, with recovery if you lose access.

## Next Steps

1. Build central identity page at `tmad4000.github.io/whoami`
2. Create simple login (username/password for v1, OAuth later)
3. Build "verify yourself" redirect flow
4. Build omni-link batch setup page
5. Create JavaScript snippet for site integration
6. Optional: Browser extension for zero-click on desktop

## Open Questions

- How to handle revocation if a token is compromised?
- Should identity include more than name/email?
- How to make the omni-link popup flow not feel spammy?
- Could passkeys be the underlying auth mechanism for the central domain?
