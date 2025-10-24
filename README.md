
# QR-Intake

QR-Intake is a platform that allows you to create digital intake forms for the use case of a client/patient intake at possibly a clinic office, the vet, any professional service offered where you may required your customer to "check-in" and collect information up front.

## Installation

Dependencies: npm/pnpm/yarn etc...

1. Run `gh repo clone bpluhar/qr-intake`
2. Run `npx convex dev --once --configure=new`
3. Run `node generateKeys.mjs`
4. Take the output of `JWT_PRIVATE_KEY` and `JWKS` and enter them as environment variables on your deployment platform.
5. Run `npm run dev`


## Demo

You can test a live version at https://qr-intake.vercel.app

## License

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) [2025] [Brian Pluhar]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.