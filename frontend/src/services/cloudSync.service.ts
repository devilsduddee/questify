import { supabase } from '@/lib/supabase'

export interface CloudSyncService {
  syncProfile: (name: string, role: string | null, globalAchievements: any[]) => Promise<void>;
  syncAdventure: (adventure: any) => Promise<void>;
  deleteAdventure: (adventureId: string) => Promise<void>;
  fetchCloudAdventures: () => Promise<any[]>;
  fetchCloudProfile: () => Promise<any>;
}

// Simple debounce helper map
const debounceMap = new Map<string, any>()

function debounced<T extends (...args: any[]) => Promise<void>>(
  key: string,
  fn: T,
  delay: number = 1000
): T {
  return ((...args: any[]) => {
    if (debounceMap.has(key)) {
      clearTimeout(debounceMap.get(key))
    }
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          await fn(...args)
          resolve()
        } catch (err) {
          reject(err)
        }
      }, delay)
      debounceMap.set(key, timeout)
    })
  }) as T
}

export const cloudSyncService: CloudSyncService = {
  syncProfile: debounced('sync-profile', async (name: string, role: string | null, globalAchievements: any[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updateData: any = {
      display_name: name,
      global_achievements: globalAchievements
    }
    if (role) {
      updateData.role = role
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      console.error('Failed to sync profile:', error)
    }
  }),

  syncAdventure: debounced('sync-adventure', async (adventure: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('adventures')
      .upsert({
        id: adventure.id,
        user_id: user.id,
        course_name: adventure.courseName,
        world_name: adventure.worldName,
        world_subtitle: adventure.worldSubtitle,
        world_description: adventure.worldDescription,
        world_element: adventure.worldElement,
        difficulty: adventure.difficulty,
        opening_narration: adventure.openingNarration,
        theme: adventure.theme,
        world_icon: adventure.worldIcon,
        estimated_play_time: adventure.estimatedPlayTime,
        completion_reward: adventure.completionReward,
        has_seen_intro: adventure.hasSeenIntro,
        level: adventure.level,
        xp: adventure.xp,
        max_xp: adventure.maxXp,
        gold: adventure.gold,
        achievements: adventure.achievements,
        nodes: adventure.nodes,
        active_node_id: adventure.activeNodeId,
        last_played_at: new Date(adventure.lastPlayedAt).toISOString()
      }, { onConflict: 'id' })

    if (error) {
      console.error('Failed to sync adventure:', error)
    }
  }),

  deleteAdventure: async (adventureId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('adventures')
      .delete()
      .eq('id', adventureId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to delete adventure from cloud:', error)
    }
  },

  fetchCloudAdventures: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('adventures')
      .select('*')
      .eq('user_id', user.id)
      .order('last_played_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch cloud adventures:', error)
      return []
    }

    return data.map((d: any) => ({
      id: d.id,
      courseName: d.course_name,
      worldName: d.world_name,
      worldSubtitle: d.world_subtitle,
      worldDescription: d.world_description,
      worldElement: d.world_element,
      difficulty: d.difficulty,
      openingNarration: d.opening_narration,
      theme: d.theme,
      worldIcon: d.world_icon,
      estimatedPlayTime: d.estimated_play_time,
      completionReward: d.completion_reward,
      hasSeenIntro: d.has_seen_intro,
      level: d.level,
      xp: d.xp,
      maxXp: d.max_xp,
      gold: d.gold,
      achievements: d.achievements || [],
      nodes: d.nodes || [],
      activeNodeId: d.active_node_id,
      lastPlayedAt: new Date(d.last_played_at).getTime(),
      createdAt: new Date(d.created_at).getTime(),
    }))
  },

  fetchCloudProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Failed to fetch cloud profile:', error)
      return null
    }

    return {
      name: data.display_name,
      role: data.role,
      globalAchievements: data.global_achievements || []
    }
  }
}
