# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Welcome Back" [level=1] [ref=e6]
      - paragraph [ref=e7]: Sign in to your account
    - generic [ref=e8]: Invalid credentials
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email
        - textbox "Email" [ref=e12]:
          - /placeholder: you@example.com
          - text: test-1761611608104@example.com
      - generic [ref=e13]:
        - generic [ref=e14]: Password
        - textbox "Password" [ref=e15]:
          - /placeholder: ••••••••
          - text: Test123456!
      - button "Sign In" [ref=e16] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e22]: Or continue with
      - button "Continue with Google" [ref=e23] [cursor=pointer]:
        - img [ref=e24]
        - text: Continue with Google
    - paragraph [ref=e29]:
      - text: Don't have an account?
      - link "Sign up" [ref=e30] [cursor=pointer]:
        - /url: /auth/register
  - alert [ref=e31]
```