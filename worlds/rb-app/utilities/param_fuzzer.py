
import requests

FUZZ = {
    "debug":["true","1"],
    "admin":["true","1"],
    "test":["true","1"],
    "verbose":["true","1"]
}

def fuzz_params(base, ep, log):
    log.insert("end", f"\n[PARAM FUZZ] {base}/{ep}\n")
    for p,vals in FUZZ.items():
        for v in vals:
            url = f"{base}/{ep}?{p}={v}"
            try:
                r = requests.get(url, timeout=10)
                log.insert("end", f"{r.status_code} → {url}\n")
            except Exception as e:
                log.insert("end", f"Error: {e}\n")
