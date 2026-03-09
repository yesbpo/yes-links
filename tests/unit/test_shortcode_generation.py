from src.services.shortcode import ALPHABET, generate_shortcode


def test_shortcode_generation():
    code = generate_shortcode(5, 8)
    assert 5 <= len(code) <= 8
    assert all(char in ALPHABET for char in code)
