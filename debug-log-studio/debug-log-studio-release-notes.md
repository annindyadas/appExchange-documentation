# Debug Log Studio — Release Notes

---

## Version 1.0 — 2026

**Initial Release**

### ✨ Features

- **Explorer Tab** — View all debug logs with enriched metadata columns: Type, Class Name, Method Type, Duration, Log Size, and more — beyond the standard Salesforce Debug Log list view.
- **Trace Flags Tab** — Create, view, extend, and delete Trace Flags with Quick Duration presets (5m / 15m / 30m / 1h / 2h / 4h / 8h / 24h).
- **Debug Levels Tab** — Create, edit, and delete Debug Levels with Quick Presets to set all log categories at once.
- **Log Viewer** — Full in-app log viewer with dark-theme console, inline search, and Debug Only filter.
- **AI Summary** — Einstein AI-powered log analysis providing issues summary, root cause, suggested Apex code fixes, and optimization recommendations.
- **Download** — Download any log as a `.txt` file directly from the viewer.
- **Mass Delete** — Bulk delete all logs in the system in one click.
- **Guided Setup Wizard** — Six-step in-app setup with progress tracking for External Client App, Auth Provider, Named Credential, Remote Site Setting, and connection validation.

### 🔧 Technical Notes

- Requires Agentforce-enabled org
- Uses Salesforce Tooling API via Named Credential (OAuth 2.0, Legacy type)
- External Client App with Client Credentials Flow
- Compatible with: Lightning Experience, Developer Edition, Sandbox, Production

---

*For issues or feature requests, [raise an issue on GitHub](https://github.com/annindyadas/sf-debug-studio/issues).*
