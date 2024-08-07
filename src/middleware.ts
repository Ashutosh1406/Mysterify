// import { NextRequest , NextResponse } from 'next/server'
// export {default} from "next-auth/middleware"
// import { getToken } from "next-auth/jwt"


// This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const token = await getToken({req:request})
//     const url = request.nextUrl

//     if(token && 
//         (
//             url.pathname.startsWith('sign-in') ||
//             url.pathname.startsWith('sign-up') ||
//             url.pathname.startsWith('/verify') ||
//             url.pathname.startsWith('/')
//         )
//         )   {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//     return NextResponse.redirect(new URL('/home', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: [
//     '/sign-in',
//     '/sign-up',
//     '/',
//     '/dashboard/:path*',
//     '/verify/:path*'
//     ]
// };

// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req : request });
//   const url = request.nextUrl;

//   // Redirect to dashboard if the user is already authenticated
//   // and trying to access sign-in, sign-up, or home page
//   if (
//     token &&
//     (url.pathname.startsWith('/sign-in') ||
//       url.pathname.startsWith('/sign-up') ||
//       url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (!token && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }


// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   // Redirect to dashboard if the user is already authenticated
//   // and trying to access sign-in, sign-up, or home page
//   if (
//     token &&
//     (url.pathname.startsWith('/sign-in') ||
//       url.pathname.startsWith('/sign-up') ||
//       url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (!token && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   // if(!token && url.pathname.startsWith('/forgot-password')) {
//   //   // return NextResponse.redirect(new URL())
//   // }

//   return NextResponse.next();
// }
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*','/forgot/reset/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // if(!token && url.pathname.startsWith('/forgot/reset')){
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }

  // if (!token && url.pathname.startsWith('/forgot/reset')) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }

  return NextResponse.next();
}

// async function isValidResetToken(token:any,username:any) {
//   // Implement your logic to verify the reset token here
//   // This could involve checking the token against a database or some other storage
//   if (!token) return false;
//   if(!username) return false;

//   await dbConnect()

//   const user = await UserModel.findOne({username})
//   if(!user || user.resetToken !== token){
//     return false;
//   }
//   const now = new Date();

//   if (!user.resetPasswordExpiry || now > user.resetPasswordExpiry) {
//     return false;
//   }

//   return true;
// }