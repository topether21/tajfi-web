## References

1. [What Are Passkeys?](https://www.passkeys.com/what-are-passkeys#:~:text=Simply%20put%2C%20a%20passkey%20is,%2C%20remembered%2C%20or%20written%20down.)

Simply put, a passkey is a cryptographic key designed to replace passwords.

2. [pubKeyCredParams](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-pubkeycredparams)

3. [Algorithms](https://www.iana.org/assignments/cose/cose.xhtml#algorithms)

4. [Available Algorithms](https://www.corbado.com/blog/webauthn-pubkeycredparams-credentialpublickey)

Using -7 (ES256) to generate a Bitcoin-compatible signature is not feasible due to fundamental differences in the cryptographic algorithms and curves used by ES256 and Bitcoin.
Understanding the Cryptographic Differences
ES256 (alg: -7)
Curve: P-256 (also known as secp256r1)
Signature Scheme: ECDSA using SHA-256
Usage: Commonly used in WebAuthn and other applications requiring ECDSA with P-256.
Bitcoin's Cryptography
Curve: secp256k1
Signature Scheme: ECDSA using SHA-256
Usage: Bitcoin transactions and addresses are based on secp256k1, which is different from P-256.
Why ES256 (-7) Isn't Suitable for Bitcoin
Curve Mismatch:
Bitcoin uses the secp256k1 curve, while ES256 uses P-256. These are distinct elliptic curves with different parameters and properties.
Signature Verification:
Bitcoin nodes and wallets are designed to verify signatures using secp256k1. A signature generated with P-256 cannot be verified using secp256k1, leading to invalid transactions.
3. Address Generation:
Bitcoin addresses are derived from secp256k1 public keys. Using a P-256 key would result in incompatible address formats.


