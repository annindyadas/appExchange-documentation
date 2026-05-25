# Email F&D - Release Notes

> Forward & Download for Salesforce · adasApps managed package

---

## Version 1.2.0 - AppExchange Security Review Hardening

**Released:** 2026-05-18

### What's changed

- **Modernized data-access enforcement** - all SOQL queries (14 across production and test classes) now use `WITH USER_MODE`, the current Salesforce-recommended access clause introduced in Spring '22. `WITH USER_MODE` enforces FLS, CRUD, and Sharing rules in a single keyword, replacing the deprecated `WITH SECURITY_ENFORCED` (which only enforced FLS and CRUD). This aligns the package with the current AppExchange Security Review requirement that `WITH SECURITY_ENFORCED` is no longer allowed.
- **Defensive parent-object CRUD checks** - added explicit `Schema.sObjectType.EmailMessage.isAccessible()` guards in helper methods that traverse `LinkedEntityId` relationships (`getAttachmentCounts`, `getEmailAttachments`), so static-analysis tools that don't follow cross-method call graphs can verify the access-check pattern inline.

### What stayed the same

- All end-user features, UI, screens, and behavior are identical to 1.1.0 - no retraining required.
- No permission-set, custom-permission, page-layout, or quick-action changes.
- All 31 Apex tests continue to pass; code coverage remains at 84%+.
- No external endpoints, no callouts, no new dependencies.

### Upgrade notes

Drop-in upgrade from 1.1.0 or 1.0.0. No subscriber-side configuration required.

---

## Version 1.1.0 - Platform Currency & Permission Set Cleanup

**Released:** 2026-05-17

### What's changed

- **API version bump to v65** - Apex classes, Lightning Web Components, and the `Download_Email` Flow now all run on Salesforce API version 65 (Spring '26). Brings the package onto the current Lightning Web Security baseline and enables future use of recent platform features.
- **Permission set rename** - `Email_Forwarder_Full_Access` → `Email_F_D_Full_Access` and `Email_Forwarder_Download_Only` → `Email_F_D_Download_Only`, aligning the permission set API names with the product's official name "Email F&D".
- **Permission set hardening** - removed `EmailForwarderTest` (test class) from the runtime user permission grants in both permission sets. Test classes don't need user-level Apex access; this reduces the package's permission surface and follows current Salesforce ISV best practice.
- **Mixed API version cleanup** - Apex classes previously ran on v62 and LWCs on v59/v62; all now consistent at v65.

### Upgrade notes

If your org has users assigned to the old `Email_Forwarder_Full_Access` or `Email_Forwarder_Download_Only` permission sets from 1.0.0, **reassign them to the new names** after the upgrade: `Email_F_D_Full_Access` and `Email_F_D_Download_Only`. The package upgrade adds the new permission sets but does not automatically migrate existing assignments.

---

## Version 1.0.0 - Initial Release

**Released:** 2025

### What's included

- **Forward Emails** - select one or multiple emails from any Salesforce record and forward them as `.eml` attachments to any email address
- **Download Emails** - download selected emails as a single ZIP file containing individual `.eml` files
- **Attachment support** - all original email attachments are bundled automatically on both forward and download
- **Universal compatibility** - works on any Salesforce object with associated `EmailMessage` records (Cases, Opportunities, Accounts, Contacts, and more)
- **Permission set-based access** - `Email F&D Full Access` and `Email F&D Download Only` permission sets included
- **Custom permissions** - `Allow_Email_Forwarding` and `Allow_Email_Download` control feature visibility per user
- **Download quick action** - `EmailMessage.Download` quick action included and ready to add to page layouts
- **Screen Flow** - `Download_Email` flow wraps the download LWC for quick action use on EmailMessage
- **AppExchange ready** - CRUD/FLS enforcement, `with sharing` keyword, 75%+ Apex test coverage

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
- The **Forward Emails** quick action must be created manually per object - it cannot be packaged as a global action
- **Dynamic Actions** (Lightning App Builder) require manual configuration per record page
- Save Email-to-Case attachments as Salesforce Files must be enabled for attachment support on Email-to-Case records


## Support

Issues or questions → [raise an issue](https://github.com/annindyadas/appExchange-documentation/issues/new?template=email-fd-issue.yml) or contact via the AppExchange listing.
