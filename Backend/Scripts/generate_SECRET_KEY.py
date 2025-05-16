import os
import binascii

def generate_secret_key(length=32):
    return binascii.hexlify(os.urandom(length)).decode()

# Generate a 32-byte (256-bit) secret key
secret_key = generate_secret_key()
print("Secret Key:", secret_key)

