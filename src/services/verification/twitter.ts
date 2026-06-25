import type { TwitterVerificationData, VerificationResult } from "./types"
import { FALLBACK_REASON } from "./types"

async function twitterFetch(endpoint: string): Promise<Response> {
  return fetch(`https://api.twitter.com/2${endpoint}`, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
    cache: "no-store",
  })
}

async function getUserId(handle: string): Promise<string | null> {
  const username = handle.replace(/^@/, "")
  const res = await twitterFetch(`/users/by/username/${username}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.data?.id || null
}

async function checkFollow(
  userHandle: string,
  targetAccount: string
): Promise<VerificationResult> {
  const targetUsername = targetAccount.replace(/^@/, "")
  const targetId = await getUserId(targetUsername)
  if (!targetId) {
    return { verified: false, reason: `Target account @${targetUsername} not found` }
  }

  // Check followers of target account (paginated)
  const userUsername = userHandle.replace(/^@/, "").toLowerCase()
  let paginationToken: string | undefined

  for (let page = 0; page < 10; page++) {
    const params = new URLSearchParams({ max_results: "1000" })
    if (paginationToken) params.set("pagination_token", paginationToken)

    const res = await twitterFetch(`/users/${targetId}/followers?${params}`)

    if (res.status === 429) {
      return { verified: false, reason: FALLBACK_REASON }
    }
    if (!res.ok) {
      return { verified: false, reason: FALLBACK_REASON }
    }

    const data = await res.json()
    const followers = data.data || []

    const found = followers.some(
      (f: { username: string }) => f.username.toLowerCase() === userUsername
    )
    if (found) {
      return { verified: true, reason: "Follow verified" }
    }

    paginationToken = data.meta?.next_token
    if (!paginationToken) break
  }

  return { verified: false, reason: `You are not following @${targetUsername}. Please follow first and try again.` }
}

async function checkRetweet(
  userHandle: string,
  tweetId: string
): Promise<VerificationResult> {
  const userUsername = userHandle.replace(/^@/, "").toLowerCase()
  let paginationToken: string | undefined

  for (let page = 0; page < 5; page++) {
    const params = new URLSearchParams({ max_results: "100" })
    if (paginationToken) params.set("pagination_token", paginationToken)

    const res = await twitterFetch(`/tweets/${tweetId}/retweeted_by?${params}`)

    if (res.status === 429) return { verified: false, reason: FALLBACK_REASON }
    if (!res.ok) return { verified: false, reason: FALLBACK_REASON }

    const data = await res.json()
    const users = data.data || []

    const found = users.some(
      (u: { username: string }) => u.username.toLowerCase() === userUsername
    )
    if (found) return { verified: true, reason: "Retweet verified" }

    paginationToken = data.meta?.next_token
    if (!paginationToken) break
  }

  return { verified: false, reason: "You have not retweeted this post. Please retweet and try again." }
}

async function checkLike(
  userHandle: string,
  tweetId: string
): Promise<VerificationResult> {
  const userUsername = userHandle.replace(/^@/, "").toLowerCase()
  let paginationToken: string | undefined

  for (let page = 0; page < 5; page++) {
    const params = new URLSearchParams({ max_results: "100" })
    if (paginationToken) params.set("pagination_token", paginationToken)

    const res = await twitterFetch(`/tweets/${tweetId}/liking_users?${params}`)

    if (res.status === 429) return { verified: false, reason: FALLBACK_REASON }
    if (!res.ok) return { verified: false, reason: FALLBACK_REASON }

    const data = await res.json()
    const users = data.data || []

    const found = users.some(
      (u: { username: string }) => u.username.toLowerCase() === userUsername
    )
    if (found) return { verified: true, reason: "Like verified" }

    paginationToken = data.meta?.next_token
    if (!paginationToken) break
  }

  return { verified: false, reason: "You have not liked this post. Please like it and try again." }
}

async function checkTweet(
  userHandle: string,
  requiredText: string
): Promise<VerificationResult> {
  const username = userHandle.replace(/^@/, "")
  const query = encodeURIComponent(`from:${username} ${requiredText}`)
  const res = await twitterFetch(`/tweets/search/recent?query=${query}&max_results=10`)

  if (res.status === 429) return { verified: false, reason: FALLBACK_REASON }
  if (!res.ok) return { verified: false, reason: FALLBACK_REASON }

  const data = await res.json()
  const count = data.meta?.result_count || 0

  if (count > 0) {
    return { verified: true, reason: "Tweet verified", rawResponse: data.data?.[0] }
  }

  return { verified: false, reason: `No recent tweet found containing "${requiredText}". Please post and try again.` }
}

export async function verifyTwitterAction(
  userXHandle: string,
  data: TwitterVerificationData
): Promise<VerificationResult> {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  switch (data.action) {
    case "FOLLOW_CHECK":
      if (!data.targetAccount) return { verified: false, reason: "Task misconfigured: missing targetAccount" }
      return checkFollow(userXHandle, data.targetAccount)

    case "RETWEET_CHECK":
      if (!data.tweetId) return { verified: false, reason: "Task misconfigured: missing tweetId" }
      return checkRetweet(userXHandle, data.tweetId)

    case "LIKE_CHECK":
      if (!data.tweetId) return { verified: false, reason: "Task misconfigured: missing tweetId" }
      return checkLike(userXHandle, data.tweetId)

    case "TWEET_CHECK":
      if (!data.requiredText) return { verified: false, reason: "Task misconfigured: missing requiredText" }
      return checkTweet(userXHandle, data.requiredText)

    default:
      return { verified: false, reason: FALLBACK_REASON }
  }
}
