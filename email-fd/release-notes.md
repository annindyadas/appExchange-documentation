# Email F&D — Release Notes

> Forward & Download for Salesforce · adasApps managed package

---

## Version 1.0.0 — Initial Release

**Released:** 2025

### What's included

- **Forward Emails** — select one or multiple emails from any Salesforce record and forward them as `.eml` attachments to any email address
- **Download Emails** — download selected emails as a single ZIP file containing individual `.eml` files
- **Attachment support** — all original email attachments are bundled automatically on both forward and download
- **Universal compatibility** — works on any Salesforce object with associated `EmailMessage` records (Cases, Opportunities, Accounts, Contacts, and more)
- **Permission set-based access** — `Email F&D Full Access` and `Email F&D Download Only` permission sets included
- **Custom permissions** — `Allow_Email_Forwarding` and `Allow_Email_Download` control feature visibility per user
- **Download quick action** — `EmailMessage.Download` quick action included and ready to add to page layouts
- **Screen Flow** — `Download_Email` flow wraps the download LWC for quick action use on EmailMessage
- **AppExchange ready** — CRUD/FLS enforcement, `with sharing` keyword, 75%+ Apex test coverage

### Components included

| Type | Name |
|------|------|
| Apex Class | `EmailForwarder` |
| Apex Test | `EmailForwarderTest` |
| LWC | `emailForwarderModal` |
| LWC | `emailDownloader` |
| LWC | `emailUtils` |
| Flow | `Download_Email` |
| Quick Action | `EmailMessage.Download` |
| Custom Permission | `Allow_Email_Forwarding` |
| Custom Permission | `Allow_Email_Download` |
| Permission Set | `Email F&D Full Access` |
| Permission Set | `Email F&D Download Only` |

### Known limitations

- Email Deliverability must be set to **All Email** in org settings for the forward feature to send emails
- The **Forward Emails** quick action must be created manually per object — it cannot be packaged as a global action
- **Dynamic Actions** (Lightning App Builder) require manual configuration per record page
- Save Email-to-Case attachments as Salesforce Files must be enabled for attachment support on Email-to-Case records

---

## Upgrade notes

No prior version exists. Fresh installation only.

For post-installation setup steps see the [Post-Installation Guide](https://annindyadas.github.io/appExchange-documentation/email-fd/post-install).

---

## Support

Issues or questions → [raise an issue](https://github.com/annindyadas/appExchange-documentation/issues/new?template=email-fd-issue.yml) or contact via the AppExchange listing.
