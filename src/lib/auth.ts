import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import nacl from "tweetnacl"
import bs58 from "bs58"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "solana",
      name: "Solana Wallet",
      credentials: {
        wallet: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.wallet || !credentials?.signature || !credentials?.message) {
          return null
        }

        const wallet = credentials.wallet as string
        const signature = credentials.signature as string
        const message = credentials.message as string

        try {
          const messageBytes = new TextEncoder().encode(message)
          const signatureBytes = bs58.decode(signature)
          const publicKeyBytes = bs58.decode(wallet)

          const isValid = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
          )

          if (!isValid) return null

          // Dynamic import to avoid initialization error when DB is unavailable
          const { prisma } = await import("@/lib/prisma")

          const nonce = await prisma.verificationNonce.findFirst({
            where: {
              wallet,
              used: false,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          })

          if (!nonce) return null

          await prisma.verificationNonce.update({
            where: { id: nonce.id },
            data: { used: true },
          })

          let user = await prisma.user.findUnique({
            where: { walletAddress: wallet },
          })

          if (!user) {
            const adminWallets = (process.env.ADMIN_WALLETS || "").split(",").map(w => w.trim()).filter(Boolean)
            const isAdmin = adminWallets.includes(wallet)
            user = await prisma.user.create({
              data: {
                walletAddress: wallet,
                role: isAdmin ? "ADMIN" : "USER",
              },
            })
          } else {
            const adminWallets = (process.env.ADMIN_WALLETS || "").split(",").map(w => w.trim()).filter(Boolean)
            if (adminWallets.includes(wallet) && user.role !== "ADMIN") {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { role: "ADMIN" },
              })
            }
          }

          if (user.isBanned) return null

          return {
            id: user.id,
            name: user.username || user.walletAddress,
            email: user.email,
            image: user.avatarUrl,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      if (token.userId) {
        try {
          const { prisma } = await import("@/lib/prisma")
          const dbUser = await prisma.user.findUnique({
            where: { id: token.userId as string },
            select: {
              id: true,
              walletAddress: true,
              username: true,
              role: true,
              onboardedAt: true,
            },
          })
          if (dbUser) {
            token.walletAddress = dbUser.walletAddress
            token.username = dbUser.username
            token.onboarded = !!dbUser.onboardedAt

            const adminWallets = (process.env.ADMIN_WALLETS || "").split(",").map(w => w.trim()).filter(Boolean)
            if (adminWallets.includes(dbUser.walletAddress) && dbUser.role !== "ADMIN") {
              await prisma.user.update({ where: { id: dbUser.id }, data: { role: "ADMIN" } })
              token.role = "ADMIN"
            } else {
              token.role = dbUser.role
            }
          }
        } catch {
          // Database unavailable — skip user enrichment
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        ;(session as any).walletAddress = token.walletAddress
        ;(session as any).role = token.role
        ;(session as any).onboarded = token.onboarded
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
