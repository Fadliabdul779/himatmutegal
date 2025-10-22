import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import { getRoleEmails } from '../../../../lib/roleEmails';
import { findUserByEmail, createUser } from '../../../../lib/users';

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hima.local';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const structEmail = process.env.STRUCT_EMAIL || 'struct@hima.local';
        const structPassword = process.env.STRUCT_PASSWORD || 'struct123';
        const memberEmail = process.env.MEMBER_EMAIL || 'member@hima.local';
        const memberPassword = process.env.MEMBER_PASSWORD || 'member123';

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: 'admin', name: 'Admin', email: adminEmail, role: 'admin' };
        }
        if (credentials?.email === structEmail && credentials?.password === structPassword) {
          try {
            const existingStruct = await findUserByEmail(structEmail);
            if (!existingStruct) {
              const passwordHash = await bcrypt.hash(structPassword, 10);
              await createUser({ name: 'Struktural', email: structEmail, role: 'struct', status: 'approved', passwordHash });
            }
          } catch {}
          return { id: 'struct', name: 'Struktural', email: structEmail, role: 'struct' };
        }
        if (credentials?.email === memberEmail && credentials?.password === memberPassword) {
          try {
            const existingMember = await findUserByEmail(memberEmail);
            if (!existingMember) {
              const passwordHash = await bcrypt.hash(memberPassword, 10);
              await createUser({ name: 'Anggota', email: memberEmail, role: 'member', status: 'approved', passwordHash });
            }
          } catch {}
          return { id: 'member', name: 'Anggota', email: memberEmail, role: 'member' };
        }
        // Dynamic users from store
        if (credentials?.email && credentials?.password) {
          const u = await findUserByEmail(credentials.email);
          if (u && u.passwordHash && u.status === 'approved') {
            const ok = await bcrypt.compare(credentials.password, u.passwordHash);
            if (ok) return { id: u.id, name: u.name || 'User', email: u.email, role: u.role };
          }
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Derive role and status on initial sign-in; support multiple emails per role
      if (user && user.email) {
        const email = String(user.email).toLowerCase();
        const { admin, struct } = getRoleEmails();
        let role = user.role;
        let status = token.status || 'approved';

        // For Google or unknown provider, decide role/status based on mapping or existing user store
        if (!role) {
          if (admin.includes(email)) {
            role = 'admin';
            status = 'approved';
          } else if (struct.includes(email)) {
            role = 'struct';
            status = 'approved';
          } else {
            const existing = await findUserByEmail(email);
            if (existing) {
              role = existing.role || 'member';
              status = existing.status || 'pending';
            } else {
              const created = await createUser({ name: user.name || 'User', email, role: 'member', status: 'pending' });

              // Notify Admin about new Google sign-in registration (pending approval)
              try {
                if (created?.user && process.env.SENDGRID_API_KEY && process.env.EMAIL_ADMIN && process.env.EMAIL_FROM) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  await sgMail.send({
                    to: process.env.EMAIL_ADMIN,
                    from: process.env.EMAIL_FROM,
                    subject: 'Pendaftar akun baru via Google menunggu verifikasi',
                    html: `<p>Ada pendaftar baru via Google:</p>
                           <ul>
                             <li>Nama: ${created.user.name}</li>
                             <li>Email: ${created.user.email}</li>
                             <li>Role: ${created.user.role}</li>
                             <li>Status: ${created.user.status}</li>
                           </ul>
                           <p>Silakan verifikasi di halaman Admin &rarr; Members.</p>`,
                  });
                }
              } catch (e) {
                console.error('sendgrid notify admin (google register) error', e);
              }

              role = 'member';
              status = 'pending';
            }
          }
        }
        token.role = role || token.role;
        token.status = status;
      } else if (user) {
        // Credentials provider sets role directly and implies approved status
        token.role = user.role || token.role;
        token.status = 'approved';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.status = token.status;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'devsecret',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };