import { User } from "../entity/User"

export const buildUser = (
  user: User,
): { id: string; name: string; iconUrl: string } => ({
  id: user.user_id,
  name: user.name,
  iconUrl: user.icon_url,
})
