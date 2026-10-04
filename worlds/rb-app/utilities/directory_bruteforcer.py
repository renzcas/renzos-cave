
import requests

COMMON = ["admin","api","login","config","debug","test","v1","v2"]

def brute_force(base, log):
    log.insert("end", f"\n[DIR BRUTE] {base}\n")
    for d in COMMON:
        url = f"{base}/{d}"
        try:
            r = requests.get(url, timeout=8)
            log.insert("end", f"{r.status_code} → {url}\n")
        except Exception as e:
            log.insert("end", f"Error: {e}\n")
