
import requests

TOKENS = {
    "no": None,
    "empty": "",
    "malformed": "abc.def",
    "expired": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.signature",
    "random": "1234567890abcdef"
}

def test_auth(base, ep, log):
    log.insert("end", f"\n[AUTH TEST] {base}/{ep}\n")
    for label, token in TOKENS.items():
        headers = {}
        if token is not None:
            headers["Authorization"] = f"Bearer {token}"
        try:
            r = requests.get(f"{base}/{ep}", headers=headers, timeout=10)
            log.insert("end", f"{label}: {r.status_code}\n")
        except Exception as e:
            log.insert("end", f"Error: {e}\n")
