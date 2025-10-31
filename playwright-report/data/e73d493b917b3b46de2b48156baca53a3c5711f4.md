# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Create Account" [level=1] [ref=e6]
      - paragraph [ref=e7]: Get started with Web Builder
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Name
        - textbox "Name" [ref=e11]:
          - /placeholder: John Doe
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "Email" [ref=e14]:
          - /placeholder: you@example.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - textbox "Password" [ref=e17]:
          - /placeholder: ••••••••
      - generic [ref=e18]:
        - generic [ref=e19]: Confirm Password
        - textbox "Confirm Password" [ref=e20]:
          - /placeholder: ••••••••
      - button "Create Account" [ref=e21] [cursor=pointer]
    - generic [ref=e22]:
      - generic [ref=e27]: Or continue with
      - button "Continue with Google" [ref=e28] [cursor=pointer]:
        - img [ref=e29]
        - text: Continue with Google
    - paragraph [ref=e34]:
      - text: Already have an account?
      - link "Sign in" [ref=e35] [cursor=pointer]:
        - /url: /auth/login
  - alert [ref=e36]
```