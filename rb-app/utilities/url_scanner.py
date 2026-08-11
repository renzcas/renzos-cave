
import requests
import time

def scan_url(url, log):
    log.insert("end", f"\n--- Scanning {url} ---\n")
    try:
        start = time.time()
        r = requests.get(url, timeout=10)
        end = time.time()

        log.insert("end", f"Status: {r.status_code}\n")
        log.insert("end", f"Time: {round(end-start,3)}s\n")

        for k,v in r.headers.items():
            log.insert("end", f"{k}: {v}\n")

    except Exception as e:
        log.insert("end", f"Error: {e}\n")
