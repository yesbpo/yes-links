import secrets

ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


def base62_encode(value: int) -> str:
    if value == 0:
        return ALPHABET[0]
    chars: list[str] = []
    base = len(ALPHABET)
    while value > 0:
        value, remainder = divmod(value, base)
        chars.append(ALPHABET[remainder])
    return "".join(reversed(chars))


def generate_shortcode(min_len: int = 5, max_len: int = 8) -> str:
    if min_len < 5 or max_len > 8 or min_len > max_len:
        raise ValueError("Short code length must be between 5 and 8")

    raw = secrets.randbits(48)
    code = base62_encode(raw)

    target_len = min(max(min_len, len(code)), max_len)
    if len(code) < target_len:
        code = (ALPHABET[0] * (target_len - len(code))) + code
    return code[:target_len]
