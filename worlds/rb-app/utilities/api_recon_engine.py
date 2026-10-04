
import requests
import json

ENDPOINTS = ["api","api/v1","api/v2","auth","users","status","debug"]

def api_recon(base, log):
    log.insert("end", f"\n[API RECON] {base}\n")
    for ep in ENDPOINTS:
        url = f"{base}/{ep}"
        try:
            r = requests.get(url, timeout=10)
            log.insert("end", f"{r.status_code} → {url}\n")
            try:
                log.insert("end", json.dumps(r.json(), indent=2) + "\n")
            except:
                pass
        except Exception as e:
            log.insert("end", f"Error: {e}\n")
