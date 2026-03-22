import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options } as Parameters<typeof request.cookies.set>[0]);
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options } as Parameters<typeof response.cookies.set>[0]);
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: "", ...options } as Parameters<typeof request.cookies.set>[0]);
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options } as Parameters<typeof response.cookies.set>[0]);
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
